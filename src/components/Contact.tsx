import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Phone, Envelope, MapPin, Clock, WhatsappLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { sendEmail } from '@/lib/auth'
import { DESIGN_TOKENS } from '@/lib/constants'

interface ContactProps {
  prefilledData?: {
    subject?: string
    productId?: string
    projectId?: string
    service?: string
  }
}

const QUICK_SERVICES = [
  'Retapizado de sofa',
  'Retapizado de silla',
  'Restauracion',
  'Mueble a medida',
  'Proyecto comercial',
  'Otro',
]

function MontevideoMap() {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto opacity-15"
      aria-hidden="true"
    >
      {/* Stylized Montevideo coastline & bay */}
      <path
        d="M20 140 C40 135, 60 120, 90 115 C120 110, 140 100, 160 95 C180 90, 200 88, 220 92 C240 96, 260 105, 280 110 C300 115, 310 125, 310 140"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="text-accent"
      />
      {/* Rio de la Plata water area */}
      <path
        d="M20 140 C40 135, 60 120, 90 115 C120 110, 140 100, 160 95 C180 90, 200 88, 220 92 C240 96, 260 105, 280 110 C300 115, 310 125, 310 140 L310 200 L20 200 Z"
        fill="currentColor"
        className="text-accent/5"
      />
      {/* Rambla curve */}
      <path
        d="M60 130 C80 122, 110 112, 140 108 C170 104, 200 102, 230 106 C250 109, 270 115, 290 122"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        strokeLinecap="round"
        fill="none"
        className="text-accent/40"
      />
      {/* Location pin for Tapipocitos */}
      <circle cx="160" cy="72" r="6" fill="currentColor" className="text-accent/60" />
      <circle cx="160" cy="72" r="3" fill="currentColor" className="text-accent" />
      <line x1="160" y1="78" x2="160" y2="95" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" className="text-accent/40" />
      {/* Ciudad Vieja area */}
      <rect x="125" y="85" rx="3" ry="3" width="30" height="18" fill="currentColor" className="text-accent/8" stroke="currentColor" strokeWidth="0.5" />
      {/* Grid streets hint */}
      <line x1="100" y1="60" x2="100" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-accent/20" />
      <line x1="130" y1="55" x2="130" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-accent/20" />
      <line x1="190" y1="55" x2="190" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-accent/20" />
      <line x1="220" y1="60" x2="220" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-accent/20" />
      <line x1="90" y1="70" x2="230" y2="70" stroke="currentColor" strokeWidth="0.3" className="text-accent/20" />
      <line x1="90" y1="85" x2="230" y2="85" stroke="currentColor" strokeWidth="0.3" className="text-accent/20" />
      {/* Label */}
      <text x="160" y="58" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor" className="text-accent/50">
        Montevideo
      </text>
    </svg>
  )
}

