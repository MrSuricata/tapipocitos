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
