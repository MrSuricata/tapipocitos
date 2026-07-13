// Réplica del PDF de AdminInvoice para inspección visual local.
// Correr: node scripts/preview-invoice.mjs [salida.pdf]
import { jsPDF } from 'jspdf'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = process.argv[2] || join(root, 'invoice-preview.pdf')

const logo = 'data:image/png;base64,' + readFileSync(join(root, 'public/icons/icon-192.png')).toString('base64')

const docType = 'presupuesto'
const TITLES = { presupuesto: 'PRESUPUESTO', factura: 'FACTURA', entrega: 'ORDEN DE ENTREGA' }
const docNumber = '1'
const date = '2026-07-13'
const clientName = 'Familia González'
const clientPhone = '099 123 456'
const clientAddress = 'Av. Rivera 4567, Montevideo'
const currency = '$U'
const notes = 'Seña 50% para comenzar. Entrega estimada: 2 semanas. Incluye retiro y entrega a domicilio.'
const validItems = [
  { description: 'Retapizado sofá 3 cuerpos en pana antimanchas color verde oliva, incluye cambio de espuma de asientos por alta densidad', quantity: '1', price: '18500' },
  { description: 'Almohadones nuevos x4', quantity: '4', price: '900' },
  { description: 'Retiro y entrega a domicilio', quantity: '1', price: '0' },
]

const parseNum = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : 0 }
const fmtMoney = (n) => n.toLocaleString('es-UY', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
const fmtDateUy = (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}` }
const total = validItems.reduce((s, it) => s + parseNum(it.quantity) * parseNum(it.price), 0)

const doc = new jsPDF({ unit: 'mm', format: 'a4' })
const pageW = 210
const marginX = 16
const espresso = [44, 24, 16]
const amber = [201, 122, 64]
const cream = [245, 240, 235]
const ink = [55, 45, 38]
const gray = [130, 118, 108]

doc.setFillColor(...espresso)
doc.rect(0, 0, pageW, 34, 'F')
doc.addImage(logo, 'PNG', marginX, 6, 22, 22)
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
doc.text(TITLES[docType], pageW - marginX, 14, { align: 'right' })
doc.setFont('helvetica', 'normal')
doc.setFontSize(9.5)
doc.setTextColor(245, 237, 226)
doc.text(`N° ${docNumber.padStart(4, '0')}`, pageW - marginX, 20.5, { align: 'right' })
doc.text(`Fecha: ${fmtDateUy(date)}`, pageW - marginX, 26, { align: 'right' })

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
doc.text(clientName, marginX, y)
doc.setFont('helvetica', 'normal')
doc.setFontSize(9.5)
doc.setTextColor(...gray)
const clientLine = [clientPhone, clientAddress].filter(Boolean).join('  ·  ')
if (clientLine) { y += 5.5; doc.text(clientLine, marginX, y) }
y += 12

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
  if (y + descLines.length * 5 > 262) { doc.addPage(); y = 20 }
  doc.setTextColor(...ink)
  doc.text(descLines, marginX, y)
  doc.text(String(qty), colQty, y, { align: 'right' })
  doc.text(price ? `${currency} ${fmtMoney(price)}` : '—', colPrice, y, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.text(lineTotal ? `${currency} ${fmtMoney(lineTotal)}` : '—', colTotal, y, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  y += descLines.length * 5 + 3
  doc.setDrawColor(230, 222, 214)
  doc.setLineWidth(0.2)
  doc.line(marginX, y - 2, pageW - marginX, y - 2)
}

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

if (notes) {
  y += 14
  doc.setFontSize(8.5)
  doc.setTextColor(...gray)
  doc.text('NOTAS', marginX, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...ink)
  const noteLines = doc.splitTextToSize(notes, pageW - 2 * marginX)
  doc.text(noteLines, marginX, y)
}

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
doc.text('Pedro Cosío 2430, Montevideo · +598 99 251 310 · tapipocitos@gmail.com · @tapipocitos', pageW / 2, footY + 3, { align: 'center' })

writeFileSync(out, Buffer.from(doc.output('arraybuffer')))
console.log('OK', out)