export function Contact({ prefilledData }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: prefilledData?.subject || '',
    message: '',
  })
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (prefilledData?.subject) {
      setFormData((prev) => ({ ...prev, subject: prefilledData.subject || '' }))
    }
  }, [prefilledData])

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor completa todos los campos obligatorios')
      return
    }

    setIsSubmitting(true)

    try {
      const servicesText = selectedServices.length > 0
        ? `Servicios seleccionados: ${selectedServices.join(', ')}`
        : ''

      const emailBody = [
        `Nombre: ${formData.name}`,
        `Email: ${formData.email}`,
        formData.phone ? `Telefono: ${formData.phone}` : '',
        servicesText,
        '',
        formData.message,
        prefilledData?.service ? `Servicio: ${prefilledData.service}` : '',
      ].filter(Boolean).join('\n')

      const subject = encodeURIComponent(formData.subject || 'Consulta desde web TAPIPOCITOS')
      const body = encodeURIComponent(emailBody)
      const mailtoLink = `mailto:tapipocitos@gmail.com?subject=${subject}&body=${body}`

      window.open(mailtoLink, '_blank')

      toast.success('Se abrió tu cliente de correo. ¡Enviá el mensaje!')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      setSelectedServices([])
    } catch (error) {
      toast.error('Error al enviar el mensaje. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Background decorative map */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] max-w-full">
          <MontevideoMap />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: DESIGN_TOKENS.colors.title }}
          >
            Hablemos de tu Proyecto
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: DESIGN_TOKENS.colors.description,
              fontSize: DESIGN_TOKENS.typography.description.maxSize,
              lineHeight: DESIGN_TOKENS.typography.lineHeight,
            }}
          >
            Contanos que tenes en mente y te ayudamos a hacerlo realidad. Presupuestos sin cargo.
          </p>

          {/* Prominent WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8"
          >
            <a
              href="https://wa.me/59899251310?text=Hola%20TAPIPOCITOS!%20Quiero%20consultar%20por%20un%20trabajo%20de%20tapiceria."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsappLogo size={28} weight="fill" />
              Escribinos por WhatsApp
            </a>
            <p
              className="text-sm mt-3 opacity-70"
              style={{ color: DESIGN_TOKENS.colors.description }}
            >
              Respuesta rapida de Lunes a Viernes
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle style={{ color: DESIGN_TOKENS.colors.title }}>
                  Presupuesto Express
                </CardTitle>
                <p className="text-sm" style={{ color: DESIGN_TOKENS.colors.description }}>
                  Selecciona los servicios que te interesan y dejanos tu mensaje
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quick service checkboxes */}
                  <div className="space-y-3">
                    <Label
                      style={{ color: DESIGN_TOKENS.colors.title }}
                      className="text-sm font-semibold"
                    >
                      ¿Que servicio necesitas?
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {QUICK_SERVICES.map((service) => (
                        <label
                          key={service}
                          className={`
                            flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 text-sm
                            ${
                              selectedServices.includes(service)
                                ? 'border-accent bg-accent/10 text-accent font-medium shadow-sm'
                                : 'border-border hover:border-accent/40 hover:bg-accent/5'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={() => toggleService(service)}
                            className="sr-only"
                          />
                          <div
                            className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                              ${
                                selectedServices.includes(service)
                                  ? 'border-accent bg-accent'
                                  : 'border-gray-300'
                              }
                            `}
                          >
                            {selectedServices.includes(service) && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span style={{ color: DESIGN_TOKENS.colors.title }}>{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        style={{ color: DESIGN_TOKENS.colors.title }}
                      >
                        Nombre completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        style={{ color: DESIGN_TOKENS.colors.title }}
                      >
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        style={{ color: DESIGN_TOKENS.colors.title }}
                      >
                        Telefono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        style={{ color: DESIGN_TOKENS.colors.title }}
                      >
                        Asunto
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      Mensaje <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Contanos sobre tu proyecto: medidas, tipo de mueble, telas que te gustan..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      aria-required="true"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-base py-6"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? 'Enviando consulta' : 'Enviar consulta'}
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Presupuesto Gratis'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* WhatsApp primary contact card */}
            <a
              href="https://wa.me/59899251310?text=Hola%20TAPIPOCITOS!%20Quiero%20consultar%20por%20un%20trabajo%20de%20tapiceria."
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="border-2 border-green-200 bg-green-50/50 hover:bg-green-50 hover:border-green-300 transition-all duration-200 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                      <WhatsappLogo size={26} weight="fill" className="text-white" />
                    </div>
                    <div>
                      <p
                        className="font-semibold text-base"
                        style={{ color: DESIGN_TOKENS.colors.title }}
                      >
                        WhatsApp
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#25D366' }}>
                        +598 99 251 310
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: DESIGN_TOKENS.colors.description }}>
                        Respuesta en menos de 2 horas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Contact info card */}
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={22} weight="duotone" className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      Telefono
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: DESIGN_TOKENS.colors.description }}
                    >
                      +598 99 251 310
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Envelope size={22} weight="duotone" className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      Email
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: DESIGN_TOKENS.colors.description }}
                    >
                      tapipocitos@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={22} weight="duotone" className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      Direccion
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: DESIGN_TOKENS.colors.description }}
                    >
                      <a
                        href="https://www.google.com/maps/search/Pedro+Cosio+2430+Montevideo+Uruguay"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Pedro Cosio 2430, Montevideo
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={22} weight="duotone" className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      Horario
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: DESIGN_TOKENS.colors.description }}
                    >
                      Lunes a Viernes: 8:00 - 17:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Elegant quote card */}
            <Card className="relative overflow-hidden border-0 shadow-md">
              <div
                className="absolute inset-0 bg-gradient-to-br from-accent/15 via-accent/8 to-transparent"
              />
              <div className="absolute top-3 left-4 text-accent/20 text-5xl font-serif leading-none select-none">
                &ldquo;
              </div>
              <CardContent className="pt-8 pb-6 relative z-10">
                <p
                  className="text-sm leading-relaxed italic pl-2"
                  style={{
                    color: DESIGN_TOKENS.colors.description,
                    lineHeight: DESIGN_TOKENS.typography.lineHeight,
                  }}
                >
                  Cada consulta es importante para nosotros. Te responderemos a
                  la brevedad para comenzar a trabajar en tu proyecto.
                </p>
                <div className="flex items-center gap-3 mt-4 pl-2">
                  <div className="w-8 h-px bg-accent/40" />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: DESIGN_TOKENS.colors.title }}
                  >
                    Familia Calistro
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
