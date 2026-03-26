import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Plus,
  Pencil,
  Trash,
  X,
  Image as ImageIcon,
  Star,
  MagnifyingGlass,
  CloudArrowUp,
  CheckCircle,
  Tag,
  CalendarBlank,
  User,
  TextAlignLeft,
  Cube,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import type { Project } from '@/lib/types'

const CATEGORIES = [
  { value: 'Sofás', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'Sillas', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'Restauraciones', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 'Antes y Después', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  { value: 'Proyectos Especiales', color: 'bg-rose-100 text-rose-800 border-rose-200' },
]

function getCategoryColor(cat: string) {
  return CATEGORIES.find((c) => c.value === cat)?.color || 'bg-gray-100 text-gray-800'
}

export function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject, uploadImage } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        materials: [...formData.materials, materialInput.trim()],
      })
      setMaterialInput('')
    }
  }

  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
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
      toast.error('Completá el título y la descripción')
      return
    }
    setSaving(true)
    const ok = editingProject
      ? await updateProject(editingProject.id, formData)
      : await addProject(formData)
    setSaving(false)
    if (ok) {
      toast.success(editingProject ? 'Actualizado' : 'Creado')
      setIsDialogOpen(false)
    } else {
      toast.error('Error al guardar')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este trabajo?')) return
    const ok = await deleteProject(id)
    if (ok) toast.success('Eliminado')
    else toast.error('Error al eliminar')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Catálogo</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} trabajos en el catálogo
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#2C1810] hover:bg-[#3D2419] text-white rounded-full px-6 gap-2 shadow-md"
        >
          <Plus size={18} weight="bold" />
          Nuevo trabajo
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Buscar por título, categoría o cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-full border-muted bg-card"
        />
      </div>

      {/* Grid de cards */}
      {filteredProjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Cube size={48} weight="thin" className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Sin resultados' : 'No hay trabajos todavía'}
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                onClick={() => handleOpenDialog()}
                className="rounded-full"
              >
                Agregar el primero
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-transparent hover:border-accent/30"
              onClick={() => handleOpenDialog(project)}
            >
              {/* Image */}
              <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                {project.images?.[0] ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={40} weight="thin" className="text-muted-foreground/30" />
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
                    <Star size={14} weight="fill" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                </div>
              </div>
              {/* Info */}
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-1">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {project.client || 'Sin cliente'}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenDialog(project) }}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    >
                      <Pencil size={14} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }}
                      className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Modal de edición moderno ── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] overflow-hidden p-0 gap-0 rounded-2xl">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2C1810] flex items-center justify-center">
                <Cube size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {editingProject ? 'Editar trabajo' : 'Nuevo trabajo'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {editingProject ? 'Modificá los datos del trabajo' : 'Completá la información del trabajo'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formData.featured && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={12} weight="fill" /> Destacado
                </span>
              )}
            </div>
          </div>

          {/* Modal body */}
          <div className="overflow-y-auto max-h-[calc(95vh-130px)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">
              {/* Left: Form */}
              <div className="p-8 space-y-6">
                {/* Título */}
                <div>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nombre del trabajo..."
                    className="text-xl font-semibold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent placeholder:text-muted-foreground/40 h-auto py-3"
                  />
                </div>

                {/* Categoría chips */}
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                    <Tag size={13} /> Categoría
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.value as Project['category'] })}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                          formData.category === cat.value
                            ? `${cat.color} ring-2 ring-offset-1 ring-current/20 scale-105`
                            : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                        }`}
                      >
                        {cat.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                    <TextAlignLeft size={13} /> Descripción
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describí el trabajo realizado, materiales, proceso..."
                    rows={5}
                    className="resize-y bg-muted/30 border-muted focus-visible:bg-white transition-colors min-h-[120px]"
                  />
                </div>

                {/* Cliente + Fecha */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                      <User size={13} /> Cliente
                    </Label>
                    <Input
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="Nombre del cliente"
                      className="bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                      <CalendarBlank size={13} /> Fecha
                    </Label>
                    <Input
                      value={formData.completed_date}
                      onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
                      placeholder="Ej: Marzo 2024"
                      className="bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Materiales */}
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                    <Cube size={13} /> Materiales
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={materialInput}
                      onChange={(e) => setMaterialInput(e.target.value)}
                      placeholder="Ej: Cuero italiano"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
                      className="bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddMaterial}
                      className="shrink-0 rounded-full px-4"
                    >
                      + Agregar
                    </Button>
                  </div>
                  {formData.materials.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {formData.materials.map((material, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="rounded-full pl-3 pr-1.5 py-1 gap-1 bg-muted/60 hover:bg-muted transition-colors"
                        >
                          {material}
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="rounded-full hover:bg-foreground/10 p-0.5 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100/50">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <div>
                    <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Destacar este trabajo
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Aparecerá primero en el catálogo
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Image upload */}
              <div className="border-l bg-muted/20 p-8">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                  <ImageIcon size={13} /> Foto del trabajo
                </Label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
                    ${imagePreview
                      ? 'border-transparent hover:border-accent/30'
                      : 'border-muted-foreground/20 hover:border-accent/40 hover:bg-accent/5'
                    }`}
                >
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full aspect-[3/2] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <CloudArrowUp size={28} className="mx-auto mb-1" />
                          <span className="text-xs">Cambiar imagen</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/2] flex flex-col items-center justify-center gap-3 p-6">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                        <CloudArrowUp size={24} className="text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground/70">
                          Subir foto
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          JPG, PNG (max 5MB)
                        </p>
                      </div>
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
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    Subiendo imagen...
                  </div>
                )}

                {imagePreview && !uploading && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600">
                    <CheckCircle size={14} weight="fill" />
                    Imagen cargada
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-card/80 backdrop-blur-sm">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || uploading || !formData.title}
              className="bg-[#2C1810] hover:bg-[#3D2419] text-white rounded-full px-8 gap-2 shadow-md min-w-[160px]"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle size={18} weight="fill" />
                  {editingProject ? 'Guardar cambios' : 'Crear trabajo'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
