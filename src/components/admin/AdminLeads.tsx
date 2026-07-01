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
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { fetchLeads, deleteLead } from '@/lib/leads'
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta consulta?')) return
    const ok = await deleteLead(id)
    if (ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id))
      toast.success('Consulta eliminada')
    } else {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-warm">Consultas</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {leads.length} {leads.length === 1 ? 'consulta recibida' : 'consultas recibidas'}
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
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{lead.name}</h3>
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
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {lead.phone && (
                        <>
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-sm text-foreground/70 hover:text-accent inline-flex items-center gap-1.5"
                          >
                            <Phone size={15} weight="duotone" />
                            {lead.phone}
                          </a>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm inline-flex items-center gap-1.5 font-medium"
                            style={{ color: '#25D366' }}
                          >
                            <WhatsappLogo size={15} weight="fill" />
                            WhatsApp
                          </a>
                        </>
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
                  </div>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                    aria-label="Eliminar consulta"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
