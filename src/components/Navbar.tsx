import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { List, X, ShoppingBag } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useCart, buildQuoteMessage } from '@/lib/cart'
import { CartSheet } from '@/components/CartSheet'

interface NavbarProps {
  currentView: string
  onNavigate: (view: string, data?: any) => void
}

function SofaLogo({ className }: { className?: string }) {
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
      <path
        d="M12 16C12 14 13 12 15 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M28 16C28 14 27 12 25 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

function CartButton({ onClick, onDark }: { onClick: () => void; onDark?: boolean }) {
  const { count } = useCart()
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 rounded-full transition-colors',
        onDark
          ? 'text-[#F5EDE2] hover:bg-white/10 hover:text-[#E8B380]'
          : 'hover:bg-accent/10 text-primary hover:text-accent'
      )}
      aria-label={`Abrir presupuesto (${count} ${count === 1 ? 'producto' : 'productos'})`}
    >
      <ShoppingBag size={22} weight="duotone" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shadow">
          {count}
        </span>
      )}
    </button>
  )
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { items } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'about', label: 'Nosotros' },
    { id: 'services', label: 'Servicios' },
    { id: 'products', label: 'Productos' },
    { id: 'gallery', label: 'Trabajos' },
    { id: 'contact', label: 'Contacto' },
  ]

  const handleNavClick = (id: string) => {
    onNavigate(id)
    setMobileOpen(false)
  }

  const handleRequestForm = () => {
    setCartOpen(false)
    onNavigate('contact', {
      subject: 'Pedido de presupuesto',
      message: buildQuoteMessage(items),
    })
  }

  // Sobre el hero oscuro de la home el navbar vive en claro; al scrollear pasa a glass.
  const onDark = currentView === 'home' && !scrolled

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-soft border-b border-white/50'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <SofaLogo
              className={cn(
                'w-10 h-8 transition-colors duration-300',
                onDark ? 'text-[#F5EDE2] group-hover:text-[#E8B380]' : 'text-primary group-hover:text-accent'
              )}
            />
            <div className="text-left">
              <h1
                className={cn(
                  'text-xl font-bold tracking-tight leading-none transition-colors duration-300',
                  onDark ? 'text-[#F5EDE2]' : 'text-primary'
                )}
              >
                TAPIPOCITOS
              </h1>
              <p
                className={cn(
                  'text-[10px] uppercase tracking-[0.2em] mt-0.5 transition-colors duration-300',
                  onDark ? 'text-[#C4A882]' : 'text-muted-foreground'
                )}
              >
                Tapiceria Familiar
              </p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'default' : 'ghost'}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'button-text uppercase text-xs tracking-wider px-4',
                  currentView === item.id
                    ? onDark
                      ? 'bg-[#C97A40] hover:bg-[#B56A33] text-[#FFF8F0]'
                      : ''
                    : onDark
                      ? 'text-[#F5EDE2] hover:bg-white/10 hover:text-[#E8B380]'
                      : 'hover:bg-accent/10 hover:text-accent'
                )}
              >
                {item.label}
              </Button>
            ))}
            <div className={cn('w-px h-6 mx-1', onDark ? 'bg-[#C4A882]/30' : 'bg-border')} />
            <CartButton onClick={() => setCartOpen(true)} onDark={onDark} />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <CartButton onClick={() => setCartOpen(true)} onDark={onDark} />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(onDark && 'text-[#F5EDE2] hover:bg-white/10 hover:text-[#E8B380]')}
                >
                  {mobileOpen ? <X size={24} /> : <List size={24} />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-2 mt-8">
                  <div className="flex items-center gap-3 mb-6 px-4">
                    <SofaLogo className="w-8 h-6 text-primary" />
                    <div>
                      <p className="text-lg font-bold text-primary">TAPIPOCITOS</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Tapiceria Familiar
                      </p>
                    </div>
                  </div>
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? 'default' : 'ghost'}
                      onClick={() => handleNavClick(item.id)}
                      className="button-text uppercase text-sm tracking-wider justify-start"
                    >
                      {item.label}
                    </Button>
                  ))}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground px-4 leading-relaxed">
                      Mas de 50 anos de tradicion tapicera en Uruguay
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} onRequestForm={handleRequestForm} />
    </nav>
  )
}
