import { getAdminPassword } from './auth'
import type { Lead } from './types'

export interface LeadInput {
  name: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  services?: string[]
  products?: string
  source?: string
}

// Public: submit a contact/quote request from the site.
export async function submitLead(payload: LeadInput): Promise<boolean> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'web', ...payload }),
    })
    return res.ok
  } catch {
    return false
  }
}

// Admin-only: list all leads (requires the stored admin password).
export async function fetchLeads(): Promise<Lead[] | null> {
  try {
    const res = await fetch('/api/leads', {
      headers: { 'x-admin-password': getAdminPassword() },
    })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return null
  }
}

// Admin-only: actualizar una consulta (p. ej. marcarla respondida).
export async function updateLead(patch: Partial<Lead> & { id: string }): Promise<Lead | null> {
  try {
    const res = await fetch('/api/leads', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': getAdminPassword(),
      },
      body: JSON.stringify(patch),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Teléfono UY → formato wa.me (09x xxx xxx → 5989xxxxxxx).
export function waNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.startsWith('598')) return digits
  if (digits.startsWith('09')) return '598' + digits.slice(1)
  return digits
}

// Admin-only: delete a lead.
export async function deleteLead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': getAdminPassword() },
    })
    return res.ok
  } catch {
    return false
  }
}
