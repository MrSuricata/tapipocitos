import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Phone,
  Truck,
  Package,
  Calculator,
  NotePencil,
  CaretLeft,
  CaretRight,
  Plus,
  Trash,
  WhatsappLogo,
  Warning,
  ArrowClockwise,
  CalendarBlank,
  CheckCircle,
  Circle,
  Bell,
  BellRinging,
  ArrowCounterClockwise,
  CaretDown,
  ClockCounterClockwise,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  fetchAgenda,
  createAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
  flushDueNotifications,
} from '@/lib/agenda'
import { pushSupport, getPushSubscription, enablePush, disablePush } from '@/lib/push'
import { deleteWithUndo } from '@/lib/undo'
import type { AgendaItem, AgendaType } from '@/lib/types'

/* ---------- Tipos de recordatorio ---------- */

const TYPE_CONFIG: Record<
  AgendaType,
  { label: string; icon: typeof Phone; color: string; bg: string }
> = {
  llamar: { label: 'Llamar', icon: Phone, color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  retirar: { label: 'Retirar', icon: Truck, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  entregar: { label: 'Entregar', icon: Package, color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  cotizar: { label: 'Cotizar', icon: Calculator, color: '#C97A40', bg: 'rgba(201,122,64,0.12)' },
  otro: { label: 'Otro', icon: NotePencil, color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
}

const TYPE_KEYS = Object.keys(TYPE_CONFIG) as AgendaType[]

/* ---------- Fechas (sin librerías: claves YYYY-MM-DD locales) ---------- */

const pad = (n: number) => String(n).padStart(2, '0')
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const todayKey = () => toKey(new Date())

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function formatKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return `${d} de ${MONTHS[m - 1].toLowerCase()} ${y}`
}

/** Celdas del mes (semana empieza lunes); null = hueco de otro mes. */
function monthCells(cursor: Date): (string | null)[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7
  const cells: (string | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toKey(new Date(cursor.getFullYear(), cursor.getMonth(), d)))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/* ---------- Fila de recordatorio ---------- */

function AgendaRow({
  item,
  onToggle,
  onDelete,
}: {
  item: AgendaItem
  onToggle: (item: AgendaItem) => void
  onDelete: (id: string) => void
}) {
  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.otro
  const Icon = cfg.icon
  const phone = (item.phone || '').replace(/[^\d+]/g, '')

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl px-3 py-2.5 border transition-opacity',
        item.done ? 'opacity-50 bg-white/30 border-transparent' : 'bg-white/60 border-white/60 shadow-soft'
      )}
    >
      <button
        onClick={() => onToggle(item)}
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
        aria-label={item.done ? 'Marcar como pendiente' : 'Marcar como hecho'}
      >
        {item.done ? (
          <CheckCircle size={22} weight="fill" className="text-green-600" />
        ) : (
          <Circle size={22} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            <Icon size={12} weight="bold" />
            {cfg.label}
          </span>
          {item.time && <span className="text-xs font-medium text-foreground/60">{item.time} h</span>}
        </div>
        <p className={cn('text-sm font-medium mt-1', item.done && 'line-through')}>{item.title}</p>
        {item.client && <p className="text-xs text-muted-foreground mt-0.5">{item.client}</p>}
        {item.notes && <p className="text-xs text-muted-foreground/80 mt-0.5 whitespace-pre-line">{item.notes}</p>}
        {phone && (
          <div className="flex items-center gap-3 mt-1.5">
            <a href={`tel:${phone}`} className="text-xs inline-flex items-center gap-1 text-foreground/70 hover:text-accent">
              <Phone size={13} /> {item.phone}
            </a>
            <a
              href={`https://wa.me/${phone.replace(/^0/, '598')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs inline-flex items-center gap-1 text-green-700 hover:text-green-600"
            >
              <WhatsappLogo size={14} weight="fill" /> WhatsApp
            </a>
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors mt-0.5"
        aria-label="Eliminar recordatorio"
      >
        <Trash size={17} />
      </button>
    </div>
  )
}

/* ================================================
   Agenda del taller: calendario + alta rápida
   ================================================ */

export function AdminAgenda() {
  const [items, setItems] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [cursor, setCursor] = useState(() => new Date())
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [pushState, setPushState] = useState<'unsupported' | 'ios-needs-install' | 'off' | 'on' | 'working'>('off')
  const [showCompleted, setShowCompleted] = useState(false)

  // Alta rápida
  const [title, setTitle] = useState('')
  const [type, setType] = useState<AgendaType>('llamar')
  const [date, setDate] = useState(todayKey)
  const [time, setTime] = useState('')
  const [client, setClient] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await fetchAgenda()
    if (data === null) {
      setLoadError(true)
      setItems([])
    } else {
      setLoadError(false)
      setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    flushDueNotifications()
    // Estado inicial del botón de notificaciones.
    const support = pushSupport()
    if (support !== 'off') {
      setPushState(support)
    } else {
      getPushSubscription().then((sub) => setPushState(sub ? 'on' : 'off'))
    }
  }, [])

  const handlePushToggle = async () => {
    if (pushState === 'ios-needs-install') {
      toast.info('En iPhone: primero instalá la app (Compartir → Agregar a pantalla de inicio) y activá las notificaciones desde la app instalada.')
      return
    }
    if (pushState === 'unsupported') {
      toast.error('Este navegador no soporta notificaciones push.')
      return
    }
    if (pushState === 'on') {
      setPushState('working')
      await disablePush()
      setPushState('off')
      toast.success('Notificaciones desactivadas en este dispositivo')
      return
    }
    setPushState('working')
    const result = await enablePush()
    if (result.ok) {
      setPushState('on')
      toast.success('¡Notificaciones activadas! Los recordatorios van a llegar a este dispositivo.')
    } else {
      setPushState('off')
      toast.error(`No se pudo activar: ${result.reason}`)
    }
  }

  const sortKey = (i: AgendaItem) => `${i.date} ${i.time || '99:99'}`
  const byDay = useMemo(() => {
    const map = new Map<string, AgendaItem[]>()
    for (const item of items) {
      const list = map.get(item.date) || []
      list.push(item)
      map.set(item.date, list)
    }
    for (const list of map.values()) list.sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
    return map
  }, [items])

  const today = todayKey()
  const overdue = useMemo(
    () => items.filter((i) => !i.done && i.date < today).sort((a, b) => sortKey(a).localeCompare(sortKey(b))),
    [items, today]
  )
  const upcoming = useMemo(
    () => items.filter((i) => !i.done && i.date >= today).sort((a, b) => sortKey(a).localeCompare(sortKey(b))).slice(0, 8),
    [items, today]
  )
  const pendingCount = items.filter((i) => !i.done).length
  const dayItems = byDay.get(selectedKey) || []
  // Registro de completados, lo más reciente primero (por completed_at si existe).
  const completed = useMemo(
    () =>
      items
        .filter((i) => i.done)
        .sort((a, b) => (b.completed_at || b.date).localeCompare(a.completed_at || a.date))
        .slice(0, 30),
    [items]
  )

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error('Escribí qué hay que hacer')
      return
    }
    setSaving(true)
    const created = await createAgendaItem({
      title: title.trim(),
      type,
      date,
      time,
      client: client.trim(),
      phone: phoneInput.trim(),
    })
    setSaving(false)
    if (created) {
      setItems((prev) => [...prev, created])
      setSelectedKey(date)
      setTitle('')
      setTime('')
      setClient('')
      setPhoneInput('')
      toast.success('Recordatorio agregado')
    } else {
      toast.error('No se pudo guardar (¿existe la tabla agenda?)')
    }
  }

  const handleToggle = async (item: AgendaItem) => {
    const nowIso = new Date().toISOString()
    const completedAt = item.done ? null : nowIso
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, done: !i.done, completed_at: completedAt } : i))
    )
    // Con registro de cuándo se completó; si la columna aún no existe en la DB,
    // reintenta sin ella para no romper el toggle.
    let updated = await updateAgendaItem({ id: item.id, done: !item.done, completed_at: completedAt })
    if (!updated) {
      updated = await updateAgendaItem({ id: item.id, done: !item.done })
    }
    if (!updated) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, done: item.done, completed_at: item.completed_at } : i))
      )
      toast.error('No se pudo actualizar')
    }
  }

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    deleteWithUndo({
      label: `"${item.title}" eliminado`,
      onRestore: () => setItems((prev) => [...prev, item]),
      onConfirm: async () => {
        const ok = await deleteAgendaItem(id)
        if (!ok) {
          toast.error('No se pudo eliminar; el recordatorio sigue guardado')
          setItems((prev) => [...prev, item])
        }
      },
    })
  }

  const cells = monthCells(cursor)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-warm">Agenda</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'}
            {overdue.length > 0 && (
              <span className="text-red-600 font-medium"> · {overdue.length} vencido{overdue.length > 1 ? 's' : ''}</span>
            )}
            {completed.length > 0 && (
              <span className="text-green-700"> · {completed.length} completado{completed.length > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={pushState === 'on' ? 'default' : 'outline'}
            onClick={handlePushToggle}
            disabled={pushState === 'working'}
            className={cn(
              'rounded-full',
              pushState !== 'on' && 'bg-white/60 backdrop-blur-md'
            )}
            title={
              pushState === 'on'
                ? 'Este dispositivo recibe avisos de la agenda'
                : 'Activar avisos de la agenda en este dispositivo'
            }
          >
            {pushState === 'on' ? (
              <BellRinging size={16} weight="fill" className="mr-2" />
            ) : (
              <Bell size={16} className="mr-2" />
            )}
            {pushState === 'on' ? 'Avisos activados' : pushState === 'working' ? 'Un momento…' : 'Activar avisos'}
          </Button>
          <Button variant="outline" onClick={load} className="rounded-full bg-white/60 backdrop-blur-md">
            <ArrowClockwise size={16} className="mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {loadError && (
        <Card className="border-red-200 bg-red-50/70">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <Warning size={22} className="text-red-600 shrink-0 mt-0.5" weight="fill" />
            <div className="text-sm text-red-800">
              <p className="font-semibold">No se pudo cargar la agenda.</p>
              <p className="mt-1">
                Si es la primera vez que usás esta sección, falta crear la tabla: corré{' '}
                <code className="bg-red-100 px-1 rounded">supabase/setup.sql</code> (es idempotente) en el
                SQL Editor del dashboard de Supabase y tocá Actualizar.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vencidos: lo urgente primero */}
      {overdue.length > 0 && (
        <Card className="border-red-200/70 bg-red-50/50">
          <CardContent className="pt-4 pb-4 space-y-2">
            <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
              <Warning size={16} weight="fill" /> Vencidos
            </p>
            {overdue.map((item) => (
              <div key={item.id}>
                <p className="text-[11px] text-red-600/80 font-medium mb-1">{formatKey(item.date)}</p>
                <AgendaRow item={item} onToggle={handleToggle} onDelete={handleDelete} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* El día, primero: lo que hay que hacer HOY (o el día elegido en el calendario) */}
      <Card className="glass border-white/50">
        <CardContent className="pt-5 pb-5">
          <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
            <CalendarBlank size={16} />
            {selectedKey === today ? 'Hoy' : formatKey(selectedKey)}
            {dayItems.length > 0 && (
              <span className="ml-1 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                {dayItems.filter((i) => !i.done).length} pendiente{dayItems.filter((i) => !i.done).length !== 1 ? 's' : ''}
              </span>
            )}
          </h3>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : dayItems.length === 0 ? (
            <p className="text-sm text-muted-foreground/70">
              Nada agendado para este día. Agregá algo abajo. 👇
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dayItems.map((item) => (
                <AgendaRow key={item.id} item={item} onToggle={handleToggle} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alta rápida */}
      <Card className="glass border-white/50">
        <CardContent className="pt-5 pb-5 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {TYPE_KEYS.map((key) => {
              const cfg = TYPE_CONFIG[key]
              const Icon = cfg.icon
              const active = type === key
              return (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
                    active ? 'text-white shadow-md' : 'bg-white/50 border-white/60 hover:border-current'
                  )}
                  style={active ? { background: cfg.color, borderColor: cfg.color } : { color: cfg.color }}
                >
                  <Icon size={14} weight="bold" />
                  {cfg.label}
                </button>
              )
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
            <Input
              placeholder={
                type === 'llamar' ? 'Llamar a… (ej: Sra. García por el sillón)' :
                type === 'retirar' ? 'Retirar… (ej: sofá en Pocitos)' :
                type === 'entregar' ? 'Entregar… (ej: sillón retapizado a Juan)' :
                type === 'cotizar' ? 'Cotizar… (ej: 6 sillas de comedor)' :
                'Qué hay que hacer…'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="bg-white/70"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/70 sm:w-40"
            />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-white/70 sm:w-28"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              placeholder="Cliente (opcional)"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="bg-white/70"
            />
            <Input
              placeholder="Teléfono (opcional)"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="bg-white/70"
            />
            <Button onClick={handleAdd} disabled={saving} className="rounded-full px-6">
              <Plus size={16} className="mr-1.5" weight="bold" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendario + próximos */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        <Card className="glass border-white/50">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                {MONTHS[cursor.getMonth()]} <span className="text-muted-foreground font-medium">{cursor.getFullYear()}</span>
              </h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost" size="icon" className="rounded-full h-8 w-8"
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                  aria-label="Mes anterior"
                >
                  <CaretLeft size={16} />
                </Button>
                <Button
                  variant="outline" size="sm" className="rounded-full h-8 text-xs bg-white/60"
                  onClick={() => { setCursor(new Date()); setSelectedKey(todayKey()) }}
                >
                  Hoy
                </Button>
                <Button
                  variant="ghost" size="icon" className="rounded-full h-8 w-8"
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                  aria-label="Mes siguiente"
                >
                  <CaretRight size={16} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((d, i) => (
                <span key={i} className="text-[11px] font-semibold text-muted-foreground py-1">{d}</span>
              ))}
              {cells.map((key, i) => {
                if (!key) return <span key={`empty-${i}`} />
                const dayNum = Number(key.slice(-2))
                const list = byDay.get(key) || []
                const pending = list.filter((it) => !it.done)
                const isToday = key === today
                const isSelected = key === selectedKey
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedKey(key)}
                    className={cn(
                      'relative aspect-square rounded-xl text-sm flex flex-col items-center justify-center gap-0.5 transition-all',
                      isSelected
                        ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25'
                        : isToday
                          ? 'bg-accent/15 font-bold text-accent'
                          : 'hover:bg-accent/10'
                    )}
                  >
                    {dayNum}
                    {list.length > 0 && (
                      <span className="flex gap-0.5">
                        {list.slice(0, 4).map((it) => (
                          <span
                            key={it.id}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: isSelected ? 'rgba(255,255,255,0.9)' : TYPE_CONFIG[it.type]?.color ?? '#6B7280',
                              opacity: it.done ? 0.35 : 1,
                            }}
                          />
                        ))}
                      </span>
                    )}
                    {pending.length > 0 && !isSelected && (
                      <span className="absolute top-1 right-1 text-[9px] font-bold text-accent">{pending.length}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          {/* Próximos */}
          <Card className="glass border-white/50">
            <CardContent className="pt-5 pb-5">
              <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3">Próximos</h3>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground/70">No hay pendientes próximos. 🎉</p>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setSelectedKey(item.date); setCursor(new Date(item.date + 'T00:00:00')) }}
                      className="w-full text-left flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-accent/10 transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: TYPE_CONFIG[item.type]?.color ?? '#6B7280' }}
                      />
                      <span className="text-sm font-medium truncate flex-1">{item.title}</span>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {item.date === today ? `Hoy${item.time ? ` ${item.time}` : ''}` : formatKey(item.date).replace(/ \d{4}$/, '')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registro de completados (colapsable) */}
      {completed.length > 0 && (
        <Card className="glass border-white/50">
          <CardContent className="pt-4 pb-4">
            <button
              onClick={() => setShowCompleted((v) => !v)}
              className="w-full flex items-center justify-between gap-2 text-left"
              aria-expanded={showCompleted}
            >
              <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <ClockCounterClockwise size={16} />
                Completados
                <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full normal-case tracking-normal">
                  {completed.length}
                </span>
              </h3>
              <CaretDown
                size={16}
                className={cn('text-muted-foreground transition-transform', showCompleted && 'rotate-180')}
              />
            </button>

            {showCompleted && (
              <div className="mt-4 space-y-1.5">
                {completed.map((item) => {
                  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.otro
                  const doneLabel = item.completed_at
                    ? `hecho el ${formatKey(item.completed_at.slice(0, 10))}`
                    : `agendado para el ${formatKey(item.date)}`
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 bg-white/40"
                    >
                      <CheckCircle size={18} weight="fill" className="text-green-600 shrink-0" />
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: cfg.color }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm line-through text-foreground/60 truncate">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {doneLabel}
                          {item.client ? ` · ${item.client}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle(item)}
                        className="shrink-0 p-1.5 rounded-full text-muted-foreground/60 hover:text-accent hover:bg-accent/10 transition-colors"
                        aria-label="Volver a pendiente"
                        title="Volver a pendiente"
                      >
                        <ArrowCounterClockwise size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="shrink-0 p-1.5 rounded-full text-muted-foreground/40 hover:text-destructive hover:bg-red-50 transition-colors"
                        aria-label="Eliminar del registro"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
