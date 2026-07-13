import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Package, Images, Sparkle, ChartBar, CalendarDots, ChatCircleDots } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import { fetchAgenda } from '@/lib/agenda'
import { fetchLeads } from '@/lib/leads'

interface AdminDashboardProps {
  onNavigate: (view: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { products, projects, testimonials } = useStore()
  const [agendaToday, setAgendaToday] = useState<{ pending: number; overdue: number } | null>(null)
  const [leadCount, setLeadCount] = useState<number | null>(null)

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const d = new Date()
    const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    fetchAgenda().then((items) => {
      if (!items) return
      setAgendaToday({
        pending: items.filter((i) => !i.done && i.date === today).length,
        overdue: items.filter((i) => !i.done && i.date < today).length,
      })
    })
    fetchLeads().then((leads) => {
      if (leads) setLeadCount(leads.length)
    })
  }, [])

  const stats: Array<{
    title: string
    value: number | string
    hint?: string
    icon: typeof Package
    color: string
    bg: string
    view: string
  }> = [
    {
      title: 'Hoy en la agenda',
      value: agendaToday === null ? '—' : agendaToday.pending,
      hint: agendaToday && agendaToday.overdue > 0 ? `${agendaToday.overdue} vencidos` : undefined,
      icon: CalendarDots,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      view: 'agenda',
    },
    {
      title: 'Consultas',
      value: leadCount === null ? '—' : leadCount,
      icon: ChatCircleDots,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      view: 'leads',
    },
    {
      title: 'Productos',
      value: products?.length || 0,
      icon: Package,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      view: 'products',
    },
    {
      title: 'Trabajos',
      value: projects?.length || 0,
      icon: Images,
      color: 'text-green-600',
      bg: 'bg-green-50',
      view: 'projects',
    },
    {
      title: 'Testimonios',
      value: testimonials?.length || 0,
      icon: Sparkle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      view: 'testimonials',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
          <span className="text-foreground">Panel de </span>
          <span className="text-gradient-warm">Gestión</span>
        </h2>
        <p className="text-foreground/70">
          Resumen del contenido de tu sitio. Tocá una tarjeta para editar.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer card-lift"
            onClick={() => onNavigate(stat.view)}
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1 truncate">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gradient-warm">
                    {stat.value}
                  </p>
                  {stat.hint && (
                    <p className="text-[11px] font-medium text-red-600 mt-0.5">{stat.hint}</p>
                  )}
                </div>
                <div className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}>
                  <stat.icon size={22} weight="duotone" className={stat.color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar size={24} weight="duotone" />
            Guía rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="p-4 bg-white/60 border border-border/40 rounded-xl cursor-pointer hover:border-accent/30 hover:shadow-md transition-all"
              onClick={() => onNavigate('products')}
            >
              <h4 className="font-semibold text-foreground mb-2">
                🛒 Productos
              </h4>
              <p className="text-sm text-foreground/70">
                Cargá los productos que el cliente puede agregar al carrito y pedir presupuesto: foto, nombre, precio y descripción.
              </p>
            </div>
            <div
              className="p-4 bg-white/60 border border-border/40 rounded-xl cursor-pointer hover:border-accent/30 hover:shadow-md transition-all"
              onClick={() => onNavigate('projects')}
            >
              <h4 className="font-semibold text-foreground mb-2">
                🛋️ Trabajos realizados
              </h4>
              <p className="text-sm text-foreground/70">
                Agregá fotos de retapizados, restauraciones y proyectos terminados para mostrar experiencia.
              </p>
            </div>
            <div
              className="p-4 bg-white/60 border border-border/40 rounded-xl cursor-pointer hover:border-accent/30 hover:shadow-md transition-all"
              onClick={() => onNavigate('testimonials')}
            >
              <h4 className="font-semibold text-foreground mb-2">
                ⭐ Testimonios
              </h4>
              <p className="text-sm text-foreground/70">
                Agrega reseñas de clientes satisfechos para generar confianza.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
