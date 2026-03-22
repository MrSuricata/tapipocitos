export interface Product {
  id: string
  name: string
  description: string
  material: string
  color: string
  dimensions: string
  status: 'Disponible' | 'A pedido' | 'Agotado'
  images: string[]
  category: 'Sofás' | 'Sillas' | 'Sillones' | 'Mesas' | 'Banquetas' | 'Otros'
  createdAt: number
}

export interface Project {
  id: string
  title: string
  description: string
  category: 'Sofás' | 'Sillas' | 'Restauraciones' | 'Antes y Después' | 'Proyectos Especiales'
  images: string[]
  materials: string[]
  client?: string
  completedDate: string
  createdAt: number
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
