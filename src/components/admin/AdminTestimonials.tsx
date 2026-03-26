import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash, Star } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import type { Testimonial } from '@/lib/types'

export function AdminTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    date: '',
    rating: 5,
  })

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        name: testimonial.name,
        text: testimonial.text,
        date: testimonial.date,
        rating: testimonial.rating,
      })
    } else {
      setEditingTestimonial(null)
      setFormData({
        name: '',
        text: '',
        date: '',
        rating: 5,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.text || !formData.date) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    setSaving(true)

    if (editingTestimonial) {
      const ok = await updateTestimonial(editingTestimonial.id, formData)
      if (ok) {
        toast.success('Testimonio actualizado')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al actualizar el testimonio')
      }
    } else {
      const ok = await addTestimonial(formData)
      if (ok) {
        toast.success('Testimonio creado')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al crear el testimonio')
      }
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este testimonio?')) return
    const ok = await deleteTestimonial(id)
    if (ok) {
      toast.success('Testimonio eliminado')
    } else {
      toast.error('Error al eliminar el testimonio')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Testimonios</h2>
          <p className="text-foreground/70">
            Gestiona las reseñas de clientes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={20} className="mr-2" />
          Nuevo Testimonio
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!testimonials || testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No hay testimonios todavía
              </p>
              <Button onClick={() => handleOpenDialog()}>
                Agregar tu primer testimonio
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Testimonio</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {testimonial.text}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} size={14} weight="fill" className="text-accent" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{testimonial.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(testimonial)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del cliente <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  Fecha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder="Ej: Marzo 2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">
                Testimonio <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="text"
                rows={4}
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder="Escribe el testimonio del cliente..."
              />
            </div>

            <div className="space-y-2">
              <Label>Calificación</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={28}
                      weight={star <= formData.rating ? 'fill' : 'regular'}
                      className={star <= formData.rating ? 'text-accent' : 'text-muted-foreground/40'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1" disabled={saving}>
                {saving ? 'Guardando...' : editingTestimonial ? 'Actualizar Testimonio' : 'Crear Testimonio'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
