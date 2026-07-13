export interface Product {
  id: string
  name: string
  description: string
  material: string
  color: string
  dimensions: string
  price: string
  images: string[]
  category: 'Sofás' | 'Sillas' | 'Sillones' | 'Mesas' | 'Banquetas' | 'Otros'
  featured: boolean
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  category: 'Sofás' | 'Sillas' | 'Restauraciones' | 'Antes y Después' | 'Proyectos Especiales'
  images: string[]
  materials: string[]
  client?: string
  completed_date: string
  featured: boolean
  created_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  relatedProjects: string[]
}

export interface Testimonial {
  id: string
  name: string
  text: string
  date: string
  rating: number
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  services: string[]
  products: string
  source: string
  status: string
  created_at: string
}

export type AgendaType = 'llamar' | 'retirar' | 'entregar' | 'cotizar' | 'otro'

export interface AgendaItem {
  id: string
  title: string
  type: AgendaType
  date: string // YYYY-MM-DD
  time: string // 'HH:MM' u ''
  client: string
  phone: string
  notes: string
  done: boolean
  /** Cuándo se marcó como hecho (puede faltar si la columna aún no existe). */
  completed_at?: string | null
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject?: string
  message: string
  productId?: string
  projectId?: string
  attachments?: File[]
}

export interface AdminUser {
  username: string
  token: string
  expiresAt: number
}
