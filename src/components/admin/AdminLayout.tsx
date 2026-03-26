import { Button } from '@/components/ui/button'
import {
  House,
  Package,
  Images,
  Sparkle,
  SignOut,
  SquaresFour,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
  onLogout: () => void
  onBackToSite: () => void
}

export function AdminLayout({
  children,
  currentView,
  onViewChange,
  onLogout,
  onBackToSite,
}: AdminLayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: SquaresFour },
    { id: 'projects', label: 'Catálogo', icon: Images },
    { id: 'testimonials', label: 'Testimonios', icon: Sparkle },
  ]

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">
            TAPIPOCITOS Admin
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBackToSite}>
              <House size={18} className="mr-2" />
              Volver al sitio
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <SignOut size={18} className="mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 bg-card border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  currentView === item.id && 'bg-primary text-primary-foreground'
                )}
                onClick={() => onViewChange(item.id)}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="md:hidden mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                >
                  <item.icon size={18} className="mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
