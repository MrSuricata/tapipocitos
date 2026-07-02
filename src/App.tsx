import { useState, useEffect, lazy, Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { About } from '@/components/About'
import { Gallery } from '@/components/Gallery'
import { Products } from '@/components/Products'
import { Contact } from '@/components/Contact'
import { PhotoShowcase } from '@/components/PhotoShowcase'
import { Marquee } from '@/components/Marquee'
import { TrabajosDestacados } from '@/components/TrabajosDestacados'
import { Testimonials } from '@/components/Testimonials'
import { Faq } from '@/components/Faq'
import { ScrollProgress } from '@/components/ScrollProgress'
import { WhatsAppFab } from '@/components/WhatsAppFab'
// Admin is code-split: visitors never download it.
const AdminLogin = lazy(() => import('@/components/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminProducts = lazy(() => import('@/components/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })))
const AdminProjects = lazy(() => import('@/components/admin/AdminProjects').then((m) => ({ default: m.AdminProjects })))
const AdminTestimonials = lazy(() => import('@/components/admin/AdminTestimonials').then((m) => ({ default: m.AdminTestimonials })))
const AdminLeads = lazy(() => import('@/components/admin/AdminLeads').then((m) => ({ default: m.AdminLeads })))
const AdminAgenda = lazy(() => import('@/components/admin/AdminAgenda').then((m) => ({ default: m.AdminAgenda })))
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

type View = 'home' | 'about' | 'services' | 'products' | 'gallery' | 'contact' | 'admin'
type AdminView = 'dashboard' | 'products' | 'projects' | 'testimonials' | 'leads' | 'agenda'

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  // La agenda es la pantalla de entrada del admin: el día organizado de una.
  const [adminView, setAdminView] = useState<AdminView>('agenda')
  const [galleryFilter, setGalleryFilter] = useState<string | undefined>()
  const [contactData, setContactData] = useState<any>()
  const { login, logout, isAuthenticated } = useAuth()

  const handleNavigation = (view: string, data?: any) => {
    if (view === 'gallery' && data) {
      setGalleryFilter(data)
    } else {
      setGalleryFilter(undefined)
    }

    if (view === 'contact' && data) {
      setContactData(data)
    } else {
      setContactData(undefined)
    }

    setCurrentView(view as View)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = async (password: string) => {
    const success = await login(password)
    if (success) {
      toast.success('Sesión iniciada correctamente')
      setCurrentView('admin')
      window.history.replaceState(null, '', '/admin')
    } else {
      toast.error('Contraseña incorrecta')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    setCurrentView('home')
    window.history.replaceState(null, '', '/')
  }

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const path = window.location.pathname.replace(/\/+$/, '')
    if (hash === 'admin' || path === '/admin') {
      setCurrentView('admin')
    }
  }, [])

  if (currentView === 'admin') {
    const adminFallback = (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
    if (!isAuthenticated()) {
      return (
        <>
          <Suspense fallback={adminFallback}>
            <AdminLogin onLogin={handleLogin} />
          </Suspense>
          <Toaster />
        </>
      )
    }

    return (
      <>
        <Suspense fallback={adminFallback}>
        <AdminLayout
          currentView={adminView}
          onViewChange={(view) => setAdminView(view as AdminView)}
          onLogout={handleLogout}
          onBackToSite={() => {
            setCurrentView('home')
            window.history.replaceState(null, '', '/')
          }}
        >
          {adminView === 'dashboard' && <AdminDashboard onNavigate={(view) => setAdminView(view as AdminView)} />}
          {adminView === 'products' && <AdminProducts />}
          {adminView === 'projects' && <AdminProjects />}
          {adminView === 'testimonials' && <AdminTestimonials />}
          {adminView === 'leads' && <AdminLeads />}
          {adminView === 'agenda' && <AdminAgenda />}
        </AdminLayout>
        </Suspense>
        <Toaster />
      </>
    )
  }

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen">
        <Navbar currentView={currentView} onNavigate={handleNavigation} />

        {currentView === 'home' && (
          <>
            <Hero onNavigate={handleNavigation} />
            <PhotoShowcase />
            <Marquee />
            <Services onNavigate={handleNavigation} />
            <About />
            <TrabajosDestacados />
            <Testimonials />
            <Faq />
            <Contact />
          </>
        )}

        {currentView === 'about' && <About />}

        {currentView === 'services' && <Services onNavigate={handleNavigation} />}

        {currentView === 'products' && (
          <div className="pt-20">
            <Products onNavigate={handleNavigation} />
          </div>
        )}

        {currentView === 'gallery' && (
          <div className="pt-20">
            <Gallery
              onNavigate={handleNavigation}
              initialFilter={galleryFilter}
            />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-20">
            <Contact prefilledData={contactData} />
          </div>
        )}

        <Footer onNavigate={handleNavigation} />
      </div>
      <WhatsAppFab />
      <Toaster />
    </>
  )
}

export default App