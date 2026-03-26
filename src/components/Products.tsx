import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { X, ArrowRight, Ruler, Package, Armchair } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import type { Product } from '@/lib/types'
import { DESIGN_TOKENS } from '@/lib/constants'

interface ProductsProps {
  onNavigate: (view: string, data?: any) => void
}

const categoryProductStyles: Record<string, { gradient: string; accent: string }> = {
  'Sofás': {
    gradient: 'linear-gradient(135deg, #8B6914 0%, #C4944A 30%, #A0764B 60%, #6B4423 100%)',
    accent: '#C4944A',
  },
  'Sillas': {
    gradient: 'linear-gradient(135deg, #3B6E8F 0%, #6BA3C2 30%, #5590AD 60%, #2A5570 100%)',
    accent: '#6BA3C2',
  },
  'Sillones': {
    gradient: 'linear-gradient(135deg, #3D6B4F 0%, #6DA07E 30%, #5A8D6B 60%, #2C5038 100%)',
    accent: '#6DA07E',
  },
  'Mesas': {
    gradient: 'linear-gradient(135deg, #7A5C3A 0%, #B8946E 30%, #9C7D5C 60%, #5A3F24 100%)',
    accent: '#B8946E',
  },
  'Banquetas': {
    gradient: 'linear-gradient(135deg, #8A4B5B 0%, #C27D8E 30%, #A86878 60%, #6B3545 100%)',
    accent: '#C27D8E',
  },
  'Otros': {
    gradient: 'linear-gradient(135deg, #6B5B73 0%, #A08DAA 30%, #8A7793 60%, #4D3F55 100%)',
    accent: '#A08DAA',
  },
}

function getProductStyle(category: string) {
  return categoryProductStyles[category] || categoryProductStyles['Otros']
}

function SofaSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-3/5 h-auto opacity-25" aria-hidden="true">
      <path d="M20 90 Q20 50 40 45 L45 40 Q50 35 60 35 L140 35 Q150 35 155 40 L160 45 Q180 50 180 90" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M35 90 L35 70 Q35 55 55 52 L145 52 Q165 55 165 70 L165 90" stroke={color} strokeWidth="2" fill="none" />
      <rect x="15" y="42" width="12" height="48" rx="6" stroke={color} strokeWidth="2" fill="none" />
      <rect x="173" y="42" width="12" height="48" rx="6" stroke={color} strokeWidth="2" fill="none" />
      <line x1="20" y1="90" x2="180" y2="90" stroke={color} strokeWidth="2" />
      <rect x="30" y="90" width="8" height="10" rx="2" fill={color} opacity="0.5" />
      <rect x="162" y="90" width="8" height="10" rx="2" fill={color} opacity="0.5" />
    </svg>
  )
}

function ChairSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 140 160" fill="none" className="w-2/5 h-auto opacity-25" aria-hidden="true">
      <path d="M30 60 Q30 25 50 20 L90 20 Q110 25 110 60" stroke={color} strokeWidth="2.5" fill="none" />
      <rect x="30" y="60" width="80" height="45" rx="5" stroke={color} strokeWidth="2" fill="none" />
      <path d="M30 60 Q20 62 18 75 L18 100 Q18 105 23 105 L30 105" stroke={color} strokeWidth="2" fill="none" />
      <path d="M110 60 Q120 62 122 75 L122 100 Q122 105 117 105 L110 105" stroke={color} strokeWidth="2" fill="none" />
      <line x1="35" y1="105" x2="35" y2="140" stroke={color} strokeWidth="2.5" />
      <line x1="105" y1="105" x2="105" y2="140" stroke={color} strokeWidth="2.5" />
    </svg>
  )
}

function ArmchairSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" className="w-2/5 h-auto opacity-25" aria-hidden="true">
      <path d="M35 55 Q35 25 55 20 L105 20 Q125 25 125 55" stroke={color} strokeWidth="2.5" fill="none" />
      <rect x="35" y="55" width="90" height="50" rx="8" stroke={color} strokeWidth="2" fill="none" />
      <path d="M35 55 Q15 58 13 75 L13 100 Q13 108 22 108 L35 108" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M125 55 Q145 58 147 75 L147 100 Q147 108 138 108 L125 108" stroke={color} strokeWidth="2.5" fill="none" />
      <rect x="40" y="108" width="10" height="12" rx="3" fill={color} opacity="0.5" />
      <rect x="110" y="108" width="10" height="12" rx="3" fill={color} opacity="0.5" />
    </svg>
  )
}

function TableSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-3/5 h-auto opacity-25" aria-hidden="true">
      <ellipse cx="100" cy="40" rx="85" ry="12" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M20 40 L20 42 Q20 48 25 48 L35 48 L45 100" stroke={color} strokeWidth="2" fill="none" />
      <path d="M180 40 L180 42 Q180 48 175 48 L165 48 L155 100" stroke={color} strokeWidth="2" fill="none" />
      <line x1="45" y1="100" x2="155" y2="100" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  )
}

function StoolSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" className="w-1/3 h-auto opacity-25" aria-hidden="true">
      <ellipse cx="60" cy="45" rx="40" ry="10" stroke={color} strokeWidth="2.5" fill="none" />
      <rect x="25" y="35" width="70" height="12" rx="4" stroke={color} strokeWidth="2" fill="none" />
      <line x1="32" y1="47" x2="25" y2="130" stroke={color} strokeWidth="2.5" />
      <line x1="88" y1="47" x2="95" y2="130" stroke={color} strokeWidth="2.5" />
      <line x1="60" y1="47" x2="60" y2="130" stroke={color} strokeWidth="2" />
      <line x1="35" y1="90" x2="85" y2="90" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

function getSilhouetteForCategory(category: string) {
  switch (category) {
    case 'Sofás': return SofaSilhouette
    case 'Sillas': return ChairSilhouette
    case 'Sillones': return ArmchairSilhouette
    case 'Mesas': return TableSilhouette
    case 'Banquetas': return StoolSilhouette
    default: return ArmchairSilhouette
  }
}

