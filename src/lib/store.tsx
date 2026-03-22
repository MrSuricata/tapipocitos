import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Product, Project, Testimonial } from './types'

// ── Demo data ──────────────────────────────────────────────

const DEMO_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Sofa Montevideo 3 cuerpos', description: 'Sofa de 3 cuerpos con estructura de pino reforzado, espuma de alta densidad y tapizado en tela chenille. Patas de madera natural. Disponible en varios colores.', material: 'Chenille importado', color: '#8B7355', dimensions: '220 x 90 x 85 cm', status: 'Disponible', images: ['/fotos/sofas/sofa-esquinero-gris-taller.jpg'], category: 'Sofás', createdAt: Date.now() },
  { id: 'prod-2', name: 'Sillon individual Carrasco', description: 'Sillon individual con respaldo alto y apoyabrazos curvos. Estructura de eucalipto, espuma soft de 30kg y tapizado en pana premium. Ideal para lectura.', material: 'Pana premium', color: '#4A6741', dimensions: '85 x 80 x 100 cm', status: 'Disponible', images: ['/fotos/sofas/sofa-dos-cuerpos-verde-base-madera.jpg'], category: 'Sillones', createdAt: Date.now() },
  { id: 'prod-3', name: 'Silla comedor Clasica', description: 'Silla de comedor con asiento y respaldo tapizado en cuero sintetico. Estructura de madera maciza con terminacion laqueada.', material: 'Cuero sintetico', color: '#2C1810', dimensions: '45 x 50 x 92 cm', status: 'Disponible', images: ['/fotos/sofas/sofa-clasico-beige-brazos-curvos.jpg'], category: 'Sillas', createdAt: Date.now() },
  { id: 'prod-4', name: 'Sofa esquinero Pocitos', description: 'Sofa esquinero modular de 5 modulos independientes con fundas removibles y lavables. Espuma HR de alta resiliencia.', material: 'Tela antimanchas', color: '#C4A882', dimensions: '320 x 210 x 78 cm', status: 'A pedido', images: ['/fotos/sofas/sofa-esquinero-beige-ottoman-hogar.jpg'], category: 'Sofás', createdAt: Date.now() },
  { id: 'prod-5', name: 'Banqueta alta Nordica', description: 'Banqueta alta para barra o isla de cocina. Asiento tapizado giratorio con base de acero cromado. Altura regulable.', material: 'Microfibra', color: '#555555', dimensions: '42 x 42 x 75 cm', status: 'Disponible', images: ['/fotos/sofas/sofa-esquinero-aqua-taller.jpg'], category: 'Banquetas', createdAt: Date.now() },
  { id: 'prod-6', name: 'Mesa ratona tapizada', description: 'Mesa ratona con tapa tapizada en cuero ecologico y base de madera paraiso. Funciona como mesa de centro y como asiento auxiliar.', material: 'Cuero ecologico', color: '#6B4423', dimensions: '100 x 60 x 42 cm', status: 'A pedido', images: ['/fotos/sofas/sofa-gris-con-ottoman-exterior.jpg'], category: 'Mesas', createdAt: Date.now() },
  { id: 'prod-7', name: 'Sillon Bergere Frances', description: 'Sillon bergere de estilo clasico frances con capitone en respaldo y brazos. Patas torneadas en madera de roble.', material: 'Terciopelo italiano', color: '#5B2A3C', dimensions: '78 x 82 x 105 cm', status: 'A pedido', images: ['/fotos/sofas/sofa-beige-vivo-contrastante-naranja.jpg'], category: 'Sillones', createdAt: Date.now() },
  { id: 'prod-8', name: 'Silla escritorio tapizada', description: 'Silla de escritorio con asiento y respaldo tapizado en tela mesh transpirable. Base giratoria con ruedas de goma.', material: 'Tela mesh premium', color: '#333333', dimensions: '60 x 60 x 95 cm', status: 'Disponible', images: ['/fotos/sofas/sofa-esquinero-gris-compacto.jpg'], category: 'Sillas', createdAt: Date.now() },
]

