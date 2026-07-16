import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Trash,
  Phone,
  Envelope,
  WhatsappLogo,
  ChatCircleDots,
  ArrowClockwise,
  CheckCircle,
  ArrowCounterClockwise,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { fetchLeads, deleteLead, updateLead, waNumber } from '@/lib/leads'
import { deleteWithUndo } from '@/lib/undo'
import { cn } from '@/lib/utils'
import type { Lead } from '@/lib/types'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-UY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

// Saludo prellenado para responder por WhatsApp con un toque.
function replyMessage(lead: Lead): string {
  const firstName = lead.name.trim().split(/\s+/)[0]
  const motivo = lead.subject ? ` por "${lead.subject}"` : ''
  return `Hola ${firstName}! Somos de TAPIPOCITOS, gracias por tu consulta${motivo}. `
}

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await fetchLeads()
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = (lead: Lead) => {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
    deleteWithUndo({
      label: `Consulta de ${lead.name} eliminada`,
      onRestore: () => setLeads((prev) => [...prev, lead]),
      onConfirm: async () => {
        const ok = await deleteLead(lead.id)
        if (!ok) {
          toast.error('No se pudo eliminar; la consulta sigue guardada')
          setLeads((prev) => [...prev, lead])
        }
      },
    })
  }

  const handleToggleStatus = async (lead: Lead) => {
    const next = lead.status === 'respondida' ? 'nuevo' : 'respondida'
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: next } : l)))
    const updated = await updateLead({ id: lead.id, status: next })
    if (!updated) {
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: lead.status } : l)))
      toast.error('No se pudo actualizar')
    } else if (next === 'respondida') {
      toast.success('Consulta marcada como respondida')
    }
  }

  // Sin responder arriba (lo urgente primero), después por fecha.
  const sorted = [...leads].sort((a, b) => {
    const aNew = a.status !== 'respondida' ? 0 : 1
    const bNew = b.status !== 'respondida' ? 0 : 1
    if (aNew !== bNew) return aNew - bNew
    return (b.created_at || '').localeCompare(a.created_at || '')
  })
  const pendingCount = leads.filter((l) => l.status !== 'respondida').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-warm">Consultas</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount > 0 ? (
              <span className="text-accent font-semibold">
                {pendingCount} sin responder
              </span>
            ) : (
              'Todas respondidas 🎉'
            )}
            {leads.length > 0 && <span> · {leads.length} en total</span>}
          </p>
        </div>
        <Button variant="outline" onClick={load} className="rounded-full bg-white/60 backdrop-blur-md">
          <ArrowClockwise size={16} className="mr-2" />
          Actualizar
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando consultas…</p>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <ChatCircleDots size={48} weight="thin" className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Todavía no llegaron consultas.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Cuando alguien complete el formulario del sitio, aparece acá.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((lead) => {
            const answered = lead.status === 'respondida'
            return (
              <Card
                key={lead.id}
                className={cn(answered && 'opacity-70', !answered && 'border-accent/30 shadow-soft')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-foreground">{lead.name}</h3>
                        <span
                          className={cn(
                            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                            answered
                              ? 'bg-green-100 text-green-700'
                              : 'bg-accent/15 text-accent'
                          )}
                        >
                          {answered ? 'Respondida' : 'Nueva'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </span>
                      </div>
                      {lead.subject && (
                        <p className="text-sm text-accent font-medium mt-0.5">{lead.subject}</p>
                      )}
                      {lead.services?.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Servicios: {lead.services.join(', ')}
                        </p>
                      )}
                      {lead.products && (
                        <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line bg-secondary/40 rounded-lg p-2">
                          {lead.products}
                        </p>
                      )}
                      {lead.message && (
                        <p className="text-sm text-foreground/80 mt-2 whitespace-pre-line">
                          {lead.message}
                        </p>
                      )}

                      {/* Contactos secundarios */}
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-sm text-foreground/70 hover:text-accent inline-flex items-center gap-1.5"
                          >
                            <Phone size={15} weight="duotone" />
                            {lead.phone}
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-sm text-foreground/70 hover:text-accent inline-flex items-center gap-1.5"
                          >
                            <Envelope size={15} weight="duotone" />
                            {lead.email}
                          </a>
                        )}
                      </div>

                      {/* Acciones principales: grandes y claras */}
                      <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${waNumber(lead.phone)}?text=${encodeURIComponent(replyMessage(lead))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              // Abrir el chat cuenta como respondida (se puede revertir).
                              if (!answered) handleToggleStatus(lead)
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white bg-[#1FAF5A] hover:bg-[#189A4E] shadow-md transition-colors"
                          >
                            <WhatsappLogo size={19} weight="fill" />
                            Responder por WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => handleToggleStatus(lead)}
                          className={cn(
                            'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border transition-colors',
                            answered
                              ? 'text-muted-foreground border-muted hover:bg-muted/50'
                              : 'text-green-700 border-green-300 hover:bg-green-50'
                          )}
                        >
                          {answered ? (
                            <>
                              <ArrowCounterClockwise size={17} />
                              Volver a pendiente
                            </>
                          ) : (
                            <>
                              <CheckCircle size={17} weight="fill" />
                              Marcar respondida
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(lead)}
                      className="p-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                      aria-label="Eliminar consulta"
                    >
                      <Trash size={17} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