function ProductPlaceholder({ category }: { category: string }) {
  const style = getProductStyle(category)
  const Silhouette = getSilhouetteForCategory(category)

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: style.gradient }}>
      {/* Fabric weave pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)`,
        }}
      />
      {/* Diamond stitch pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.5) 12px, rgba(255,255,255,0.5) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255,255,255,0.5) 12px, rgba(255,255,255,0.5) 13px)`,
        }}
      />
      {/* Subtle vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)' }} />
      {/* Furniture silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Silhouette color="rgba(255,255,255,0.9)" />
      </div>
    </div>
  )
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Sofa Montevideo 3 cuerpos',
    description: 'Sofa de 3 cuerpos con estructura de pino reforzado, espuma de alta densidad y tapizado en tela chenille. Patas de madera natural. Disponible en varios colores.',
    material: 'Chenille importado',
    color: '#8B7355',
    dimensions: '220 x 90 x 85 cm',
    price: 'Consultar',
    images: [],
    category: 'Sofás',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Sillon individual Carrasco',
    description: 'Sillon individual con respaldo alto y apoyabrazos curvos. Estructura de eucalipto, espuma soft de 30kg y tapizado en pana premium. Ideal para lectura.',
    material: 'Pana premium',
    color: '#4A6741',
    dimensions: '85 x 80 x 100 cm',
    price: 'Consultar',
    images: [],
    category: 'Sillones',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Silla comedor Clasica',
    description: 'Silla de comedor con asiento y respaldo tapizado en cuero sintetico. Estructura de madera maciza con terminacion laqueada. Resistente y elegante.',
    material: 'Cuero sintetico',
    color: '#2C1810',
    dimensions: '45 x 50 x 92 cm',
    price: 'Consultar',
    images: [],
    category: 'Sillas',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Sofa esquinero Pocitos',
    description: 'Sofa esquinero modular de 5 modulos independientes con fundas removibles y lavables. Espuma HR de alta resiliencia. Se adapta a cualquier living.',
    material: 'Tela antimanchas',
    color: '#C4A882',
    dimensions: '320 x 210 x 78 cm',
    price: 'Consultar',
    images: [],
    category: 'Sofás',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Banqueta alta Nordica',
    description: 'Banqueta alta para barra o isla de cocina. Asiento tapizado giratorio con base de acero cromado. Altura regulable. Perfecta para cocinas modernas.',
    material: 'Microfibra',
    color: '#555555',
    dimensions: '42 x 42 x 75 cm',
    price: 'Consultar',
    images: [],
    category: 'Banquetas',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Mesa ratona tapizada',
    description: 'Mesa ratona con tapa tapizada en cuero ecologico y base de madera paraiso. Funciona como mesa de centro y como asiento auxiliar.',
    material: 'Cuero ecologico',
    color: '#6B4423',
    dimensions: '100 x 60 x 42 cm',
    price: 'Consultar',
    images: [],
    category: 'Mesas',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Sillon Bergere Frances',
    description: 'Sillon bergere de estilo clasico frances con capitone en respaldo y brazos. Patas torneadas en madera de roble. Una pieza de coleccion.',
    material: 'Terciopelo italiano',
    color: '#5B2A3C',
    dimensions: '78 x 82 x 105 cm',
    price: 'Consultar',
    images: [],
    category: 'Sillones',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Silla escritorio tapizada',
    description: 'Silla de escritorio con asiento y respaldo tapizado en tela mesh transpirable. Base giratoria con ruedas de goma. Ergonomica y confortable.',
    material: 'Tela mesh premium',
    color: '#333333',
    dimensions: '60 x 60 x 95 cm',
    price: 'Consultar',
    images: [],
    category: 'Sillas',
    featured: false,
    created_at: new Date().toISOString(),
  },
]

export function Products({ onNavigate }: ProductsProps) {
  const { products } = useStore()
  const [filter, setFilter] = useState<string>('Todos')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const categories = ['Todos', 'Sofás', 'Sillas', 'Sillones', 'Mesas', 'Banquetas', 'Otros']

  const filteredProducts =
    filter === 'Todos'
      ? products
      : products.filter((p) => p.category === filter)

  return (
    <>
      <section id="products" className="py-20 px-6 bg-secondary/30 subtle-fabric-bg relative min-h-screen">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Custom pieces banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-10 mx-auto max-w-2xl"
          >
            <div
              className="relative overflow-hidden rounded-xl px-6 py-4 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(139,105,20,0.08) 0%, rgba(196,148,74,0.12) 50%, rgba(139,105,20,0.08) 100%)',
                border: '1px solid rgba(196,148,74,0.2)',
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(139,105,20,0.3) 8px, rgba(139,105,20,0.3) 9px)`,
                }}
              />
              <p className="relative z-10 text-sm font-semibold" style={{ color: '#8B6914' }}>
                Hacemos piezas a medida
              </p>
              <p className="relative z-10 text-xs mt-1" style={{ color: DESIGN_TOKENS.colors.description }}>
                Diseñamos y fabricamos muebles personalizados según tus necesidades y espacio
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: DESIGN_TOKENS.colors.title }}
            >
              Nuestro Catálogo
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto mb-8"
              style={{
                color: DESIGN_TOKENS.colors.description,
                fontSize: DESIGN_TOKENS.typography.description.maxSize,
                lineHeight: DESIGN_TOKENS.typography.lineHeight,
              }}
            >
              Piezas artesanales que combinan diseño, comodidad y durabilidad
            </p>

            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(value) => value && setFilter(value)}
              className="flex flex-wrap justify-center gap-2"
              data-wrap=""
            >
              {categories.map((category) => (
                <ToggleGroupItem
                  key={category}
                  value={category}
                  className="button-text px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all rounded-full whitespace-nowrap"
                  style={{
                    transitionDuration: `${DESIGN_TOKENS.animations.duration.fast}ms`,
                  }}
                  aria-label={`Filtrar por ${category}`}
                >
                  {category}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: DESIGN_TOKENS.animations.duration.slow / 1000,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.length === 0 ? (
                <motion.div
                  className="col-span-full text-center py-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Armchair
                    size={64}
                    weight="duotone"
                    className="mx-auto mb-4 text-muted-foreground/40"
                  />
                  <p
                    className="text-lg mb-2 max-w-md mx-auto"
                    style={{ color: DESIGN_TOKENS.colors.description }}
                  >
                    Estamos preparando las mejores piezas para esta categoría.
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Mientras tanto, explorá nuestras otras categorías o contactanos para piezas a medida.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setFilter('Todos')}
                      aria-label="Ver todos los productos"
                    >
                      Ver todos los productos
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => onNavigate('contact')}
                      aria-label="Pedir a medida"
                    >
                      Pedir a medida
                      <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: DESIGN_TOKENS.animations.duration.medium / 1000,
                      delay: index * 0.05,
                    }}
                  >
                    <Card
                      className="group overflow-hidden cursor-pointer transition-all h-full flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      style={{
                        transitionDuration: `${DESIGN_TOKENS.animations.duration.medium}ms`,
                        transitionTimingFunction: DESIGN_TOKENS.animations.easing,
                      }}
                      onClick={() => setSelectedProduct(product)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedProduct(product)
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Ver detalles de ${product.name}`}
                    >
                      <div className="aspect-square overflow-hidden bg-secondary card-image-container">
                        {product.images.length > 0 && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover card-image-zoom"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full card-image-zoom">
                            <ProductPlaceholder category={product.category} />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="mb-2">
                          <h3
                            className="text-lg font-semibold line-clamp-1"
                            style={{
                              color: DESIGN_TOKENS.colors.title,
                              fontSize: DESIGN_TOKENS.typography.title.minSize,
                            }}
                          >
                            {product.name}
                          </h3>
                          {product.price && (
                            <p className="text-xs mt-0.5 text-muted-foreground">
                              {product.price}
                            </p>
                          )}
                        </div>
                        <p
                          className="text-sm line-clamp-2 mb-2 flex-1"
                          style={{
                            color: DESIGN_TOKENS.colors.description,
                            fontSize: '14px',
                            lineHeight: DESIGN_TOKENS.typography.lineHeight,
                          }}
                        >
                          {product.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                          <span className="flex items-center gap-1">
                            <Package size={14} />
                            {product.material}
                          </span>
                          {product.color && (
                            <span className="flex items-center gap-1">
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: product.color }}
                                aria-label={`Color: ${product.color}`}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Dialog
        open={selectedProduct !== null}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <AnimatePresence>
          {selectedProduct && (
            <DialogContent
              className="max-w-4xl p-0 max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-dialog-title"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: DESIGN_TOKENS.animations.duration.medium / 1000,
                  ease: 'easeOut',
                }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    {selectedProduct.images.length > 0 && selectedProduct.images[0] ? (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProductPlaceholder category={selectedProduct.category} />
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3
                      id="product-dialog-title"
                      className="text-3xl font-bold"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      {selectedProduct.name}
                    </h3>

                    {selectedProduct.price && (
                      <p className="text-sm text-muted-foreground">
                        {selectedProduct.price}
                      </p>
                    )}

                    <p
                      className="leading-relaxed"
                      style={{
                        color: DESIGN_TOKENS.colors.description,
                        fontSize: DESIGN_TOKENS.typography.description.maxSize,
                        lineHeight: DESIGN_TOKENS.typography.lineHeight,
                      }}
                    >
                      {selectedProduct.description}
                    </p>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-accent" />
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: DESIGN_TOKENS.colors.title }}
                          >
                            Material
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: DESIGN_TOKENS.colors.description }}
                          >
                            {selectedProduct.material}
                          </p>
                        </div>
                      </div>

                      {selectedProduct.dimensions && (
                        <div className="flex items-center gap-3">
                          <Ruler size={20} className="text-accent" />
                          <div>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: DESIGN_TOKENS.colors.title }}
                            >
                              Dimensiones
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: DESIGN_TOKENS.colors.description }}
                            >
                              {selectedProduct.dimensions}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedProduct.color && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2"
                            style={{ backgroundColor: selectedProduct.color }}
                          />
                          <div>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: DESIGN_TOKENS.colors.title }}
                            >
                              Color
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: DESIGN_TOKENS.colors.description }}
                            >
                              {selectedProduct.color}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedProduct(null)
                        setTimeout(() => {
                          onNavigate('contact', {
                            subject: `Consulta sobre: ${selectedProduct.name}`,
                            productId: selectedProduct.id,
                          })
                        }, 200)
                      }}
                      className="w-full mt-6 group"
                      aria-label="Solicitar este producto"
                    >
                      Solicitar este producto
                      <ArrowRight
                        size={18}
                        className="ml-2 transition-transform group-hover:translate-x-1"
                      />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  )
}