const DEMO_PROJECTS: Project[] = [
  { id: 'proj-1', title: 'Sofa Chesterfield 3 cuerpos', description: 'Retapizado completo de sofa Chesterfield clasico en cuero vacuno marron oscuro. Se restauro la estructura de madera, se reemplazaron los resortes y se trabajo el capitone original a mano.', category: 'Sofás', images: ['/fotos/restauraciones/restauracion-chesterfield-cuero-1.jpg'], materials: ['Cuero vacuno', 'Espuma alta densidad', 'Resortes zig-zag', 'Madera de eucalipto'], client: 'Familia Pereira', completedDate: 'Enero 2024', createdAt: Date.now() },
  { id: 'proj-2', title: 'Sillas de comedor estilo nordico', description: 'Set de 6 sillas de comedor retapizadas en tela lino gris claro con patas de madera natural. Espuma de alta densidad para maxima comodidad.', category: 'Sillas', images: ['/fotos/sofas/sofa-dos-cuerpos-mostaza.jpg'], materials: ['Tela lino', 'Espuma densidad 28', 'Clavos tapiceros'], client: 'Restaurant La Pasiva', completedDate: 'Marzo 2024', createdAt: Date.now() },
  { id: 'proj-3', title: 'Restauracion sillon bergere antiguo', description: 'Restauracion integral de sillon bergere de 1940. Se reconstruyo la estructura, se repuso el relleno de crin natural y se tapizo en terciopelo verde esmeralda.', category: 'Restauraciones', images: ['/fotos/sofas/sofa-clasico-beige-brazos-curvos.jpg'], materials: ['Terciopelo italiano', 'Crin natural', 'Muelles biconicos', 'Tachas de bronce'], client: 'Sr. Martinez', completedDate: 'Noviembre 2023', createdAt: Date.now() },
  { id: 'proj-4', title: 'Tapizado hotel boutique Carrasco', description: 'Proyecto completo de tapizado para hotel boutique: 12 cabeceras de cama, 24 sillas de comedor, 6 sillones de recepcion y cortinados para 15 habitaciones.', category: 'Proyectos Especiales', images: ['/fotos/sofas/sofa-esquinero-oscuro-almohadones-etnicos.jpg'], materials: ['Tela antimanchas', 'Cuero sintetico premium', 'Espuma ignifuga', 'Guata de poliester'], client: 'Hotel Boutique Carrasco', completedDate: 'Septiembre 2023', createdAt: Date.now() },
  { id: 'proj-5', title: 'Sofa esquinero a medida', description: 'Sofa esquinero de 3.20m x 2.10m fabricado a medida en tela chenille beige. Modulos independientes con fundas removibles y lavables.', category: 'Sofás', images: ['/fotos/sofas/sofa-esquinero-gris-grande-base-madera.jpg'], materials: ['Chenille importado', 'Espuma soft', 'Estructura pino reforzado', 'Patas acero inox'], client: 'Familia Gonzalez', completedDate: 'Febrero 2024', createdAt: Date.now() },
  { id: 'proj-6', title: 'Butaca antigua: antes y despues', description: 'Transformacion completa de butaca victoriana. De un estado deplorable con tela rasgada y estructura debilitada, a una pieza restaurada con tapizado en pana bordo.', category: 'Antes y Después', images: ['/fotos/restauraciones/restauracion-chesterfield-cuero-2.jpg'], materials: ['Pana importada', 'Tachas doradas', 'Yute', 'Espuma de 30kg'], client: 'Sra. Bentancor', completedDate: 'Diciembre 2023', createdAt: Date.now() },
  { id: 'proj-7', title: 'Banquetas bar retapizadas', description: 'Set de 8 banquetas altas para barra de bar retapizadas en cuero sintetico negro con costura decorativa en hilo dorado.', category: 'Sillas', images: ['/fotos/sofas/sofa-esquinero-azul-marino-base-madera.jpg'], materials: ['Cuero sintetico', 'Hilo encerado dorado', 'Espuma de 25kg'], client: 'Bar El Barzon', completedDate: 'Abril 2024', createdAt: Date.now() },
  { id: 'proj-8', title: 'Sillon reclinable: antes y despues', description: 'Sillon reclinable La-Z-Boy con mecanismo danado y tapizado gastado. Se reparo el mecanismo, se cambio toda la espuma y se retapizo en microfibra gris oscuro.', category: 'Antes y Después', images: ['/fotos/sofas/sofa-gris-oscuro-almohadones-azules.jpg'], materials: ['Microfibra premium', 'Espuma HR', 'Mecanismo reclinable nuevo'], client: 'Dr. Silveira', completedDate: 'Mayo 2024', createdAt: Date.now() },
  { id: 'proj-9', title: 'Restauracion juego de living completo', description: 'Restauracion de juego de living anos 60: sofa de 3 cuerpos y 2 sillones individuales. Se respeto el diseno mid-century con tela mostaza.', category: 'Restauraciones', images: ['/fotos/sofas/sofa-u-beige-hogar-moderno.jpg'], materials: ['Tela tapicera mostaza', 'Espuma blanda', 'Cinchas elasticas', 'Patas conicas laqueadas'], client: 'Arq. Lopez', completedDate: 'Julio 2023', createdAt: Date.now() },
]

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', name: 'Maria Rodriguez', text: 'Llevamos el sofa de mi abuela que tenia mas de 40 anos. Lo devolvieron como nuevo, respetando el diseno original pero con telas modernas. Un trabajo impecable.', date: 'Enero 2024', rating: 5 },
  { id: 'test-2', name: 'Carlos Mendez', text: 'Nos hicieron todo el tapizado del restaurante. 20 sillas y 8 banquetas en tiempo record y con una calidad espectacular. Muy profesionales.', date: 'Marzo 2024', rating: 5 },
  { id: 'test-3', name: 'Laura Fernandez', text: 'Pedi un sillon a medida para mi living y quedo exactamente como lo imaginaba. La atencion personalizada de Leonardo hace toda la diferencia.', date: 'Noviembre 2023', rating: 5 },
]

