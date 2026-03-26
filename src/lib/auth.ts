import { useState } from 'react'
import type { AdminUser } from './types'

const TOKEN_DURATION = 24 * 60 * 60 * 1000

export function useAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('tapipocitos_admin')
      return stored ? JSON.parse(stored) : null
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
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const logout = () => {
    setAdminUser(null)
    localStorage.removeItem('tapipocitos_admin')
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
