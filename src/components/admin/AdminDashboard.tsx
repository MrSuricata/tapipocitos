import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Package, Images, Sparkle, ChartBar } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'

interface AdminDashboardProps {
  onNavigate: (view: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { projects, testimonials } = useStore()

  const stats = [
    {
      title: 'Catálogo',
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
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-foreground/70">
          Resumen general del contenido del sitio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate(stat.view)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${stat.bg}`}>
                  <stat.icon size={32} weight="duotone" className={stat.color} />
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
              className="p-4 bg-secondary/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onNavigate('projects')}
            >
              <h4 className="font-semibold text-foreground mb-2">
                🛋️ Catálogo de Trabajos
              </h4>
              <p className="text-sm text-foreground/70">
                Agrega retapizados, restauraciones, piezas a medida y proyectos especiales con fotos y descripción.
              </p>
            </div>
            <div
              className="p-4 bg-secondary/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
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
