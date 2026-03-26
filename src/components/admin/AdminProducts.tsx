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
import { Plus, Pencil, Trash, Image, UploadSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import type { Product } from '@/lib/types'

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, uploadImage } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
    color: '',
    dimensions: '',
    price: '',
    category: 'Sofás' as Product['category'],
    featured: false,
    images: [] as string[],
  })

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        material: product.material,
        color: product.color,
        dimensions: product.dimensions,
        price: product.price,
        category: product.category,
        featured: product.featured,
        images: product.images || [],
      })
      setImagePreview(product.images?.[0] || null)
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        material: '',
        color: '',
        dimensions: '',
        price: '',
        category: 'Sofás',
        featured: false,
        images: [],
      })
      setImagePreview(null)
    }
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
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
    if (!formData.name || !formData.description || !formData.material) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    setSaving(true)

    if (editingProduct) {
      const ok = await updateProduct(editingProduct.id, formData)
      if (ok) {
        toast.success('Producto actualizado')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al actualizar el producto')
      }
    } else {
      const ok = await addProduct(formData)
      if (ok) {
        toast.success('Producto creado')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al crear el producto')
      }
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    const ok = await deleteProduct(id)
    if (ok) {
      toast.success('Producto eliminado')
    } else {
      toast.error('Error al eliminar el producto')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Productos</h2>
          <p className="text-foreground/70">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={20} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No hay productos todavía
              </p>
              <Button onClick={() => handleOpenDialog()}>
                Agregar tu primer producto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.name}
                        {product.featured && (
                          <Badge variant="secondary" className="text-xs">Destacado</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.material}</TableCell>
                    <TableCell>{product.price || 'Consultar'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
            {/* Left side: form fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value as Product['category'] })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sofás">Sofás</SelectItem>
                      <SelectItem value="Sillas">Sillas</SelectItem>
                      <SelectItem value="Sillones">Sillones</SelectItem>
                      <SelectItem value="Mesas">Mesas</SelectItem>
                      <SelectItem value="Banquetas">Banquetas</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Consultar"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descripción <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">
                    Material <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                    placeholder="Ej: Cuero vacuno"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={formData.color?.startsWith('#') ? formData.color : '#8B7355'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="Ej: Marrón oscuro"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensiones</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensions: e.target.value })
                  }
                  placeholder="Ej: 200cm x 90cm x 85cm"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Producto destacado</Label>
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
              {saving ? 'Guardando...' : editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
