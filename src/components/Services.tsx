import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Armchair,
  PaintBrush,
  Hammer,
  Sparkle,
  ArrowRight,
  CheckCircle,
  ChatCircleDots,
  PencilRuler,
  HandHeart,
  Truck,
} from '@phosphor-icons/react'
import { SERVICE_DETAILS, DESIGN_TOKENS } from '@/lib/constants'

interface ServicesProps {
  onNavigate: (view: string, data?: any) => void
}

type ServiceKey = keyof typeof SERVICE_DETAILS

// Needle-thread decorative SVG divider
function NeedleThreadDivider() {
  return (
    <svg
      viewBox="0 0 400 40"
      className="w-64 md:w-80 mx-auto mt-4 mb-2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Thread line with curve */}
      <path
        d="M40 20 Q100 8 160 20 T280 20 T360 20"
        stroke="#B8860B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 4"
        opacity="0.6"
      />
      {/* Needle */}
      <path
        d="M355 20 L385 10"
        stroke="#8B7355"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Needle eye */}
      <ellipse cx="387" cy="9" rx="3" ry="2" stroke="#8B7355" strokeWidth="1.2" fill="none" />
      {/* Small stitch marks */}
      <line x1="80" y1="16" x2="85" y2="24" stroke="#B8860B" strokeWidth="1" opacity="0.4" />
      <line x1="200" y1="17" x2="205" y2="23" stroke="#B8860B" strokeWidth="1" opacity="0.4" />
      <line x1="320" y1="16" x2="325" y2="24" stroke="#B8860B" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

// Service-specific SVG illustrations
function FabricRollIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="16" cy="24" rx="6" ry="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 10 H38 C40 10 42 12 42 14 V34 C42 36 40 38 38 38 H16" stroke="currentColor" strokeWidth="1.5" />
      <line x1="22" y1="14" x2="22" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="28" y1="12" x2="28" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="34" y1="11" x2="34" y2="37" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

function RestorationIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Before - worn shape */}
      <rect x="4" y="14" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
      {/* Arrow */}
      <path d="M22 24 H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M27 20 L31 24 L27 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* After - restored shape */}
      <rect x="34" y="14" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M38 20 L40 22 L44 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RoomLayoutIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Room outline */}
      <rect x="6" y="8" width="36" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
      {/* Floor plan elements */}
      <rect x="10" y="28" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <rect x="28" y="12" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Window */}
      <line x1="14" y1="8" x2="14" y2="12" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="20" y1="8" x2="20" y2="12" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      {/* Diagonal measurement */}
      <line x1="10" y1="16" x2="24" y2="24" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Building */}
      <rect x="12" y="10" width="24" height="32" rx="1" stroke="currentColor" strokeWidth="1.5" />
      {/* Windows */}
      <rect x="16" y="14" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <rect x="28" y="14" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <rect x="16" y="22" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <rect x="28" y="22" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Door */}
      <rect x="21" y="34" width="6" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" />
      {/* Flag/commercial indicator */}
      <path d="M36 8 L36 18 L42 15 L36 12" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  )
}

const SERVICE_ACCENTS = [
  { gradient: 'linear-gradient(135deg, #D97706, #F59E0B, #FBBF24)', label: 'amber' },
  { gradient: 'linear-gradient(135deg, #78350F, #92400E, #A16207)', label: 'brown' },
  { gradient: 'linear-gradient(135deg, #4D7C0F, #65A30D, #84CC16)', label: 'sage' },
  { gradient: 'linear-gradient(135deg, #7F1D1D, #991B1B, #B91C1C)', label: 'burgundy' },
]

const SERVICE_ILLUSTRATIONS = [FabricRollIcon, RestorationIcon, RoomLayoutIcon, BuildingIcon]

const PROCESS_STEPS = [
  {
    icon: ChatCircleDots,
    title: 'Consulta',
    description: 'Evaluación inicial gratuita y sin compromiso',
  },
  {
    icon: PencilRuler,
    title: 'Diseño',
    description: 'Propuesta personalizada con materiales y costos',
  },
  {
    icon: HandHeart,
    title: 'Creación',
    description: 'Artesanía experta con materiales de primera',
  },
  {
    icon: Truck,
    title: 'Entrega',
    description: 'Instalación profesional con garantía incluida',
  },
]

