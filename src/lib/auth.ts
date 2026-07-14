import { useState } from 'react'
import type { AdminUser } from './types'

// Sesión persistente: queda logueado en el dispositivo hasta que toque "Salir".
// (La contraseña ya vive en localStorage para los headers del API, así que un
// vencimiento corto no agregaba seguridad real — solo molestaba.)
const TOKEN_DURATION = 10 * 365 * 24 * 60 * 60 * 1000

export function useAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('tapipocitos_admin')
      if (!stored) return null
      const user: AdminUser = JSON.parse(stored)
      // Renovación deslizante al cargar: cada visita extiende la sesión
      // (las sesiones viejas de 24 h pasan a persistentes sin re-loguear).
      if (user && Date.now() < user.expiresAt) {
        user.expiresAt = Date.now() + TOKEN_DURATION
        localStorage.setItem('tapipocitos_admin', JSON.stringify(user))
      }
      return user
    } catch {
      return null
    }
  })

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        const token = generateToken()
        const user: AdminUser = {
          username: 'admin',
          token,
          expiresAt: Date.now() + TOKEN_DURATION,
        }
        setAdminUser(user)
        localStorage.setItem('tapipocitos_admin', JSON.stringify(user))
        localStorage.setItem('tapipocitos_pw', password)
        return true
      }
      return false
    } catch {
      // Sin API no hay login: la validación es siempre server-side.
      return false
    }
  }

  const logout = () => {
    setAdminUser(null)
    localStorage.removeItem('tapipocitos_admin')
    localStorage.removeItem('tapipocitos_pw')
  }

  const isAuthenticated = (): boolean => {
    if (!adminUser) return false
    if (Date.now() > adminUser.expiresAt) {
      logout()
      return false
    }
    return true
  }

  return {
    adminUser,
    login,
    logout,
    isAuthenticated,
  }
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function sendEmail(data: {
  to: string
  subject: string
  body: string
}): Promise<boolean> {
  console.log('Email sent:', data)
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000)
  })
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('es-UY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// The admin password is kept in localStorage after login so the panel can read
// the private /api/leads endpoint (which requires it as a header).
export function getAdminPassword(): string {
  try {
    return localStorage.getItem('tapipocitos_pw') || ''
  } catch {
    return ''
  }
}
