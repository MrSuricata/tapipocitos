import webpush from 'web-push'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getAdminClient, type Env, type ApiResult } from './handlers.js'

// Notificaciones push de la agenda. Todo es privado del admin.
// Las claves VAPID se auto-generan la primera vez y quedan en la tabla
// push_config (solo accesible con service_role), así no hay que tocar env vars.

const VAPID_SUBJECT = 'mailto:tapipocitos@gmail.com'

interface VapidKeys {
  publicKey: string
  privateKey: string
}

async function ensureVapidKeys(supabase: SupabaseClient): Promise<VapidKeys> {
  const { data } = await supabase.from('push_config').select('*').eq('id', 1).maybeSingle()
  if (data) return { publicKey: data.vapid_public, privateKey: data.vapid_private }
  const keys = webpush.generateVAPIDKeys()
  const { error } = await supabase
    .from('push_config')
    .insert({ id: 1, vapid_public: keys.publicKey, vapid_private: keys.privateKey })
  if (error) {
    // Carrera entre dos requests: reintentar la lectura.
    const { data: retry } = await supabase.from('push_config').select('*').eq('id', 1).maybeSingle()
    if (retry) return { publicKey: retry.vapid_public, privateKey: retry.vapid_private }
    throw error
  }
  return keys
}

function isAuthorized(env: Env, headers: Record<string, any>): boolean {
  const provided = headers?.['x-admin-password']
  return Boolean(env.ADMIN_PASSWORD && provided === env.ADMIN_PASSWORD)
}

// GET → clave pública (bootstrap). POST → guardar suscripción. DELETE → borrarla.
export async function pushHandler(
  env: Env,
  method: string,
  body: any,
  headers: Record<string, any>
): Promise<ApiResult> {
  if (!isAuthorized(env, headers)) return { status: 401, body: { error: 'No autorizado' } }

  let supabase: SupabaseClient
  try {
    supabase = getAdminClient(env)
  } catch (e: any) {
    return { status: 500, body: { error: e?.message || 'Error de configuración' } }
  }

  try {
    switch (method) {
      case 'GET': {
        const keys = await ensureVapidKeys(supabase)
        return { status: 200, body: { publicKey: keys.publicKey } }
      }
      case 'POST': {
        const sub = body?.subscription
        if (!sub?.endpoint) return { status: 400, body: { error: 'Falta la suscripción' } }
        const { error } = await supabase
          .from('push_subscriptions')
          .upsert({ endpoint: sub.endpoint, subscription: sub }, { onConflict: 'endpoint' })
        if (error) throw error
        // Notificación de bienvenida inmediata: confirma en el momento que
        // el dispositivo recibe pushes de verdad.
        let welcomed = false
        try {
          const keys = await ensureVapidKeys(supabase)
          await webpush.sendNotification(
            sub,
            JSON.stringify({
              title: '🔔 Avisos activados',
              body: 'Así vas a ver los recordatorios de la agenda en este dispositivo.',
              url: '/admin',
            }),
            { vapidDetails: { subject: VAPID_SUBJECT, publicKey: keys.publicKey, privateKey: keys.privateKey } }
          )
          welcomed = true
        } catch {
          // Si la bienvenida falla la suscripción igual queda guardada.
        }
        return { status: 201, body: { success: true, welcomed } }
      }
      case 'DELETE': {
        const endpoint = body?.endpoint
        if (!endpoint) return { status: 400, body: { error: 'Falta el endpoint' } }
        const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
        if (error) throw error
        return { status: 200, body: { success: true } }
      }
      default:
        return { status: 405, body: { error: 'Método no permitido' } }
    }
  } catch (e: any) {
    return { status: 500, body: { error: e?.message || 'Error del servidor' } }
  }
}

/* ---------- Disparo de avisos vencidos (lo llama el cron) ---------- */

// Uruguay no tiene horario de verano, pero usamos la zona por nombre igual.
function nowInMontevideo(): { date: string; time: string } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Montevideo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  }
}

const TYPE_EMOJI: Record<string, string> = {
  llamar: '📞',
  retirar: '🚚',
  entregar: '📦',
  cotizar: '🧾',
  otro: '📌',
}

export async function notifyDueHandler(
  env: Env,
  headers: Record<string, any>
): Promise<ApiResult> {
  if (!isAuthorized(env, headers)) return { status: 401, body: { error: 'No autorizado' } }

  let supabase: SupabaseClient
  try {
    supabase = getAdminClient(env)
  } catch (e: any) {
    return { status: 500, body: { error: e?.message || 'Error de configuración' } }
  }

  try {
    const { date: today, time: now } = nowInMontevideo()

    const { data: items, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('done', false)
      .eq('notified', false)
      .lte('date', today)
    if (error) throw error

    // Con hora: avisa cuando llega la hora. Sin hora: a las 08:00 del día.
    const due = (items ?? []).filter(
      (it) => it.date < today || (it.time ? it.time <= now : now >= '08:00')
    )
    if (due.length === 0) return { status: 200, body: { due: 0, sent: 0 } }

    const { data: subs, error: subErr } = await supabase.from('push_subscriptions').select('*')
    if (subErr) throw subErr
    if (!subs || subs.length === 0) {
      // Sin dispositivos suscriptos no marcamos nada: cuando Brian active las
      // notificaciones, el próximo cron manda lo que siga pendiente.
      return { status: 200, body: { due: due.length, sent: 0, subscriptions: 0 } }
    }

    const keys = await ensureVapidKeys(supabase)
    const vapidDetails = { subject: VAPID_SUBJECT, publicKey: keys.publicKey, privateKey: keys.privateKey }

    let sent = 0
    for (const item of due) {
      const emoji = TYPE_EMOJI[item.type] ?? '📌'
      const overdueTag = item.date < today ? ' (vencido)' : ''
      const payload = JSON.stringify({
        title: `${emoji} ${item.title}${overdueTag}`,
        body: [item.client, item.time ? `${item.time} h` : ''].filter(Boolean).join(' · ') || 'Agenda Tapipocitos',
        url: '/admin',
      })
      for (const sub of subs) {
        try {
          await webpush.sendNotification(sub.subscription, payload, { vapidDetails })
          sent++
        } catch (e: any) {
          // Suscripción muerta (dispositivo desinstalado/expirado): limpiarla.
          if (e?.statusCode === 404 || e?.statusCode === 410) {
            await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
          }
        }
      }
    }

    const ids = due.map((it) => it.id)
    await supabase.from('agenda').update({ notified: true }).in('id', ids)

    return { status: 200, body: { due: due.length, sent, subscriptions: subs.length } }
  } catch (e: any) {
    return { status: 500, body: { error: e?.message || 'Error del servidor' } }
  }
}
