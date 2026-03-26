import { useState, useRef } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { Plus, Pencil, Trash, X, Image } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import type { Project } from '@/lib/types'

export function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject, uploadImage } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sofás' as Project['category'],
    materials: [] as string[],
    client: '',
    completed_date: '',
    featured: false,
    images: [] as string[],
  })
  const [materialInput, setMaterialInput] = useState('')

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        materials: project.materials || [],
        client: project.client || '',
        completed_date: project.completed_date,
        featured: project.featured,
        images: project.images || [],
      })
      setImagePreview(project.images?.[0] || null)
    } else {
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        category: 'Sofás',
        materials: [],
        client: '',
        completed_date: '',
        featured: false,
        images: [],
      })
      setImagePreview(null)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const localUrl = URL.createObjectURL(file)
    setImagePreview(localUrl)

    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)

    if (url) {
      setFormData((prev) => ({ ...prev, images: [url] }))
      setImagePreview(url)
      toast.success('Imagen subida')
    } else {
      toast.error('Error al subir la imagen')
      setImagePreview(formData.images[0] || null)
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    setSaving(true)

    if (editingProject) {
      const ok = await updateProject(editingProject.id, formData)
      if (ok) {
        toast.success('Proyecto actualizado')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al actualizar el proyecto')
      }
    } else {
      const ok = await addProject(formData)
      if (ok) {
        toast.success('Proyecto creado')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al crear el proyecto')
      }
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return
    const ok = await deleteProject(id)
    if (ok) {
      toast.success('Proyecto eliminado')
    } else {
      toast.error('Error al eliminar el proyecto')
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
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {project.title}
                        {project.featured && (
                          <Badge variant="secondary" className="text-xs">Destacado</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell>{project.client || '-'}</TableCell>
                    <TableCell>{project.completed_date}</TableCell>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
            {/* Left side: form fields */}
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
                    <SelectItem value="Antes y Después">Antes y Después</SelectItem>
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
                  <Label htmlFor="completed_date">Fecha de finalización</Label>
                  <Input
                    id="completed_date"
                    value={formData.completed_date}
                    onChange={(e) =>
                      setFormData({ ...formData, completed_date: e.target.value })
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

              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Proyecto destacado</Label>
              </div>
            </div>

            {/* Right side: image upload */}
            <div className="space-y-2">
              <Label>Imagen</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors h-[220px] flex flex-col items-center justify-center"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Image size={48} weight="thin" />
                    <span className="text-sm">Click para subir imagen</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {uploading && (
                <p className="text-xs text-muted-foreground text-center">Subiendo...</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1" disabled={saving || uploading}>
              {saving ? 'Guardando...' : editingProject ? 'Actualizar Proyecto' : 'Crear Proyecto'}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
