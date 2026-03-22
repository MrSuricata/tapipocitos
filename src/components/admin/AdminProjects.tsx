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
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { generateId } from '@/lib/auth'
import { useStore } from '@/lib/store'
import type { Project } from '@/lib/types'

export function AdminProjects() {
  const { projects, setProjects } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Sofás',
    materials: [],
    client: '',
    completedDate: '',
    images: [],
  })
  const [materialInput, setMaterialInput] = useState('')

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData(project)
    } else {
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        category: 'Sofás',
        materials: [],
        client: '',
        completedDate: '',
        images: [],
      })
    }
    setMaterialInput('')
    setIsDialogOpen(true)
  }

  const handleAddMaterial = () => {
    if (materialInput.trim()) {
      setFormData({
        ...formData,
        materials: [...(formData.materials || []), materialInput.trim()],
      })
      setMaterialInput('')
    }
  }

  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: (formData.materials || []).filter((_, i) => i !== index),
    })
  }

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    if (editingProject) {
      setProjects((current) =>
        (current || []).map((p) =>
          p.id === editingProject.id ? { ...formData, id: p.id } as Project : p
        )
      )
      toast.success('Proyecto actualizado')
    } else {
      const newProject: Project = {
        ...formData as Project,
        id: generateId(),
        createdAt: Date.now(),
      }
      setProjects((current) => [...(current || []), newProject])
      toast.success('Proyecto creado')
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      setProjects((current) => (current || []).filter((p) => p.id !== id))
      toast.success('Proyecto eliminado')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Trabajos Realizados
          </h2>
          <p className="text-foreground/70">
            Gestiona la galería de proyectos completados
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={20} className="mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!projects || projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No hay proyectos todavía
              </p>
              <Button onClick={() => handleOpenDialog()}>
                Agregar tu primer proyecto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell>{project.client || '-'}</TableCell>
                    <TableCell>{project.completedDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(project)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as Project['category'] })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sofás">Sofás</SelectItem>
                  <SelectItem value="Sillas">Sillas</SelectItem>
                  <SelectItem value="Restauraciones">Restauraciones</SelectItem>
                  <SelectItem value="Proyectos Especiales">
                    Proyectos Especiales
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  placeholder="Opcional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completedDate">Fecha de finalización</Label>
                <Input
                  id="completedDate"
                  value={formData.completedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, completedDate: e.target.value })
                  }
                  placeholder="Ej: Marzo 2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Materiales utilizados</Label>
              <div className="flex gap-2">
                <Input
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  placeholder="Ej: Cuero italiano"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
                />
                <Button type="button" onClick={handleAddMaterial}>
                  Agregar
                </Button>
              </div>
              {formData.materials && formData.materials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.materials.map((material, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {material}
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(index)}
                        className="ml-1"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingProject ? 'Actualizar' : 'Crear'} Proyecto
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
