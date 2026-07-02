import { getAdminPassword } from './auth'

// Suscripción a notificaciones push desde el panel de admin.
// En iPhone requiere iOS 16.4+ y la app instalada en pantalla de inicio.

export type PushStatus = 'unsupported' | 'ios-needs-install' | 'off' | 'on'

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  )
}

export function pushSupport(): PushStatus {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return isIos() && !isStandalone() ? 'ios-needs-install' : 'unsupported'
  }
  if (isIos() && !isStandalone()) return 'ios-needs-install'
  return 'off'
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    return (await reg?.pushManager.getSubscription()) ?? null
  } catch {
    return null
  }
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

function authHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-admin-password': getAdminPassword(),
  }
}

/** Pide permiso, se suscribe y registra la suscripción en el backend. */
export async function enablePush(): Promise<{ ok: boolean; reason?: string }> {
  try {
    // En el sitio público el SW solo se registra en prod; acá lo garantizamos.
    let reg = await navigator.serviceWorker.getRegistration()
    if (!reg) reg = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return { ok: false, reason: 'Permiso denegado' }

    const res = await fetch('/api/push', { headers: authHeaders() })
    if (!res.ok) return { ok: false, reason: 'No se pudo obtener la clave del servidor' }
    const { publicKey } = await res.json()

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })

    const save = await fetch('/api/push', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    })
    if (!save.ok) return { ok: false, reason: 'No se pudo guardar la suscripción' }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, reason: e?.message || 'Error desconocido' }
  }
}

export async function disablePush(): Promise<boolean> {
  try {
    const sub = await getPushSubscription()
    if (!sub) return true
    await fetch('/api/push', {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ endpoint: sub.endpoint }),
    })
    await sub.unsubscribe()
    return true
  } catch {
    return false
  }
}
