import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Trash,
  FilePdf,
  Receipt,
  Truck,
  Calculator,
  User,
  NotePencil,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

/* ================================================
   Facturación / Orden de entrega / Presupuesto
   Se completa acá y se exporta como PDF con el
   membrete de Tapipocitos. No persiste en la DB:
   es una herramienta de emisión de documentos.
   ================================================ */

type DocType = 'presupuesto' | 'factura' | 'entrega'

const DOC_TYPES: Record<DocType, { label: string; icon: typeof Receipt; title: string }> = {
  presupuesto: { label: 'Presupuesto', icon: Calculator, title: 'PRESUPUESTO' },
  factura: { label: 'Factura', icon: Receipt, title: 'FACTURA' },
  entrega: { label: 'Orden de entrega', icon: Truck, title: 'ORDEN DE ENTREGA' },
}

interface LineItem {
  description: string
  quantity: string
  price: string
}

const EMPTY_ITEM: LineItem = { description: '', quantity: '1', price: '' }

function parseNum(v: string): number {
  const n = parseFloat(v.replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function fmtMoney(n: number): string {
  return n.toLocaleString('es-UY', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function todayInput(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function fmtDateUy(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// Numeración por tipo, persistida en el dispositivo.
function nextDocNumber(type: DocType): number {
  try {
    const raw = localStorage.getItem('tapipocitos_doc_counters')
    const counters = raw ? JSON.parse(raw) : {}
    return (counters[type] || 0) + 1
  } catch {
    return 1
  }
}

function commitDocNumber(type: DocType, num: number) {
  try {
    const raw = localStorage.getItem('tapipocitos_doc_counters')
    const counters = raw ? JSON.parse(raw) : {}
    counters[type] = Math.max(num, counters[type] || 0)
    localStorage.setItem('tapipocitos_doc_counters', JSON.stringify(counters))
  } catch {
    // sin storage no pasa nada: el número lo escribe el usuario igual
  }
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/icons/icon-192.png')
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export function AdminInvoice() {
  const [docType, setDocType] = useState<DocType>('presupuesto')
  const [docNumber, setDocNumber] = useState(() => String(nextDocNumber('presupuesto')))
  const [date, setDate] = useState(todayInput)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [currency, setCurrency] = useState<'$U' | 'USD'>('$U')
  const [items, setItems] = useState<LineItem[]>([{ ...EMPTY_ITEM }])
  const [notes, setNotes] = useState('')
  const [exporting, setExporting] = useState(false)

  const total = items.reduce((sum, it) => sum + parseNum(it.quantity) * parseNum(it.price), 0)

  const handleTypeChange = (type: DocType) => {
    setDocType(type)
    setDocNumber(String(nextDocNumber(type)))
  }

  const updateItem = (index: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  const removeItem = (index: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }

  const validateDoc = (): LineItem[] | null => {
    const validItems = items.filter((it) => it.description.trim())
    if (!clientName.trim()) {
      toast.error('Poné el nombre del cliente')
      return null
    }
    if (validItems.length === 0) {
      toast.error('Agregá al menos un ítem con descripción')
      return null
    }
    return validItems
  }

  // Construye el PDF completo; el llamador decide si descargarlo o compartirlo.
  const buildPdf = async (validItems: LineItem[]) => {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const pageW = 210
      const marginX = 16
      const espresso: [number, number, number] = [44, 24, 16]
      const amber: [number, number, number] = [201, 122, 64]
      const cream: [number, number, number] = [245, 240, 235]
      const ink: [number, number, number] = [55, 45, 38]
      const gray: [number, number, number] = [130, 118, 108]

      /* -- Membrete -- */
      doc.setFillColor(...espresso)
      doc.rect(0, 0, pageW, 34, 'F')
      const logo = await loadLogoDataUrl()
      if (logo) doc.addImage(logo, 'PNG', marginX, 6, 22, 22)
      doc.setTextColor(245, 237, 226)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(19)
      doc.text('TAPIPOCITOS', marginX + 27, 16)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(196, 168, 130)
      doc.text('Tapicería familiar · Montevideo · Desde 1975', marginX + 27, 22.5)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(232, 179, 128)
      doc.text(DOC_TYPES[docType].title, pageW - marginX, 14, { align: 'right' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(245, 237, 226)
      doc.text(`N° ${docNumber.padStart(4, '0')}`, pageW - marginX, 20.5, { align: 'right' })
      doc.text(`Fecha: ${fmtDateUy(date)}`, pageW - marginX, 26, { align: 'right' })

      /* -- Cliente -- */
      let y = 46
      doc.setFontSize(8.5)
      doc.setTextColor(...gray)
      doc.text('CLIENTE', marginX, y)
      doc.setDrawColor(...amber)
      doc.setLineWidth(0.4)
      doc.line(marginX, y + 1.5, pageW - marginX, y + 1.5)
      y += 8
      doc.setFontSize(11.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...ink)
      doc.text(clientName.trim(), marginX, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(...gray)
      const clientLine = [clientPhone.trim(), clientAddress.trim()].filter(Boolean).join('  ·  ')
      if (clientLine) {
        y += 5.5
        doc.text(clientLine, marginX, y)
      }
      y += 12

      /* -- Tabla de ítems -- */
      const colQty = 132
      const colPrice = 156
      const colTotal = pageW - marginX
      doc.setFillColor(...cream)
      doc.rect(marginX - 2, y - 5, pageW - 2 * marginX + 4, 8, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(90, 59, 46)
      doc.text('DESCRIPCIÓN', marginX, y)
      doc.text('CANT.', colQty, y, { align: 'right' })
      doc.text('PRECIO', colPrice, y, { align: 'right' })
      doc.text('IMPORTE', colTotal, y, { align: 'right' })
      y += 8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      for (const it of validItems) {
        const qty = parseNum(it.quantity)
        const price = parseNum(it.price)
        const lineTotal = qty * price
        const descLines = doc.splitTextToSize(it.description.trim(), 105)

        if (y + descLines.length * 5 > 262) {
          doc.addPage()
          y = 20
        }

        doc.setTextColor(...ink)
        doc.text(descLines, marginX, y)
        doc.text(String(qty), colQty, y, { align: 'right' })
        doc.text(price ? `${currency} ${fmtMoney(price)}` : '—', colPrice, y, { align: 'right' })
        doc.setFont('helvetica', 'bold')
        doc.text(lineTotal ? `${currency} ${fmtMoney(lineTotal)}` : '—', colTotal, y, { align: 'right' })
        doc.setFont('helvetica', 'normal')

        y += descLines.length * 5 + 5
        doc.setDrawColor(230, 222, 214)
        doc.setLineWidth(0.2)
        doc.line(marginX, y - 3.5, pageW - marginX, y - 3.5)
      }

      /* -- Total -- */
      y += 4
      doc.setDrawColor(...amber)
      doc.setLineWidth(0.6)
      doc.line(118, y, pageW - marginX, y)
      y += 8
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(...espresso)
      doc.text('TOTAL', 118, y)
      doc.text(`${currency} ${fmtMoney(total)}`, colTotal, y, { align: 'right' })

      /* -- Notas -- */
      if (notes.trim()) {
        y += 14
        doc.setFontSize(8.5)
        doc.setTextColor(...gray)
        doc.text('NOTAS', marginX, y)
        y += 5
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.5)
        doc.setTextColor(...ink)
        const noteLines = doc.splitTextToSize(notes.trim(), pageW - 2 * marginX)
        doc.text(noteLines, marginX, y)
        y += noteLines.length * 4.5
      }

      /* -- Pie -- */
      const footY = 280
      doc.setDrawColor(...amber)
      doc.setLineWidth(0.4)
      doc.line(marginX, footY - 8, pageW - marginX, footY - 8)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.setTextColor(...amber)
      doc.text('Armazones garantidos de por vida.', pageW / 2, footY - 2, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...gray)
      doc.text(
        'Pedro Cosío 2430, Montevideo · +598 99 251 310 · tapipocitos@gmail.com · @tapipocitos',
        pageW / 2,
        footY + 3,
        { align: 'center' }
      )

      const slugClient = clientName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cliente'
      return { doc, filename: `${docType}-${docNumber.padStart(4, '0')}-${slugClient}.pdf` }
  }

  const handleExport = async () => {
    const validItems = validateDoc()
    if (!validItems) return
    setExporting(true)
    try {
      const { doc, filename } = await buildPdf(validItems)
      doc.save(filename)
      commitDocNumber(docType, parseInt(docNumber, 10) || 1)
      toast.success('PDF exportado')
    } catch (e: any) {
      toast.error(`No se pudo generar el PDF: ${e?.message || 'error'}`)
    } finally {
      setExporting(false)
    }
  }

  // Compartir directo (WhatsApp, etc.) con la Web Share API; en navegadores
  // sin soporte de archivos (desktop) cae a la descarga normal.
  const handleShare = async () => {
    const validItems = validateDoc()
    if (!validItems) return
    setExporting(true)
    try {
      const { doc, filename } = await buildPdf(validItems)
      const blob = doc.output('blob')
      const file = new File([blob], filename, { type: 'application/pdf' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${DOC_TYPES[docType].label} Tapipocitos`,
          text: `${DOC_TYPES[docType].label} N° ${docNumber.padStart(4, '0')} — ${clientName.trim()}`,
        })
        commitDocNumber(docType, parseInt(docNumber, 10) || 1)
        toast.success('Listo para enviar')
      } else {
        doc.save(filename)
        commitDocNumber(docType, parseInt(docNumber, 10) || 1)
        toast.info('Este navegador no comparte archivos: se descargó el PDF. Desde el celular sale directo a WhatsApp.')
      }
    } catch (e: any) {
      // Si el usuario cierra el panel de compartir, no es un error.
      if (e?.name !== 'AbortError') {
        toast.error(`No se pudo compartir: ${e?.message || 'error'}`)
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient-warm">Facturar</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Armá el documento y exportalo en PDF con el membrete de Tapipocitos
        </p>
      </div>

      {/* Tipo de documento */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(DOC_TYPES) as DocType[]).map((type) => {
          const cfg = DOC_TYPES[type]
          const Icon = cfg.icon
          const active = docType === type
          return (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-all',
                active
                  ? 'bg-[#2C1810] text-white border-[#2C1810] shadow-md'
                  : 'bg-white/60 text-muted-foreground border-muted hover:border-accent/40'
              )}
            >
              <Icon size={16} weight={active ? 'fill' : 'regular'} />
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Datos del documento + cliente */}
      <Card className="glass border-white/50">
        <CardContent className="pt-5 pb-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-[110px_160px_1fr] gap-3">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">N°</Label>
              <Input
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                className="bg-white/70"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Fecha</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white/70" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Moneda</Label>
              <div className="flex gap-2">
                {(['$U', 'USD'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-semibold border transition-all',
                      currency === c
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white/60 text-muted-foreground border-muted'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
              <User size={13} /> Cliente
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Nombre del cliente *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-white/70 sm:col-span-2"
              />
              <Input
                placeholder="Teléfono (opcional)"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="bg-white/70"
              />
              <Input
                placeholder="Dirección (para orden de entrega)"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="bg-white/70"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ítems */}
      <Card className="glass border-white/50">
        <CardContent className="pt-5 pb-5 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Ítems</Label>
            <span className="text-xs text-muted-foreground hidden sm:block">Cantidad × Precio = Importe</span>
          </div>

          {items.map((item, index) => {
            const lineTotal = parseNum(item.quantity) * parseNum(item.price)
            return (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_70px_110px_100px_auto] gap-2 items-start p-3 sm:p-0 rounded-xl sm:rounded-none bg-white/40 sm:bg-transparent"
              >
                <Input
                  placeholder={`Ítem ${index + 1}: ej. Retapizado sofá 3 cuerpos en pana`}
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                  className="bg-white/70 col-span-2 sm:col-span-1"
                />
                <Input
                  placeholder="Cant."
                  value={item.quantity}
                  onChange={(e) => updateItem(index, { quantity: e.target.value })}
                  inputMode="decimal"
                  className="bg-white/70 w-20 sm:w-auto"
                  aria-label="Cantidad"
                />
                <Input
                  placeholder={`Precio ${currency}`}
                  value={item.price}
                  onChange={(e) => updateItem(index, { price: e.target.value })}
                  inputMode="decimal"
                  className="bg-white/70"
                  aria-label="Precio unitario"
                />
                <div className="flex items-center h-9 px-2 text-sm font-semibold text-accent whitespace-nowrap">
                  {lineTotal > 0 ? `${currency} ${fmtMoney(lineTotal)}` : ''}
                </div>
                <button
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground/50 hover:text-destructive hover:bg-red-50 transition-colors disabled:opacity-30"
                  aria-label="Quitar ítem"
                >
                  <Trash size={16} />
                </button>
              </div>
            )
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setItems((prev) => [...prev, { ...EMPTY_ITEM }])}
            className="rounded-full gap-1.5"
          >
            <Plus size={14} weight="bold" /> Agregar ítem
          </Button>

          {/* Total */}
          <div className="flex items-center justify-end gap-4 pt-3 border-t border-[#C97A40]/20">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-gradient-warm">
              {currency} {fmtMoney(total)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notas + exportar */}
      <Card className="glass border-white/50">
        <CardContent className="pt-5 pb-5 space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
              <NotePencil size={13} /> Notas (opcional)
            </Label>
            <Textarea
              placeholder="Ej: Seña 50% para comenzar. Entrega estimada: 2 semanas. Incluye retiro y entrega a domicilio."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="bg-white/70 resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleShare}
              disabled={exporting}
              className="w-full sm:w-auto bg-[#1FAF5A] hover:bg-[#189A4E] text-white rounded-full px-8 py-6 text-base gap-2 shadow-md"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Generando…
                </>
              ) : (
                <>
                  <WhatsappLogo size={20} weight="fill" />
                  Enviar por WhatsApp
                </>
              )}
            </Button>
            <Button
              onClick={handleExport}
              disabled={exporting}
              variant="outline"
              className="w-full sm:w-auto rounded-full px-8 py-6 text-base gap-2 border-[#2C1810]/30 text-[#2C1810] hover:bg-[#2C1810]/5"
            >
              <FilePdf size={20} weight="fill" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
