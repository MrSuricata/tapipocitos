import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PaintBrushBroad, CheckCircle, TextT, Eye } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  THEMES,
  SETTINGS_DEFAULTS,
  getSettings,
  saveSettings,
  applyTheme,
  type SiteSettings,
} from '@/lib/settings'

/* Personalización del sitio: tema de color (curaduría cerrada, todo combina)
   y los textos de la portada. Pensado para que los dueños jueguen sin miedo:
   nada de acá puede romper el diseño. */
export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(SETTINGS_DEFAULTS)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s)
      applyTheme(s.theme)
    })
  }, [])

  const pickTheme = (key: string) => {
    setSettings((prev) => ({ ...prev, theme: key }))
    // Vista previa inmediata: el propio admin se re-pinta con el tema.
    applyTheme(key)
  }

  const handleSave = async () => {
    setSaving(true)
    const ok = await saveSettings(settings)
    setSaving(false)
    if (ok) {
      toast.success('¡Guardado! El sitio ya muestra los cambios.')
    } else {
      toast.error('No se pudo guardar (¿existe la tabla settings?)')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient-warm">Personalizar</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Elegí el color del sitio y los textos de la portada. Nada de acá puede romper el diseño.
        </p>
      </div>

      {/* Tema de color */}
      <Card className="glass border-white/50">
        <CardContent className="pt-5 pb-5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4">
            <PaintBrushBroad size={14} /> Color del sitio
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(THEMES).map(([key, theme]) => {
              const active = settings.theme === key
              return (
                <button
                  key={key}
                  onClick={() => pickTheme(key)}
                  className={cn(
                    'flex flex-col items-center gap-2.5 rounded-2xl p-4 border-2 transition-all',
                    active ? 'border-[var(--brand-accent)] shadow-md' : 'border-black/5 hover:shadow'
                  )}
                  style={{ background: theme.ground }}
                  aria-pressed={active}
                >
                  <span className="flex -space-x-1.5">
                    <span className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ background: theme.accent }} />
                    <span className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ background: theme.soft }} />
                    <span className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ background: theme.strong }} />
                  </span>
                  <span className="text-sm font-semibold flex items-center gap-1.5">
                    {active && <CheckCircle size={15} weight="fill" className="text-[var(--brand-accent)]" />}
                    {theme.label}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Eye size={14} />
            Cada tema cambia el color de acento Y el tono del fondo del sitio. Al tocar uno, este panel se pinta de muestra; se aplica al sitio al Guardar.
          </p>
        </CardContent>
      </Card>

      {/* Textos de la portada */}
      <Card className="glass border-white/50">
        <CardContent className="pt-5 pb-5 space-y-4">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TextT size={14} /> Textos de la portada
          </Label>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">Título</Label>
            <Input
              value={settings.hero_title}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              placeholder={SETTINGS_DEFAULTS.hero_title}
              className="bg-white/70"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">
              Remate del título <span className="text-muted-foreground font-normal">(va en cursiva y con color)</span>
            </Label>
            <Input
              value={settings.hero_accent}
              onChange={(e) => setSettings({ ...settings, hero_accent: e.target.value })}
              placeholder={SETTINGS_DEFAULTS.hero_accent}
              className="bg-white/70"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Texto de presentación</Label>
            <Textarea
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              placeholder={SETTINGS_DEFAULTS.hero_subtitle}
              rows={3}
              className="bg-white/70 resize-y"
            />
          </div>

          {/* Vista previa del título */}
          <div className="rounded-2xl bg-[#1A0F08] p-6 mt-2">
            <p className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#F5EDE2]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {settings.hero_title || SETTINGS_DEFAULTS.hero_title}{' '}
              <span className="italic font-semibold text-gradient-amber">
                {settings.hero_accent || SETTINGS_DEFAULTS.hero_accent}
              </span>
            </p>
            <p className="text-sm text-[#D9C9B4] mt-3 leading-relaxed">
              {settings.hero_subtitle || SETTINGS_DEFAULTS.hero_subtitle}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto bg-[#2C1810] hover:bg-[#3D2419] text-white rounded-full px-8 py-6 text-base gap-2 shadow-md"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Guardando…
          </>
        ) : (
          <>
            <CheckCircle size={18} weight="fill" />
            Guardar cambios
          </>
        )}
      </Button>
    </div>
  )
}
