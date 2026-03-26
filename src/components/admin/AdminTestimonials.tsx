import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Plus,
  Pencil,
  Trash,
  Star,
  ChatCircleDots,
  User,
  CalendarBlank,
  Quotes,
  CheckCircle,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import type { Testimonial } from '@/lib/types'

export function AdminTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    date: '',
    rating: 5,
  })

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({ name: testimonial.name, text: testimonial.text, date: testimonial.date, rating: testimonial.rating })
    } else {
      setEditingTestimonial(null)
      setFormData({ name: '', text: '', date: '', rating: 5 })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.text || !formData.date) {
      toast.error('Completá nombre, testimonio y fecha')
      return
    }
    setSaving(true)
    const ok = editingTestimonial
      ? await updateTestimonial(editingTestimonial.id, formData)
      : await addTestimonial(formData)
    setSaving(false)
    if (ok) { toast.success(editingTestimonial ? 'Actualizado' : 'Creado'); setIsDialogOpen(false) }
    else toast.error('Error al guardar')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este testimonio?')) return
    const ok = await deleteTestimonial(id)
    if (ok) toast.success('Eliminado')
    else toast.error('Error al eliminar')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Testimonios</h2>
          <p className="text-sm text-muted-foreground mt-1">{testimonials.length} opiniones de clientes</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#2C1810] hover:bg-[#3D2419] text-white rounded-full px-6 gap-2 shadow-md">
          <Plus size={18} weight="bold" /> Nuevo testimonio
        </Button>
      </div>

      <div className="relative">
        <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o texto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 rounded-full border-muted bg-card" />
      </div>

      {filteredTestimonials.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <ChatCircleDots size={48} weight="thin" className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">{searchQuery ? 'Sin resultados' : 'No hay testimonios todavía'}</p>
            {!searchQuery && <Button variant="outline" onClick={() => handleOpenDialog()} className="rounded-full">Agregar el primero</Button>}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTestimonials.map((t) => (
            <Card key={t.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-transparent hover:border-accent/30" onClick={() => handleOpenDialog(t)}>
              <CardContent className="p-5">
                <Quotes size={24} weight="fill" className="text-accent/20 mb-2" />
                <p className="text-sm text-foreground/80 line-clamp-3 mb-4 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} weight={i < t.rating ? 'fill' : 'regular'} className={i < t.rating ? 'text-amber-500' : 'text-muted-foreground/20'} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                  <button onClick={(e) => { e.stopPropagation(); handleOpenDialog(t) }} className="p-1.5 rounded-md hover:bg-muted transition-colors"><Pencil size={14} className="text-muted-foreground" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id) }} className="p-1.5 rounded-md hover:bg-red-50 transition-colors"><Trash size={14} className="text-red-400" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-card/80">
            <div className="w-8 h-8 rounded-lg bg-[#2C1810] flex items-center justify-center">
              <ChatCircleDots size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold">{editingTestimonial ? 'Editar testimonio' : 'Nuevo testimonio'}</h2>
              <p className="text-xs text-muted-foreground">Opinión de un cliente satisfecho</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-center gap-1 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setFormData({ ...formData, rating: i + 1 })} className="p-1 transition-transform hover:scale-125">
                  <Star size={32} weight={i < formData.rating ? 'fill' : 'regular'} className={i < formData.rating ? 'text-amber-500' : 'text-muted-foreground/30'} />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2"><User size={12} /> Nombre</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre del cliente" className="bg-muted/30 border-muted focus-visible:bg-white" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2"><CalendarBlank size={12} /> Fecha</Label>
                <Input value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="Ej: Marzo 2024" className="bg-muted/30 border-muted focus-visible:bg-white" />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2"><Quotes size={12} /> Testimonio</Label>
              <Textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} placeholder="Escribí la opinión del cliente..." rows={4} className="resize-none bg-muted/30 border-muted focus-visible:bg-white" />
            </div>

            {formData.name && formData.text && (
              <div className="p-4 rounded-xl bg-muted/30 border border-muted">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Preview</p>
                <p className="text-sm italic text-foreground/70">"{formData.text}"</p>
                <p className="text-xs font-semibold mt-2">— {formData.name}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t bg-card/80">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-muted-foreground">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !formData.name || !formData.text} className="bg-[#2C1810] hover:bg-[#3D2419] text-white rounded-full px-8 gap-2 shadow-md">
              {saving ? (<><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Guardando...</>) : (<><CheckCircle size={18} weight="fill" /> {editingTestimonial ? 'Guardar' : 'Crear'}</>)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
