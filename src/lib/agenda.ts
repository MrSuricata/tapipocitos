import { getAdminPassword } from './auth'
import type { AgendaItem, AgendaType } from './types'

export interface AgendaInput {
  title: string
  type: AgendaType
  date: string
  time?: string
  client?: string
  phone?: string
  notes?: string
}

function authHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-admin-password': getAdminPassword(),
  }
}

// Todos los endpoints de agenda son privados del admin (header x-admin-password).
export async function fetchAgenda(): Promise<AgendaItem[] | null> {
  try {
    const res = await fetch('/api/agenda', { headers: authHeaders() })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return null
  }
}

export async function createAgendaItem(payload: AgendaInput): Promise<AgendaItem | null> {
  try {
    const res = await fetch('/api/agenda', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function updateAgendaItem(
  item: Partial<AgendaItem> & { id: string }
): Promise<AgendaItem | null> {
  try {
    const res = await fetch('/api/agenda', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function deleteAgendaItem(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/agenda?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    return res.ok
  } catch {
    return false
  }
}

// Dispara el chequeo de avisos vencidos sin esperar al cron (fire-and-forget).
// Se llama al abrir la agenda: si hay algo vencido sin notificar, sale ya.
export function flushDueNotifications(): void {
  fetch('/api/notify-due', { method: 'POST', headers: authHeaders() }).catch(() => {})
}
