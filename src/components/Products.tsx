import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FilterTabs } from '@/components/FilterTabs'
import { X, ArrowRight, Ruler, Package, Armchair, ShoppingBag, Check, WhatsappLogo } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import type { Product } from '@/lib/types'
import { DESIGN_TOKENS } from '@/lib/constants'
import { useCart, buildWhatsappConsultLink, type CartItem } from '@/lib/cart'
import { toast } from 'sonner'
import { BackgroundDecor } from '@/components/BackgroundDecor'

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

/* -- Revelado "cortina de taller" (plan B cinematográfico) --
   La foto se descubre con un wipe de clip-path de abajo hacia arriba
   mientras hace un micro-zoom de entrada; el texto llega 120 ms después.
   El escalonado por columna (~90 ms) da la cascada al scrollear. */
const CURTAIN_EASE = [0.65, 0, 0.35, 1] as const
const ZOOM_EASE = [0.22, 1, 0.36, 1] as const
const SOFT_EASE = [0.33, 1, 0.68, 1] as const

const curtainVariants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: (i: number) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.7, ease: CURTAIN_EASE, delay: i * 0.09 },
  }),
}

const zoomVariants = {
  hidden: { scale: 1.14 },
  show: (i: number) => ({
    scale: 1,
    transition: { duration: 1.1, ease: ZOOM_EASE, delay: i * 0.09 },
  }),
}

/* En filas editoriales el texto entra desde su propio lado
   (dir: 1 = texto a la derecha, -1 = a la izquierda). */
const sideTextVariants = {
  hidden: (dir: number) => ({ opacity: 0, x: 26 * dir }),
  show: (dir: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: SOFT_EASE, delay: 0.4 },
  }),
}

const rowCurtainVariants = {
  // Cortina lateral: se abre desde el lado donde vive la foto
  // (dir 1 = foto a la izquierda -> barre hacia la derecha).
  hidden: (dir: number) => ({
    clipPath: dir === 1 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
  }),
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.15, ease: CURTAIN_EASE },
  },
}

const rowZoomVariants = {
  hidden: { scale: 1.12 },
  show: { scale: 1, transition: { duration: 1.7, ease: ZOOM_EASE } },
}

