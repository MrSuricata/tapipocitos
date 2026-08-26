import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FilterTabs } from '@/components/FilterTabs'
import { X, ArrowRight, ImageSquare } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import type { Project } from '@/lib/types'
import { DESIGN_TOKENS } from '@/lib/constants'
import { BackgroundDecor } from '@/components/BackgroundDecor'

interface GalleryProps {
  onNavigate: (view: string, data?: any) => void
  initialFilter?: string
}

/* Revelado "cortina de taller" — mismo lenguaje que Productos. */
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

/* Ritmo de proporciones del masonry: reserva altura (las cortinas no se
   disparan antes de que carguen las fotos, y no hay saltos de layout) y
   da variedad visual aunque todas las fotos vengan 4:3 de la cámara. */
const MASONRY_ASPECTS = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/2]']

const sideTextVariants = {
  hidden: (dir: number) => ({ opacity: 0, x: 26 * dir }),
  show: () => ({
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

const categoryStyles: Record<string, { gradient: string; accent: string; overlay: string }> = {
  'Sofás': {
    gradient: 'linear-gradient(135deg, #8B6914 0%, #C4944A 30%, #A0764B 60%, #6B4423 100%)',
    accent: '#C4944A',
    overlay: 'rgba(139, 105, 20, 0.12)',
  },
  'Sillas': {
    gradient: 'linear-gradient(135deg, #5B7B8A 0%, #8AABB8 30%, #6D929F 60%, #3E5F6B 100%)',
    accent: '#8AABB8',
    overlay: 'rgba(91, 123, 138, 0.12)',
  },
  'Restauraciones': {
    gradient: 'linear-gradient(135deg, #7A4B3A 0%, #B8806E 30%, #9C6B59 60%, #5A3526 100%)',
    accent: '#B8806E',
    overlay: 'rgba(122, 75, 58, 0.12)',
  },
  'Proyectos Especiales': {
    gradient: 'linear-gradient(135deg, #6B5B73 0%, #A08DAA 30%, #8A7793 60%, #4D3F55 100%)',
    accent: '#A08DAA',
    overlay: 'rgba(107, 91, 115, 0.12)',
  },
  'Antes y Después': {
    gradient: 'linear-gradient(135deg, #8A6E2F 0%, #D4A853 30%, #B89444 60%, #6E5624 100%)',
    accent: '#D4A853',
    overlay: 'rgba(138, 110, 47, 0.12)',
  },
}

function getStyleForCategory(category: string) {
  return categoryStyles[category] || categoryStyles['Sofás']
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

function BeforeAfterSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 120" fill="none" className="w-3/5 h-auto opacity-25" aria-hidden="true">
      <path d="M15 85 Q15 55 30 50 L35 47 Q38 42 45 42 L85 42 Q92 42 95 47 L100 50 Q115 55 115 85" stroke={color} strokeWidth="1.8" fill="none" strokeDasharray="4 3" opacity="0.6" />
      <line x1="15" y1="85" x2="115" y2="85" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
      <line x1="120" y1="30" x2="120" y2="95" stroke={color} strokeWidth="2" />
      <polygon points="115,55 120,48 125,55" fill={color} opacity="0.7" />
      <polygon points="115,70 120,77 125,70" fill={color} opacity="0.7" />
      <path d="M125 85 Q125 55 140 50 L145 47 Q148 42 155 42 L195 42 Q202 42 205 47 L210 50 Q225 55 225 85" stroke={color} strokeWidth="2.2" fill="none" />
      <line x1="125" y1="85" x2="225" y2="85" stroke={color} strokeWidth="2" />
      <text x="55" y="100" fill={color} fontSize="10" textAnchor="middle" fontWeight="600" opacity="0.5">ANTES</text>
      <text x="175" y="100" fill={color} fontSize="10" textAnchor="middle" fontWeight="600" opacity="0.5">DESPUÉS</text>
    </svg>
  )
}

function ProjectPlaceholder({ category }: { category: string }) {
  const style = getStyleForCategory(category)
  const SilhouetteComponent = category === 'Sillas'
    ? ChairSilhouette
    : category === 'Antes y Después'
      ? BeforeAfterSilhouette
      : SofaSilhouette

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: style.gradient }}>
      {/* Fabric weave pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)`,
        }}
      />
      {/* Diagonal stitch pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px)`,
        }}
      />
      {/* Subtle vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)' }} />
      {/* Furniture silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        <SilhouetteComponent color="rgba(255,255,255,0.9)" />
      </div>
    </div>
  )
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'demo-p1',
    title: 'Sofa Chesterfield 3 cuerpos',
    description: 'Retapizado completo de sofa Chesterfield clasico en cuero vacuno marron oscuro. Se restauro la estructura de madera, se reemplazaron los resortes y se trabajo el capitone original a mano.',
    category: 'Sofás',
    images: [],
    materials: ['Cuero vacuno', 'Espuma alta densidad', 'Resortes zig-zag', 'Madera de eucalipto'],
    client: 'Familia Pereira',
    completed_date: 'Enero 2024',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p2',
    title: 'Sillas de comedor estilo nordico',
    description: 'Set de 6 sillas de comedor retapizadas en tela lino gris claro con patas de madera natural. Espuma de alta densidad para maxima comodidad.',
    category: 'Sillas',
    images: [],
    materials: ['Tela lino', 'Espuma densidad 28', 'Clavos tapiceros'],
    client: 'Restaurant La Pasiva',
    completed_date: 'Marzo 2024',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p3',
    title: 'Restauracion sillon bergere antiguo',
    description: 'Restauracion integral de sillon bergere de 1940. Se reconstruyo la estructura, se repuso el relleno de crin natural y se tapizo en terciopelo verde esmeralda respetando el diseno original.',
    category: 'Restauraciones',
    images: [],
    materials: ['Terciopelo italiano', 'Crin natural', 'Muelles bicónicos', 'Tachas de bronce'],
    client: 'Sr. Martinez',
    completed_date: 'Noviembre 2023',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p4',
    title: 'Tapizado hotel boutique Carrasco',
    description: 'Proyecto completo de tapizado para hotel boutique: 12 cabeceras de cama, 24 sillas de comedor, 6 sillones de recepcion y cortinados para 15 habitaciones.',
    category: 'Proyectos Especiales',
    images: [],
    materials: ['Tela antimanchas', 'Cuero sintetico premium', 'Espuma ignifuga', 'Guata de poliester'],
    client: 'Hotel Boutique Carrasco',
    completed_date: 'Septiembre 2023',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p5',
    title: 'Sofa esquinero a medida',
    description: 'Sofa esquinero de 3.20m x 2.10m fabricado a medida en tela chenille beige. Modulos independientes con fundas removibles y lavables. Patas de acero inoxidable.',
    category: 'Sofás',
    images: [],
    materials: ['Chenille importado', 'Espuma soft', 'Estructura pino reforzado', 'Patas acero inox'],
    client: 'Familia Gonzalez',
    completed_date: 'Febrero 2024',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p6',
    title: 'Butaca antigua: antes y despues',
    description: 'Transformacion completa de butaca victoriana. De un estado deplorable con tela rasgada y estructura debilitada, a una pieza restaurada con tapizado en pana bordo y terminaciones en tachas doradas.',
    category: 'Antes y Después',
    images: [],
    materials: ['Pana importada', 'Tachas doradas', 'Yute', 'Espuma de 30kg'],
    client: 'Sra. Bentancor',
    completed_date: 'Diciembre 2023',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p7',
    title: 'Banqueta bar retapizada',
    description: 'Set de 8 banquetas altas para barra de bar retapizadas en cuero sintetico negro con costura decorativa en hilo dorado. Base giratoria de acero cromado.',
    category: 'Sillas',
    images: [],
    materials: ['Cuero sintetico', 'Hilo encerado dorado', 'Espuma de 25kg'],
    client: 'Bar El Barzon',
    completed_date: 'Abril 2024',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p8',
    title: 'Sillon reclinable: antes y despues',
    description: 'Sillon reclinable La-Z-Boy con mecanismo danado y tapizado gastado. Se reparo el mecanismo, se cambio toda la espuma y se retapizo en microfibra gris oscuro.',
    category: 'Antes y Después',
    images: [],
    materials: ['Microfibra premium', 'Espuma HR', 'Mecanismo reclinable nuevo'],
    client: 'Dr. Silveira',
    completed_date: 'Mayo 2024',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p9',
    title: 'Restauracion juego de living completo',
    description: 'Restauracion de juego de living anos 60: sofa de 3 cuerpos y 2 sillones individuales. Se respeto el diseno mid-century con tela mostaza y patas conicas de madera.',
    category: 'Restauraciones',
    images: [],
    materials: ['Tela tapicera mostaza', 'Espuma blanda', 'Cinchas elasticas', 'Patas conicas laqueadas'],
    client: 'Arq. Lopez',
    completed_date: 'Julio 2023',
    featured: false,
    created_at: new Date().toISOString(),
  },
]

export function Gallery({ onNavigate, initialFilter }: GalleryProps) {
  const { projects } = useStore()
  const [filter, setFilter] = useState<string>(initialFilter || 'Todos')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter)
    }
  }, [initialFilter])

  const categories = [
    'Todos',
    'Sofás',
    'Sillas',
    'Restauraciones',
    'Antes y Después',
    'Proyectos Especiales',
  ]

  // Vidriera: los trabajos destacados abren la galería.
  const filteredProjects = (
    filter === 'Todos' ? projects : projects.filter((p) => p.category === filter)
  )
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured))

  return (
    <>
      <section id="gallery" className="py-24 px-6 bg-background subtle-fabric-bg warm-mesh relative min-h-screen">
        <BackgroundDecor />
        <div className="max-w-7xl mx-auto relative z-10">
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
              Trabajos <span className="text-gradient-warm">Realizados</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto mb-8"
              style={{
                color: DESIGN_TOKENS.colors.description,
                fontSize: DESIGN_TOKENS.typography.description.maxSize,
                lineHeight: DESIGN_TOKENS.typography.lineHeight,
              }}
            >
              Retapizados, restauraciones, piezas a medida y proyectos especiales. Todo hecho a mano en nuestro taller.
            </p>

            <FilterTabs
              options={categories}
              value={filter}
              onChange={setFilter}
              counts={Object.fromEntries([
                ['Todos', projects.length],
                ...categories
                  .filter((c) => c !== 'Todos')
                  .map((c) => [c, projects.filter((p) => p.category === c).length]),
              ])}
              className="max-w-4xl mx-auto"
            />
            <p className="mt-7 text-[0.62rem] tracking-[0.32em] uppercase font-semibold text-[var(--brand-accent)]">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'pieza hecha' : 'piezas hechas'} a mano en el taller
            </p>
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
              {filteredProjects.length === 0 ? (
                <motion.div
                  className="col-span-full text-center py-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageSquare
                    size={64}
                    weight="duotone"
                    className="mx-auto mb-4 text-muted-foreground/40"
                  />
                  <p
                    className="text-lg mb-2 max-w-md mx-auto"
                    style={{ color: DESIGN_TOKENS.colors.description }}
                  >
                    Estamos preparando fotos de nuestros mejores trabajos en esta categoría.
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Mientras tanto, conocé nuestros otros proyectos o contactanos directamente.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setFilter('Todos')}
                      aria-label="Ver todos los proyectos"
                    >
                      Ver todos los proyectos
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => onNavigate('contact')}
                      aria-label="Contactanos"
                    >
                      Contactanos
                      <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                filteredProjects.map((project, index) => {
                  const photoLeft = index % 2 === 0
                  const dir = photoLeft ? 1 : -1
                  return (
                    <motion.article
                      key={project.id}
                      initial={reduced ? false : 'hidden'}
                      whileInView="show"
                      viewport={{ once: true, amount: 0.3 }}
                      custom={dir}
                      className="grid md:grid-cols-12 gap-5 md:gap-12 items-center group"
                    >
                      {/* Fila editorial: la foto se descubre con la cortina,
                          el relato del trabajo entra desde su lado. */}
                      <motion.div
                        variants={rowCurtainVariants}
                        role="button"
                        tabIndex={0}
                        aria-label={`Ver detalles del proyecto ${project.title}`}
                        onClick={() => setSelectedProject(project)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelectedProject(project)
                          }
                        }}
                        className={`relative rounded-2xl overflow-hidden bg-[#E9E0D4] shadow-sm group-hover:shadow-xl transition-shadow duration-300 cursor-pointer md:col-span-7 aspect-[4/3] ${
                          photoLeft ? '' : 'md:order-2'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      >
                        <motion.div
                          variants={rowZoomVariants}
                          whileHover={reduced ? undefined : { scale: 1.04 }}
                          className="w-full h-full"
                        >
                          {project.images.length > 0 && project.images[0] ? (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover block"
                              style={{ filter: 'saturate(1.06) contrast(1.04)' }}
                              loading="lazy"
                            />
                          ) : (
                            <ProjectPlaceholder category={project.category} />
                          )}
                        </motion.div>
                      </motion.div>

                      {/* Relato del trabajo */}
                      <motion.div
                        variants={sideTextVariants}
                        className={`md:col-span-5 px-1 ${photoLeft ? '' : 'md:order-1'}`}
                      >
                        <span className="text-[0.62rem] font-semibold tracking-[0.26em] uppercase text-[var(--brand-accent)]">
                          {project.category}
                          {project.completed_date ? ` · ${project.completed_date}` : ''}
                        </span>
                        <h3
                          className="text-2xl sm:text-3xl leading-tight font-bold text-foreground mt-1.5 cursor-pointer hover:text-[var(--brand-accent-strong)] transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                          onClick={() => setSelectedProject(project)}
                        >
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3 sm:line-clamp-4 max-w-prose">
                            {project.description}
                          </p>
                        )}
                        {project.materials.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {project.materials.slice(0, 4).map((m, i) => (
                              <span
                                key={i}
                                className="text-[0.65rem] px-2.5 py-1 rounded-full bg-[var(--brand-accent)]/10 text-[var(--brand-accent-strong)] font-medium"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)] mt-5 group/link"
                        >
                          Ver proyecto
                          <ArrowRight size={15} className="group-hover/link:translate-x-0.5 transition-transform" />
                        </button>
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
        open={selectedProject !== null}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <AnimatePresence>
          {selectedProject && (
            <DialogContent
              className="max-w-4xl p-0 max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
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
                  onClick={() => setSelectedProject(null)}
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </Button>

                <div className="p-6">
                  <div className="aspect-video rounded-lg mb-6 overflow-hidden relative">
                    {selectedProject.images.length > 0 && selectedProject.images[0] ? (
                      <img
                        src={selectedProject.images[0]}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProjectPlaceholder category={selectedProject.category} />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span
                        className="text-sm px-3 py-1 rounded font-medium"
                        style={{
                          backgroundColor: `${getStyleForCategory(selectedProject.category).accent}20`,
                          color: getStyleForCategory(selectedProject.category).accent,
                        }}
                      >
                        {selectedProject.category}
                      </span>
                    </div>

                    <h3
                      id="project-dialog-title"
                      className="text-3xl font-bold"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      {selectedProject.title}
                    </h3>

                    <p
                      className="leading-relaxed"
                      style={{
                        color: DESIGN_TOKENS.colors.description,
                        fontSize: DESIGN_TOKENS.typography.description.maxSize,
                        lineHeight: DESIGN_TOKENS.typography.lineHeight,
                      }}
                    >
                      {selectedProject.description}
                    </p>

                    {selectedProject.materials.length > 0 && (
                      <div>
                        <h4
                          className="font-semibold mb-2"
                          style={{ color: DESIGN_TOKENS.colors.title }}
                        >
                          Materiales utilizados:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.materials.map((material, i) => (
                            <span
                              key={i}
                              className="text-sm bg-secondary px-3 py-1 rounded"
                              style={{ color: DESIGN_TOKENS.colors.description }}
                            >
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProject.client && (
                      <p
                        className="text-sm"
                        style={{ color: DESIGN_TOKENS.colors.description }}
                      >
                        Cliente: {selectedProject.client}
                      </p>
                    )}

                    <p
                      className="text-sm"
                      style={{ color: DESIGN_TOKENS.colors.description }}
                    >
                      Completado: {selectedProject.completed_date}
                    </p>

                    <Button
                      onClick={() => {
                        setSelectedProject(null)
                        setTimeout(() => {
                          onNavigate('contact', {
                            subject: `Consulta sobre: ${selectedProject.title}`,
                            projectId: selectedProject.id,
                          })
                        }, 200)
                      }}
                      className="w-full mt-4 group"
                      aria-label="Solicitar proyecto similar"
                    >
                      Solicitar algo similar
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
