import { useEffect, useState } from 'react'
import { getAdminPassword } from './auth'

/* Personalización del sitio: tema de color + textos del hero.
   Curaduría cerrada de temas: los cuatro asientan bien sobre la base
   crema/espresso, así cualquier elección queda profesional. */

export interface SiteSettings {
  theme: string
  hero_title: string
  hero_accent: string
  hero_subtitle: string
}

export const SETTINGS_DEFAULTS: SiteSettings = {
  theme: 'cuero',
  hero_title: 'El arte de tapizar,',
  hero_accent: 'hecho a mano',
  hero_subtitle:
    'Desde 1975, la familia Calistro transforma telas, cueros y espumas en piezas que cuentan historias. Retapizados, restauraciones y muebles a medida en Montevideo — con armazones garantidos de por vida.',
}

export const THEMES: Record<
  string,
  { label: string; accent: string; soft: string; strong: string; ground: string }
> = {
  // ground: el "papel" del sitio vira sutil hacia el tono elegido;
  // las secciones espresso oscuras quedan fijas como constante de marca.
  cuero: { label: 'Cuero', accent: '#C97A40', soft: '#E8B380', strong: '#B56A33', ground: '#F5F0EB' },
  oliva: { label: 'Oliva', accent: '#7C8B4D', soft: '#AEBE7E', strong: '#647240', ground: '#F1F2E7' },
  vino: { label: 'Vino', accent: '#9A4A50', soft: '#C68F93', strong: '#7E3A3F', ground: '#F7EEEC' },
  petroleo: { label: 'Petróleo', accent: '#40756B', soft: '#82ACA3', strong: '#335E56', ground: '#EDF2F0' },
}

/** Aplica el tema pintando las variables de marca en :root. */
export function applyTheme(themeKey: string) {
  const theme = THEMES[themeKey] || THEMES.cuero
  const root = document.documentElement.style
  root.setProperty('--brand-accent', theme.accent)
  root.setProperty('--brand-accent-soft', theme.soft)
  root.setProperty('--brand-accent-strong', theme.strong)
  root.setProperty('--brand-ground', theme.ground)
  // --background alimenta las clases bg-background de Tailwind.
  root.setProperty('--background', theme.ground)
}

let cached: SiteSettings | null = null
let inflight: Promise<SiteSettings> | null = null

export function getSettings(): Promise<SiteSettings> {
  if (cached) return Promise.resolve(cached)
  if (!inflight) {
    inflight = fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : SETTINGS_DEFAULTS))
      .then((data: SiteSettings) => {
        cached = { ...SETTINGS_DEFAULTS, ...data }
        return cached
      })
      .catch(() => SETTINGS_DEFAULTS)
  }
  return inflight
}

/** Hook con defaults inmediatos; se actualiza cuando llega la configuración. */
export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(cached || SETTINGS_DEFAULTS)
  useEffect(() => {
    getSettings().then(setSettings)
  }, [])
  return settings
}

/** Guardado desde el admin (y refresco del cache local). */
export async function saveSettings(next: SiteSettings): Promise<boolean> {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': getAdminPassword(),
      },
      body: JSON.stringify(next),
    })
    if (!res.ok) return false
    cached = { ...SETTINGS_DEFAULTS, ...next }
    return true
  } catch {
    return false
  }
}