// "2000" → "$U 2.000"; texto libre queda tal cual; vacío → Consultar.
function fmtPrice(price?: string): string {
  const p = (price || '').trim()
  if (!p) return 'Consultar'
  if (/^\d+([.,]\d+)?$/.test(p.replace(/\./g, ''))) {
    const n = Number(p.replace(/\./g, '').replace(',', '.'))
    if (Number.isFinite(n) && n > 0) return `$U ${n.toLocaleString('es-UY')}`
  }
  return p
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
  const { has, toggle } = useCart()
  const [filter, setFilter] = useState<string>('Todos')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const reduced = useReducedMotion()

  // Orientación real de cada foto: el marco se adapta (apaisada → 4:3,
  // vertical/cuadrada → 4:5) en vez de recortar mal.
  const [orientation, setOrientation] = useState<Record<string, 'landscape' | 'portrait'>>({})
  useEffect(() => {
    products.forEach((p) => {
      const src = p.images?.[0]
      if (!src || orientation[p.id]) return
      const img = new Image()
      img.onload = () => {
        setOrientation((prev) =>
          prev[p.id]
            ? prev
            : { ...prev, [p.id]: img.naturalWidth >= img.naturalHeight * 1.15 ? 'landscape' : 'portrait' }
        )
      }
      img.src = src
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const toCartItem = (p: Product): CartItem => ({
    id: p.id,
    name: p.name,
    image: p.images?.[0],
    category: p.category,
    price: p.price,
  })

  const handleToggleCart = (p: Product) => {
    const inCart = has(p.id)
    toggle(toCartItem(p))
    toast.success(inCart ? 'Quitado de tu presupuesto' : 'Agregado a tu presupuesto')
  }

  const categories = ['Todos', 'Sofás', 'Sillas', 'Sillones', 'Mesas', 'Banquetas', 'Otros']

  // Vidriera: los destacados siempre primero (orden estable para el resto).
  const filteredProducts = (
    filter === 'Todos' ? products : products.filter((p) => p.category === filter)
  )
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured))

  return (
    <>
      <section id="products" className="py-24 px-6 bg-secondary/30 subtle-fabric-bg warm-mesh relative min-h-screen">
        <BackgroundDecor />
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
              className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
              style={{ color: DESIGN_TOKENS.colors.title }}
            >
              Nuestros <span className="text-gradient-warm">Productos</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto mb-8"
              style={{
                color: DESIGN_TOKENS.colors.description,
                fontSize: DESIGN_TOKENS.typography.description.maxSize,
                lineHeight: DESIGN_TOKENS.typography.lineHeight,
              }}
            >
              Piezas artesanales que combinan diseño, comodidad y durabilidad. Agregalas a tu presupuesto o consultanos por WhatsApp.
            </p>

            <FilterTabs
              options={categories}
              value={filter}
              onChange={setFilter}
              counts={Object.fromEntries([
                ['Todos', products.length],
                ...categories
                  .filter((c) => c !== 'Todos')
                  .map((c) => [c, products.filter((p) => p.category === c).length]),
              ])}
              className="max-w-3xl mx-auto"
            />
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
              className="max-w-6xl mx-auto space-y-14 sm:space-y-24"
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
                filteredProducts.map((product, index) => {
                  const photoLeft = index % 2 === 0
                  const dir = photoLeft ? 1 : -1
                  const isPortrait =
                    !product.featured && orientation[product.id] !== 'landscape'
                  return (
                    <motion.article
                      key={product.id}
                      initial={reduced ? false : 'hidden'}
                      whileInView="show"
                      viewport={{ once: true, amount: 0.3 }}
                      custom={dir}
                      className="grid md:grid-cols-12 gap-5 md:gap-12 items-center group"
                    >
                      {/* Fila editorial: foto de un lado, relato del otro,
                          alternando — la cortina descubre la foto y el texto
                          entra desde su propio lado. */}
                      <motion.div
                        variants={rowCurtainVariants}
                        custom={dir}
                        role="button"
                        tabIndex={0}
                        aria-label={`Ver detalles de ${product.name}`}
                        onClick={() => setSelectedProduct(product)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelectedProduct(product)
                          }
                        }}
                        className={`relative rounded-2xl overflow-hidden bg-[#E9E0D4] shadow-sm group-hover:shadow-xl transition-shadow duration-300 cursor-pointer md:col-span-7 ${
                          photoLeft ? '' : 'md:order-2'
                        } ${
                          product.featured
                            ? 'aspect-[8/5]'
                            : isPortrait
                              ? 'aspect-[4/5] max-w-md w-full mx-auto'
                              : 'aspect-[4/3]'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      >
                        {product.images.length > 0 && product.images[0] ? (
                          <motion.img
                            variants={rowZoomVariants}
                            whileHover={reduced ? undefined : { scale: 1.04 }}
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            style={{ filter: 'saturate(1.06) contrast(1.04)' }}
                            loading="lazy"
                          />
                        ) : (
                          <motion.div variants={rowZoomVariants} className="w-full h-full">
                            <ProductPlaceholder category={product.category} />
                          </motion.div>
                        )}
                        {product.featured && (
                          <span
                            className="absolute top-4 right-4 text-[0.62rem] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full text-[#1A0F08] pointer-events-none"
                            style={{ background: 'var(--brand-accent-soft)' }}
                          >
                            Destacado
                          </span>
                        )}
                      </motion.div>

                      {/* Relato del producto */}
                      <motion.div
                        variants={sideTextVariants}
                        custom={dir}
                        className={`md:col-span-5 px-1 ${photoLeft ? '' : 'md:order-1'}`}
                      >
                        <span className="text-[0.62rem] font-semibold tracking-[0.26em] uppercase text-[var(--brand-accent)]">
                          {product.category}
                        </span>
                        <h3
                          className="text-2xl sm:text-3xl leading-tight font-bold text-foreground mt-1.5 cursor-pointer hover:text-[var(--brand-accent-strong)] transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                          onClick={() => setSelectedProduct(product)}
                        >
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3 sm:line-clamp-4 max-w-prose">
                            {product.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground/80 mt-3">
                          {[product.material, product.dimensions].filter(Boolean).join('  ·  ')}
                        </p>
                        <p
                          className="text-xl sm:text-2xl font-bold text-[var(--brand-accent)] mt-4"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {fmtPrice(product.price)}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-5">
                          <Button
                            onClick={() => handleToggleCart(product)}
                            variant={has(product.id) ? 'default' : 'outline'}
                            className="rounded-full px-6"
                            aria-label={
                              has(product.id)
                                ? `Quitar ${product.name} del presupuesto`
                                : `Agregar ${product.name} al presupuesto`
                            }
                          >
                            {has(product.id) ? (
                              <>
                                <Check size={16} weight="bold" className="mr-2" />
                                En tu presupuesto
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={16} className="mr-2" />
                                Agregar al presupuesto
                              </>
                            )}
                          </Button>
                          <a
                            href={buildWhatsappConsultLink(toCartItem(product))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-11 h-11 rounded-full text-white shadow-md hover:scale-105 transition-transform"
                            style={{ backgroundColor: '#1FAF5A' }}
                            aria-label={`Consultar por ${product.name} en WhatsApp`}
                          >
                            <WhatsappLogo size={18} weight="fill" />
                          </a>
                        </div>
                      </motion.div>
                    </motion.article>
                  )
                })
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
                  ease: SOFT_EASE,
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

                    <p
                      className="text-xl font-bold text-[var(--brand-accent)]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {fmtPrice(selectedProduct.price)}
                    </p>

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

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <Button
                        onClick={() => handleToggleCart(selectedProduct)}
                        variant={has(selectedProduct.id) ? 'default' : 'outline'}
                        className="flex-1"
                        aria-label={
                          has(selectedProduct.id)
                            ? 'Quitar del presupuesto'
                            : 'Agregar al presupuesto'
                        }
                      >
                        {has(selectedProduct.id) ? (
                          <>
                            <Check size={18} weight="bold" className="mr-2" />
                            En tu presupuesto
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={18} className="mr-2" />
                            Agregar al presupuesto
                          </>
                        )}
                      </Button>
                      <a
                        href={buildWhatsappConsultLink(toCartItem(selectedProduct))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium shadow-sm hover:shadow transition-all hover:scale-[1.02]"
                        style={{ backgroundColor: '#25D366' }}
                        aria-label="Consultar por WhatsApp"
                      >
                        <WhatsappLogo size={18} weight="fill" />
                        Consultar por WhatsApp
                      </a>
                    </div>
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
