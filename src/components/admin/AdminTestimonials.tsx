import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { generateId } from '@/lib/auth'
import { useStore } from '@/lib/store'
import type { Testimonial } from '@/lib/types'

export function AdminTestimonials() {
  const { testimonials, setTestimonials } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    text: '',
    date: '',
    rating: 5,
  })

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData(testimonial)
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

  const handleSave = () => {
    if (!formData.name || !formData.text || !formData.date) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    if (editingTestimonial) {
      setTestimonials((current) =>
        (current || []).map((t) =>
          t.id === editingTestimonial.id ? { ...formData, id: t.id } as Testimonial : t
        )
      )
      toast.success('Testimonio actualizado')
    } else {
      const newTestimonial: Testimonial = {
        ...formData as Testimonial,
        id: generateId(),
      }
      setTestimonials((current) => [...(current || []), newTestimonial])
      toast.success('Testimonio creado')
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este testimonio?')) {
      setTestimonials((current) => (current || []).filter((t) => t.id !== id))
      toast.success('Testimonio eliminado')
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
              <Label htmlFor="rating">Calificación</Label>
              <Select
                value={formData.rating?.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, rating: parseInt(value) })
                }
              >
                <SelectTrigger id="rating">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5 estrellas)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4 estrellas)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3 estrellas)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2 estrellas)</SelectItem>
                  <SelectItem value="1">⭐ (1 estrella)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingTestimonial ? 'Actualizar' : 'Crear'} Testimonio
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
