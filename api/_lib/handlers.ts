import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Framework-agnostic API logic shared by the Vercel serverless functions
// (api/*.ts) and the local Vite dev middleware (vite.config.ts).
// Reads/writes use the SERVICE ROLE key and therefore bypass RLS. This module
// must NEVER be imported into client code.

export type Env = Record<string, string | undefined>
export type ApiResult = { status: number; body: unknown }

const VALID_TABLES = ['products', 'projects', 'testimonials'] as const
export type TableName = (typeof VALID_TABLES)[number]

export function isValidTable(name: string): name is TableName {
  return (VALID_TABLES as readonly string[]).includes(name)
}

let cachedClient: SupabaseClient | null = null

export function getAdminClient(env: Env): SupabaseClient {
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Faltan variables de entorno de Supabase (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).'
    )
  }
  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return cachedClient
}

function stripReadOnly(obj: Record<string, unknown>): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...obj }
  delete clone.id
  delete clone.created_at
  return clone
}

export async function resourceHandler(
  env: Env,
  table: string,
  method: string,
  query: Record<string, string | undefined>,
  body: any
): Promise<ApiResult> {
  let supabase: SupabaseClient
  try {
    supabase = getAdminClient(env)
  } catch (e: any) {
    return { status: 500, body: { error: e?.message || 'Error de configuración' } }
  }

  try {
    switch (method) {
      case 'GET': {
        let query = supabase.from(table).select('*')
        // Only products/projects have a 'featured' column.
        if (table === 'products' || table === 'projects') {
          query = query.order('featured', { ascending: false })
        }
        query = query.order('created_at', { ascending: false })
        const { data, error } = await query
        if (error) throw error
        return { status: 200, body: data ?? [] }
      }
      case 'POST': {
        if (!body || typeof body !== 'object') {
          return { status: 400, body: { error: 'Cuerpo inválido' } }
        }
        const { data, error } = await supabase
          .from(table)
          .insert(stripReadOnly(body))
          .select()
          .single()
        if (error) throw error
        return { status: 201, body: data }
      }
      case 'PUT': {
        const id = body?.id
        if (!id) return { status: 400, body: { error: 'Falta el id' } }
        const { data, error } = await supabase
          .from(table)
          .update(stripReadOnly(body))
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return { status: 200, body: data }
      }
      case 'DELETE': {
        const id = query.id ?? body?.id
        if (!id) return { status: 400, body: { error: 'Falta el id' } }
        const { error } = await supabase.from(table).delete().eq('id', id)
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

export async function uploadHandler(env: Env, body: any): Promise<ApiResult> {
  let supabase: SupabaseClient
  try {
    supabase = getAdminClient(env)
  } catch (e: any) {
    return { status: 500, body: { error: e?.message || 'Error de configuración' } }
  }

  const image: string | undefined = body?.image
  const filename: string | undefined = body?.filename
  if (!image) return { status: 400, body: { error: 'Falta la imagen' } }

  const match = /^data:(.+?);base64,([\s\S]*)$/.exec(image)
  if (!match) {
    // Not a data URL — assume it is already a usable URL.
    return { status: 200, body: { url: image } }
  }

  const contentType = match[1]
  const buffer = Buffer.from(match[2], 'base64')
  const extFromName = filename && filename.includes('.') ? filename.split('.').pop() : undefined
  const ext = (extFromName || contentType.split('/')[1] || 'jpg')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('tapipocitos-images')
    .upload(path, buffer, { contentType, upsert: false })

  if (error) {
    // Storage not available — fall back to inlining the data URL so the image
    // still displays (stored directly in the row).
    return { status: 200, body: { url: image, fallback: true, warning: error.message } }
  }

  const { data } = supabase.storage.from('tapipocitos-images').getPublicUrl(path)
  return { status: 200, body: { url: data.publicUrl } }
}

export function authHandler(env: Env, body: any): ApiResult {
  const expected = env.ADMIN_PASSWORD
  const password = body?.password
  if (expected && password && password === expected) {
    return { status: 200, body: { success: true } }
  }
  return { status: 401, body: { success: false } }
}

// Personalización del sitio (tema + textos del hero). GET es público (el sitio
// lo lee al cargar); PUT requiere la contraseña de admin. Si la tabla no existe
// todavía, GET devuelve los valores por defecto y el sitio sigue andando igual.
const SETTINGS_DEFAULTS = {
  theme: 'cuero',
  hero_title: 'El arte de tapizar,',
  hero_accent: 'hecho a mano',
  hero_subtitle:
    'Desde 1975, la familia Calistro transforma telas, cueros y espumas en piezas que cuentan historias. Retapizados, restauraciones y muebles a medida en Montevideo — con armazones garantidos de por vida.',
}

export async function settingsHandler(
  env: Env,
  method: string,
  body: any,
  headers: Record<string, any>
): Promise<ApiResult> {
  if (method === 'GET') {
    try {
      const supabase = getAdminClient(env)
      const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()
      if (data) {
        return {
          status: 200,
          body: {
            theme: data.theme || SETTINGS_DEFAULTS.theme,
            hero_title: data.hero_title || SETTINGS_DEFAULTS.hero_title,
            hero_accent: data.hero_accent || SETTINGS_DEFAULTS.hero_accent,
            hero_subtitle: data.hero_subtitle || SETTINGS_DEFAULTS.hero_subtitle,
          },
        }
      }
    } catch {
      // sin tabla o sin conexión: defaults
    }
    return { status: 200, body: SETTINGS_DEFAULTS }
  }

  if (method === 'PUT') {
    const provided = headers?.['x-admin-password']
    if (!env.ADMIN_PASSWORD || provided !== env.ADMIN_PASSWORD) {
      return { status: 401, body: { error: 'No autorizado' } }
    }
    try {
      const supabase = getAdminClient(env)
      const patch = {
        id: 1,
        theme: typeof body?.theme === 'string' ? body.theme : SETTINGS_DEFAULTS.theme,
        hero_title: typeof body?.hero_title === 'string' ? body.hero_title : '',
        hero_accent: typeof body?.hero_accent === 'string' ? body.hero_accent : '',
        hero_subtitle: typeof body?.hero_subtitle === 'string' ? body.hero_subtitle : '',
        updated_at: new Date().toISOString(),
      }
      const { data, error } = await supabase.from('settings').upsert(patch).select().single()
      if (error) throw error
      return { status: 200, body: data }
    } catch (e: any) {
      return { status: 500, body: { error: e?.message || 'Error del servidor' } }
    }
  }

  return { status: 405, body: { error: 'Método no permitido' } }
}

// Agenda (recordatorios/entregas del taller). TODO requiere la contraseña de
// admin vía header x-admin-password: es una herramienta interna, nada es público.
export async function agendaHandler(
  env: Env,
  method: string,
  query: Record<string, string | undefined>,
  body: any,
  headers: Record<string, any>
): Promise<ApiResult> {
  const provided = headers?.['x-admin-password']
  if (!env.ADMIN_PASSWORD || provided !== env.ADMIN_PASSWORD) {
    return { status: 401, body: { error: 'No autorizado' } }
  }
  if (method === 'POST' && (!body || !body.title || !body.date)) {
    return { status: 400, body: { error: 'Faltan título o fecha' } }
  }
  return resourceHandler(env, 'agenda', method, query, body)
}

// Leads (contact/quote requests). POST is public (form submission); reading or
// deleting requires the admin password via the x-admin-password header.
export async function leadsHandler(
  env: Env,
  method: string,
  query: Record<string, string | undefined>,
  body: any,
  headers: Record<string, any>
): Promise<ApiResult> {
  if (method === 'POST') {
    if (!body || !body.name) {
      return { status: 400, body: { error: 'Falta el nombre' } }
    }
    return resourceHandler(env, 'leads', 'POST', query, body)
  }

  const provided = headers?.['x-admin-password']
  if (!env.ADMIN_PASSWORD || provided !== env.ADMIN_PASSWORD) {
    return { status: 401, body: { error: 'No autorizado' } }
  }
  return resourceHandler(env, 'leads', method, query, body)
}
