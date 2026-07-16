import { Button } from '@/components/ui/button'
import {
  House,
  Package,
  Images,
  Sparkle,
  SignOut,
  SquaresFour,
  ChatCircleDots,
  CalendarDots,
  Receipt,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { BackgroundDecor } from '@/components/BackgroundDecor'

interface AdminLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
  onLogout: () => void
  onBackToSite: () => void
}

function SofaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 22V18C4 14 6 12 10 12H30C34 12 36 14 36 18V22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M2 22C2 20 3 19 5 19H35C37 19 38 20 38 22V24C38 25 37 26 36 26H4C3 26 2 25 2 24V22Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 26V29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 26V29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function AdminLayout({
  children,
  currentView,
  onViewChange,
  onLogout,
  onBackToSite,
}: AdminLayoutProps) {
  const menuItems = [
    { id: 'agenda', label: 'Agenda', icon: CalendarDots },
    { id: 'invoice', label: 'Facturar', icon: Receipt },
    { id: 'dashboard', label: 'Inicio', icon: SquaresFour },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'projects', label: 'Trabajos', icon: Images },
    { id: 'testimonials', label: 'Testimonios', icon: Sparkle },
    { id: 'leads', label: 'Consultas', icon: ChatCircleDots },
  ]

  return (
    <div className="admin-ui min-h-screen relative bg-[#F5F0EB]">
      <BackgroundDecor variant="sand" />

      <div className="relative z-10">
        {/* Header */}
        <header className="glass sticky top-0 z-40 border-b border-white/40">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-3">
              <SofaMark className="w-9 h-7 text-primary" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold leading-none tracking-tight">
                  <span className="text-primary">TAPIPOCITOS</span>{' '}
                  <span className="text-gradient-warm">Admin</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                  Panel de gestión
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToSite}
                className="rounded-full bg-white/60 backdrop-blur-md border-[#C97A40]/30"
              >
                <House size={18} className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Volver al sitio</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="rounded-full">
                <SignOut size={18} className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto flex">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 p-4 shrink-0">
            <nav className="glass rounded-2xl p-3 space-y-1 shadow-soft sticky top-24">
              {menuItems.map((item) => {
                const active = currentView === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                        : 'text-foreground/70 hover:bg-accent/10 hover:text-accent'
                    )}
                  >
                    <item.icon size={20} weight={active ? 'fill' : 'regular'} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 p-4 md:p-6 min-w-0">
            {/* Mobile nav */}
            <div className="md:hidden mb-5">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {menuItems.map((item) => {
                  const active = currentView === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                        active
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                          : 'glass text-foreground/70'
                      )}
                    >
                      <item.icon size={18} weight={active ? 'fill' : 'regular'} />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
