import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Pencil,
  Trash,
  Image as ImageIcon,
  Star,
  MagnifyingGlass,
  CloudArrowUp,
  CheckCircle,
  Tag,
  TextAlignLeft,
  Package,
  Ruler,
  Palette,
  CurrencyDollar,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import type { Product } from '@/lib/types'

const CATEGORIES: Product['category'][] = ['Sofás', 'Sillas', 'Sillones', 'Mesas', 'Banquetas', 'Otros']

const EMPTY_FORM = {
  name: '',
  description: '',
  material: '',
  color: '',
  dimensions: '',
  price: '',
  category: 'Sofás' as Product['category'],
  featured: false,
  images: [] as string[],
}

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, uploadImage } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.material || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      setFormData(EMPTY_FORM)
      setImagePreview(null)
    }
    setIsDialogOpen(true)
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
    if (!formData.name || !formData.description || !formData.material) {
      toast.error('Completá nombre, descripción y material')
      return
    }
    setSaving(true)
    const ok = editingProduct
      ? await updateProduct(editingProduct.id, formData)
      : await addProduct(formData)
    setSaving(false)
    if (ok) {
      toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado')
      setIsDialogOpen(false)
    } else {
      toast.error('Error al guardar')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    const ok = await deleteProduct(id)
    if (ok) toast.success('Producto eliminado')
    else toast.error('Error al eliminar')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-warm">Productos</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            <strong className="text-foreground/80">Lo que está en venta:</strong> piezas con precio que el cliente puede encargar · {(products || []).length} en el catálogo
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#2C1810] hover:bg-[#3D2419] text-white rounded-full px-6 gap-2 shadow-md w-full sm:w-auto"
        >
          <Plus size={18} weight="bold" />
          Nuevo producto
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Buscar por nombre, categoría o material…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-full border-muted bg-card"
        />
      </div>

      {/* Grid de cards */}
      {filteredProducts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Package size={48} weight="thin" className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Sin resultados' : 'No hay productos todavía'}
            </p>
            {!searchQuery && (
              <Button variant="outline" onClick={() => handleOpenDialog()} className="rounded-full">
                Agregar el primero
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-transparent hover:border-accent/30"
              onClick={() => handleOpenDialog(product)}
            >
              <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={40} weight="thin" className="text-muted-foreground/30" />
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
                    <Star size={14} weight="fill" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#5A3B2E] border border-white/60">
                    {product.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {product.material}{product.dimensions ? ` · ${product.dimensions}` : ''}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-accent whitespace-nowrap">
                    {product.price || 'Consultar'}
                  </span>
                </div>
                {/* Acciones siempre visibles en touch; en desktop aparecen al pasar el mouse */}
                <div className="flex gap-2 mt-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full h-8 text-xs gap-1.5"
                    onClick={(e) => { e.stopPropagation(); handleOpenDialog(product) }}
                  >
                    <Pencil size={13} /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
                    onClick={(e) => { e.stopPropagation(); handleDelete(product.id) }}
                  >
                    <Trash size={13} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Modal: la foto primero, campos apilados, guardar siempre a mano ── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[92dvh] overflow-hidden p-0 gap-0 rounded-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b bg-card/80 backdrop-blur-sm shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#2C1810] flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                La foto es lo primero que ve el cliente
              </p>
            </div>
          </div>

          {/* Body con scroll */}
          <div className="overflow-y-auto flex-1">
            <div className="p-5 sm:p-6 space-y-5">
              {/* Foto — primero y grande, pensado para sacar/elegir desde el celular */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
                  ${imagePreview
                    ? 'border-transparent hover:border-accent/30'
                    : 'border-accent/40 bg-accent/5 hover:border-accent/70 hover:bg-accent/10'
                  }`}
              >
                {imagePreview ? (
                  <div className="relative group">
                    <img src={imagePreview} alt="Preview" className="w-full aspect-[16/9] object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                      <div className="text-white text-center">
                        <CloudArrowUp size={28} className="mx-auto mb-1" />
                        <span className="text-xs">Cambiar foto</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 sm:hidden bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                    >
                      Cambiar foto
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[16/9] sm:aspect-[3/1] flex flex-col items-center justify-center gap-2.5 p-6">
                    <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center">
                      <CloudArrowUp size={26} className="text-accent" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground/80">Subir foto del producto</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Desde el celular podés sacarla en el momento
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground -mt-3">
                  <div className="w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  Subiendo imagen…
                </div>
              )}

              {/* Nombre */}
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del producto…"
                className="text-lg sm:text-xl font-semibold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent placeholder:text-muted-foreground/40 h-auto py-2.5"
              />

              {/* Categoría chips */}
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                  <Tag size={13} /> Categoría
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`text-xs font-medium px-3.5 py-2 rounded-full border transition-all ${
                        formData.category === cat
                          ? 'bg-[#2C1810] text-white border-[#2C1810] shadow-sm'
                          : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                      }`}
                    >
                      {cat}
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
                  placeholder="Contale al cliente qué hace especial a esta pieza…"
                  rows={3}
                  className="resize-y bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                />
              </div>

              {/* Material + Precio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                    <Package size={13} /> Material
                  </Label>
                  <Input
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Ej: Pana antimanchas"
                    className="bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                    <CurrencyDollar size={13} /> Precio
                  </Label>
                  <Input
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ej: USD 850 (o dejá vacío = Consultar)"
                    className="bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Color + Dimensiones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                    <Palette size={13} /> Color
                  </Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ej: Verde oliva"
                    className="bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
                    <Ruler size={13} /> Dimensiones
                  </Label>
                  <Input
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="Ej: 200 × 90 × 85 cm"
                    className="bg-muted/30 border-muted focus-visible:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Destacado */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100/50">
                <Switch
                  id="featured-product"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <div>
                  <Label htmlFor="featured-product" className="text-sm font-medium cursor-pointer">
                    Destacar este producto
                  </Label>
                  <p className="text-xs text-muted-foreground">Aparece primero en el catálogo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer fijo: guardar siempre a mano, también con el teclado abierto */}
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t bg-card/95 backdrop-blur-sm shrink-0">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || uploading || !formData.name}
              className="bg-[#2C1810] hover:bg-[#3D2419] text-white rounded-full px-6 sm:px-8 gap-2 shadow-md flex-1 sm:flex-none sm:min-w-[180px]"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Guardando…
                </>
              ) : (
                <>
                  <CheckCircle size={18} weight="fill" />
                  {editingProduct ? 'Guardar cambios' : 'Crear producto'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
