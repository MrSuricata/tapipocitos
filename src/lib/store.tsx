import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Product, Project, Testimonial } from './types'
import { supabase } from './supabase'

// ── API helpers ──────────────────────────────────────────

const API_BASE = import.meta.env.DEV ? '' : ''

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/api/${endpoint}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function mutateAPI(endpoint: string, method: string, body?: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    return res.ok
  } catch {
    return false
  }
}

// ── Supabase direct read (faster for public data) ────────

async function fetchFromSupabase<T>(table: string): Promise<T[] | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as T[]
  } catch {
    return null
  }
}

// ── Fallback demo data ──────────────────────────────────

const FALLBACK_PRODUCTS: Product[] = [
  { id: 'demo-1', name: 'Sofá Montevideo 3 cuerpos', description: 'Sofá de 3 cuerpos con estructura de pino reforzado, espuma de alta densidad y tapizado en tela chenille.', material: 'Chenille importado', color: 'Marrón claro', dimensions: '220 x 90 x 85 cm', price: 'Consultar', images: ['/fotos/sofas/sofa-esquinero-gris-taller.jpg'], category: 'Sofás', featured: false, created_at: '' },
  { id: 'demo-2', name: 'Sillón individual Carrasco', description: 'Sillón individual con respaldo alto y apoyabrazos curvos. Espuma soft de 30kg.', material: 'Pana premium', color: 'Verde oscuro', dimensions: '85 x 80 x 100 cm', price: 'Consultar', images: ['/fotos/sofas/sofa-dos-cuerpos-verde-base-madera.jpg'], category: 'Sillones', featured: false, created_at: '' },
]

const FALLBACK_PROJECTS: Project[] = [
  { id: 'demo-1', title: 'Sofá Chesterfield 3 cuerpos', description: 'Retapizado completo de sofá Chesterfield clásico en cuero vacuno marrón oscuro.', category: 'Sofás', images: ['/fotos/restauraciones/restauracion-chesterfield-cuero-1.jpg'], materials: ['Cuero vacuno', 'Espuma alta densidad'], client: 'Familia Pereira', completed_date: 'Enero 2024', featured: false, created_at: '' },
]

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 'demo-1', name: 'María Rodríguez', text: 'Llevamos el sofá de mi abuela que tenía más de 40 años. Lo devolvieron como nuevo.', date: 'Enero 2024', rating: 5 },
]

// ── Store context ──────────────────────────────────────

interface StoreContextType {
  products: Product[]
  projects: Project[]
  testimonials: Testimonial[]
  loading: boolean
  // CRUD operations (hit API, then refresh local state)
  addProduct: (p: Omit<Product, 'id' | 'created_at'>) => Promise<boolean>
  updateProduct: (id: string, p: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
  addProject: (p: Omit<Project, 'id' | 'created_at'>) => Promise<boolean>
  updateProject: (id: string, p: Partial<Project>) => Promise<boolean>
  deleteProject: (id: string) => Promise<boolean>
  addTestimonial: (t: Omit<Testimonial, 'id'>) => Promise<boolean>
  updateTestimonial: (id: string, t: Partial<Testimonial>) => Promise<boolean>
  deleteTestimonial: (id: string) => Promise<boolean>
  uploadImage: (file: File) => Promise<string | null>
  refreshAll: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS)
  const [loading, setLoading] = useState(true)

  // Fetch all data from Supabase on mount
  const refreshAll = useCallback(async () => {
    setLoading(true)
    const [prods, projs, tests] = await Promise.all([
      fetchFromSupabase<Product>('products'),
      fetchFromSupabase<Project>('projects'),
      fetchFromSupabase<Testimonial>('testimonials'),
    ])
    if (prods && prods.length > 0) setProducts(prods)
    if (projs && projs.length > 0) setProjects(projs)
    if (tests && tests.length > 0) setTestimonials(tests)
    setLoading(false)
  }, [])

  useEffect(() => { refreshAll() }, [refreshAll])

  // ── Product CRUD ──
  const addProduct = async (p: Omit<Product, 'id' | 'created_at'>) => {
    const ok = await mutateAPI('products', 'POST', p)
    if (ok) await refreshAll()
    return ok
  }
  const updateProduct = async (id: string, p: Partial<Product>) => {
    const ok = await mutateAPI('products', 'PUT', { id, ...p })
    if (ok) await refreshAll()
    return ok
  }
  const deleteProduct = async (id: string) => {
    const ok = await mutateAPI(`products?id=${id}`, 'DELETE')
    if (ok) await refreshAll()
    return ok
  }

  // ── Project CRUD ──
  const addProject = async (p: Omit<Project, 'id' | 'created_at'>) => {
    const ok = await mutateAPI('projects', 'POST', p)
    if (ok) await refreshAll()
    return ok
  }
  const updateProject = async (id: string, p: Partial<Project>) => {
    const ok = await mutateAPI('projects', 'PUT', { id, ...p })
    if (ok) await refreshAll()
    return ok
  }
  const deleteProject = async (id: string) => {
    const ok = await mutateAPI(`projects?id=${id}`, 'DELETE')
    if (ok) await refreshAll()
    return ok
  }

  // ── Testimonial CRUD ──
  const addTestimonial = async (t: Omit<Testimonial, 'id'>) => {
    const ok = await mutateAPI('testimonials', 'POST', t)
    if (ok) await refreshAll()
    return ok
  }
  const updateTestimonial = async (id: string, t: Partial<Testimonial>) => {
    const ok = await mutateAPI('testimonials', 'PUT', { id, ...t })
    if (ok) await refreshAll()
    return ok
  }
  const deleteTestimonial = async (id: string) => {
    const ok = await mutateAPI(`testimonials?id=${id}`, 'DELETE')
    if (ok) await refreshAll()
    return ok
  }

  // ── Image upload ──
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, filename: file.name }),
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.url
    } catch {
      return null
    }
  }

  return (
    <StoreContext.Provider value={{
      products, projects, testimonials, loading,
      addProduct, updateProduct, deleteProduct,
      addProject, updateProject, deleteProject,
      addTestimonial, updateTestimonial, deleteTestimonial,
      uploadImage, refreshAll,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