// ── localStorage helpers ───────────────────────────────────

const STORE_VERSION = 2 // bump to reset localStorage with new demo data

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const storedVersion = localStorage.getItem('tapipocitos_version')
    if (storedVersion !== String(STORE_VERSION)) {
      localStorage.removeItem(`tapipocitos_${key}`)
      localStorage.setItem('tapipocitos_version', String(STORE_VERSION))
      return fallback
    }
    const stored = localStorage.getItem(`tapipocitos_${key}`)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`tapipocitos_${key}`, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable
  }
}

// ── Store context ──────────────────────────────────────────

interface StoreContextType {
  products: Product[]
  setProducts: (updater: Product[] | ((prev: Product[]) => Product[])) => void
  projects: Project[]
  setProjects: (updater: Project[] | ((prev: Project[]) => Project[])) => void
  testimonials: Testimonial[]
  setTestimonials: (updater: Testimonial[] | ((prev: Testimonial[]) => Testimonial[])) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, _setProducts] = useState<Product[]>(() => loadFromStorage('products', DEMO_PRODUCTS))
  const [projects, _setProjects] = useState<Project[]>(() => loadFromStorage('projects', DEMO_PROJECTS))
  const [testimonials, _setTestimonials] = useState<Testimonial[]>(() => loadFromStorage('testimonials', DEMO_TESTIMONIALS))

  // Persist to localStorage on change
  useEffect(() => { saveToStorage('products', products) }, [products])
  useEffect(() => { saveToStorage('projects', projects) }, [projects])
  useEffect(() => { saveToStorage('testimonials', testimonials) }, [testimonials])

  const setProducts = (updater: Product[] | ((prev: Product[]) => Product[])) => {
    _setProducts(typeof updater === 'function' ? updater : () => updater)
  }
  const setProjects = (updater: Project[] | ((prev: Project[]) => Project[])) => {
    _setProjects(typeof updater === 'function' ? updater : () => updater)
  }
  const setTestimonials = (updater: Testimonial[] | ((prev: Testimonial[]) => Testimonial[])) => {
    _setTestimonials(typeof updater === 'function' ? updater : () => updater)
  }

  return (
    <StoreContext.Provider value={{ products, setProducts, projects, setProjects, testimonials, setTestimonials }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
