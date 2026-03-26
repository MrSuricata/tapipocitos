import { useState, useEffect } from 'react'
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
import { Testimonials } from '@/components/Testimonials'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminProducts } from '@/components/admin/AdminProducts'
import { AdminProjects } from '@/components/admin/AdminProjects'
import { AdminTestimonials } from '@/components/admin/AdminTestimonials'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

type View = 'home' | 'about' | 'services' | 'gallery' | 'products' | 'contact' | 'admin'
type AdminView = 'dashboard' | 'products' | 'projects' | 'testimonials'

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [adminView, setAdminView] = useState<AdminView>('dashboard')
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
    } else {
      toast.error('Contraseña incorrecta')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    setCurrentView('home')
  }

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash === 'admin') {
      setCurrentView('admin')
    }
  }, [])

  if (currentView === 'admin') {
    if (!isAuthenticated()) {
      return (
        <>
          <AdminLogin onLogin={handleLogin} />
          <Toaster />
        </>
      )
    }

    return (
      <>
        <AdminLayout
          currentView={adminView}
          onViewChange={(view) => setAdminView(view as AdminView)}
          onLogout={handleLogout}
          onBackToSite={() => setCurrentView('home')}
        >
          {adminView === 'dashboard' && <AdminDashboard onNavigate={(view) => setAdminView(view as AdminView)} />}
          {adminView === 'products' && <AdminProducts />}
          {adminView === 'projects' && <AdminProjects />}
          {adminView === 'testimonials' && <AdminTestimonials />}
        </AdminLayout>
        <Toaster />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen">
        <Navbar currentView={currentView} onNavigate={handleNavigation} />

        {currentView === 'home' && (
          <>
            <Hero onNavigate={handleNavigation} />
            <PhotoShowcase />
            <Services onNavigate={handleNavigation} />
            <About />
            <Testimonials />
          </>
        )}

        {currentView === 'about' && <About />}

        {currentView === 'services' && <Services onNavigate={handleNavigation} />}

        {currentView === 'gallery' && (
          <div className="pt-20">
            <Gallery
              onNavigate={handleNavigation}
              initialFilter={galleryFilter}
            />
          </div>
        )}

        {currentView === 'products' && (
          <div className="pt-20">
            <Products onNavigate={handleNavigation} />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-20">
            <Contact prefilledData={contactData} />
          </div>
        )}

        <Footer />
      </div>
      <Toaster />
    </>
  )
}

export default App