export function Services({ onNavigate }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceKey | null>(null)

  const services = [
    {
      icon: Armchair,
      title: 'Tapizado a Medida' as ServiceKey,
    },
    {
      icon: Hammer,
      title: 'Restauración de Muebles' as ServiceKey,
    },
    {
      icon: PaintBrush,
      title: 'Diseño de Interiores' as ServiceKey,
    },
    {
      icon: Sparkle,
      title: 'Proyectos Especiales' as ServiceKey,
    },
  ]

  const handleCardClick = (serviceTitle: ServiceKey) => {
    setSelectedService(serviceTitle)
  }

  const handleViewRelatedWork = () => {
    if (selectedService) {
      const filter = SERVICE_DETAILS[selectedService].filter
      setSelectedService(null)
      setTimeout(() => {
        onNavigate('gallery', filter)
      }, 200)
    }
  }

  const handleRequestQuote = () => {
    if (selectedService) {
      setSelectedService(null)
      setTimeout(() => {
        onNavigate('contact', {
          service: selectedService,
          subject: `Consulta sobre ${selectedService}`,
        })
      }, 200)
    }
  }

  return (
    <>
      <section id="services" className="py-20 px-6 bg-background subtle-fabric-bg relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ color: DESIGN_TOKENS.colors.title }}
            >
              Nuestros Servicios
            </h2>
            <NeedleThreadDivider />
            <p
              className="text-lg max-w-2xl mx-auto mt-4"
              style={{
                color: DESIGN_TOKENS.colors.description,
                fontSize: DESIGN_TOKENS.typography.description.maxSize,
                lineHeight: DESIGN_TOKENS.typography.lineHeight,
              }}
            >
              Cada pieza que pasa por nuestro taller recibe la dedicación de tres generaciones de tapiceros
            </p>
          </motion.div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const details = SERVICE_DETAILS[service.title]
              const accent = SERVICE_ACCENTS[index]
              const Illustration = SERVICE_ILLUSTRATIONS[index]
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: DESIGN_TOKENS.animations.duration.slow / 1000,
                    delay: index * 0.1,
                  }}
                >
                  <Card
                    className="group h-full transition-all cursor-pointer border-2 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden"
                    style={{
                      transitionDuration: `${DESIGN_TOKENS.animations.duration.medium}ms`,
                      transitionTimingFunction: DESIGN_TOKENS.animations.easing,
                    }}
                    onClick={() => handleCardClick(service.title)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardClick(service.title)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Ver detalles de ${service.title}`}
                  >
                    {/* Colored top accent border */}
                    <div
                      className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                      style={{ background: accent.gradient }}
                      aria-hidden="true"
                    />
                    <CardHeader className="relative">
                      {/* Service illustration watermark */}
                      <div className="absolute top-3 right-3 text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors duration-300">
                        <Illustration />
                      </div>
                      <div className="flex items-start gap-4 relative z-10">
                        <motion.div
                          className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: DESIGN_TOKENS.animations.duration.fast / 1000 }}
                        >
                          <service.icon
                            size={32}
                            weight="duotone"
                            className="text-accent"
                          />
                        </motion.div>
                        <div className="flex-1 pr-12">
                          <CardTitle
                            className="mb-2"
                            style={{
                              color: DESIGN_TOKENS.colors.title,
                              fontSize: DESIGN_TOKENS.typography.title.maxSize,
                            }}
                          >
                            {service.title}
                          </CardTitle>
                          <CardDescription
                            className="leading-relaxed"
                            style={{
                              color: DESIGN_TOKENS.colors.description,
                              fontSize: DESIGN_TOKENS.typography.description.minSize,
                              lineHeight: DESIGN_TOKENS.typography.lineHeight,
                            }}
                          >
                            {details.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="ghost"
                        className="group/btn w-full justify-start"
                        aria-label={`Ver trabajos relacionados con ${service.title}`}
                      >
                        Ver detalles completos
                        <ArrowRight
                          size={18}
                          className="ml-2 transition-transform group-hover/btn:translate-x-1"
                        />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Proceso / Workflow Stepper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20"
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-center mb-12"
              style={{ color: DESIGN_TOKENS.colors.title }}
            >
              Nuestro Proceso
            </h3>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between max-w-4xl mx-auto gap-8 md:gap-0">
              {/* Connecting line (desktop) */}
              <div
                className="hidden md:block absolute top-8 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-0.5"
                style={{ background: 'linear-gradient(90deg, #D97706, #92400E, #65A30D, #991B1B)' }}
                aria-hidden="true"
              />
              {/* Connecting line (mobile - vertical) */}
              <div
                className="md:hidden absolute top-8 bottom-8 left-8 w-0.5"
                style={{ background: 'linear-gradient(180deg, #D97706, #92400E, #65A30D, #991B1B)' }}
                aria-hidden="true"
              />

              {PROCESS_STEPS.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 md:flex-1 relative z-10"
                >
                  {/* Step circle */}
                  <div className="w-16 h-16 rounded-full bg-background border-2 border-accent/40 flex items-center justify-center shadow-sm flex-shrink-0">
                    <step.icon size={28} weight="duotone" className="text-accent" />
                  </div>
                  <div className="md:text-center">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider block mb-0.5"
                      style={{ color: DESIGN_TOKENS.colors.description, opacity: 0.6 }}
                    >
                      Paso {index + 1}
                    </span>
                    <h4
                      className="font-bold text-base"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      {step.title}
                    </h4>
                    <p
                      className="text-sm mt-1 max-w-[180px]"
                      style={{
                        color: DESIGN_TOKENS.colors.description,
                        lineHeight: DESIGN_TOKENS.typography.lineHeight,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Detail Dialog */}
      <Dialog
        open={selectedService !== null}
        onOpenChange={(open) => !open && setSelectedService(null)}
      >
        <AnimatePresence>
          {selectedService && (
            <DialogContent
              className="max-w-2xl max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-dialog-title"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: DESIGN_TOKENS.animations.duration.medium / 1000,
                  ease: 'easeOut',
                }}
              >
                <DialogHeader>
                  <DialogTitle
                    id="service-dialog-title"
                    className="text-3xl font-bold pr-8"
                    style={{ color: DESIGN_TOKENS.colors.title }}
                  >
                    {SERVICE_DETAILS[selectedService].title}
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                  <p
                    className="leading-relaxed"
                    style={{
                      color: DESIGN_TOKENS.colors.description,
                      fontSize: DESIGN_TOKENS.typography.description.maxSize,
                      lineHeight: DESIGN_TOKENS.typography.lineHeight,
                    }}
                  >
                    {SERVICE_DETAILS[selectedService].expandedDescription}
                  </p>

                  <div>
                    <h4
                      className="font-semibold mb-3 text-lg"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      Beneficios principales:
                    </h4>
                    <ul className="space-y-2">
                      {SERVICE_DETAILS[selectedService].benefits.map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle
                            size={20}
                            weight="fill"
                            className="text-accent flex-shrink-0 mt-0.5"
                          />
                          <span
                            style={{
                              color: DESIGN_TOKENS.colors.description,
                              fontSize: DESIGN_TOKENS.typography.description.minSize,
                              lineHeight: DESIGN_TOKENS.typography.lineHeight,
                            }}
                          >
                            {benefit}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleViewRelatedWork}
                      className="flex-1 group"
                      aria-label="Ver galería de trabajos relacionados"
                    >
                      Ver trabajos relacionados
                      <ArrowRight
                        size={18}
                        className="ml-2 transition-transform group-hover:translate-x-1"
                      />
                    </Button>
                    <Button
                      onClick={handleRequestQuote}
                      variant="outline"
                      className="flex-1"
                      aria-label="Solicitar presupuesto para este servicio"
                    >
                      Solicitar presupuesto
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
