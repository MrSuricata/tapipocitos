import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Quotes } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import type { Testimonial } from '@/lib/types'
import { DESIGN_TOKENS } from '@/lib/constants'

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'demo-1',
    name: 'Maria Rodriguez',
    text: 'Llevamos el sofa de mi abuela que tenia mas de 40 anos. Lo devolvieron como nuevo, respetando el diseno original pero con telas modernas. Un trabajo impecable.',
    date: 'Enero 2024',
    rating: 5,
  },
  {
    id: 'demo-2',
    name: 'Carlos Mendez',
    text: 'Nos hicieron todo el tapizado del restaurante. 20 sillas y 8 banquetas en tiempo record y con una calidad espectacular. Muy profesionales.',
    date: 'Marzo 2024',
    rating: 5,
  },
  {
    id: 'demo-3',
    name: 'Laura Fernandez',
    text: 'Pedi un sillon a medida para mi living y quedo exactamente como lo imaginaba. La atencion personalizada de Leonardo hace toda la diferencia.',
    date: 'Noviembre 2023',
    rating: 5,
  },
]

export function Testimonials() {
  const { testimonials } = useStore()

  const displayTestimonials = testimonials.slice(0, 3)

  return (
    <section className="py-20 px-6 bg-secondary/20 relative">
      <div className="max-w-7xl mx-auto">
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
            Lo que Dicen Nuestros Clientes
          </h2>
          <div className="ornament-divider">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z"
                fill="currentColor"
                className="text-accent"
                opacity="0.4"
              />
            </svg>
          </div>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: DESIGN_TOKENS.colors.description,
              fontSize: DESIGN_TOKENS.typography.description.maxSize,
              lineHeight: DESIGN_TOKENS.typography.lineHeight,
            }}
          >
            La satisfaccion de nuestros clientes es nuestro mejor testimonio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: DESIGN_TOKENS.animations.duration.medium / 1000,
                delay: index * 0.1,
              }}
            >
              <Card
                className="h-full transition-all hover:-translate-y-1 hover:shadow-lg border-t-2 border-t-accent/30"
                style={{
                  transitionDuration: `${DESIGN_TOKENS.animations.duration.medium}ms`,
                  transitionTimingFunction: DESIGN_TOKENS.animations.easing,
                }}
              >
                <CardContent className="pt-6">
                  <Quotes
                    size={36}
                    weight="fill"
                    className="text-accent/20 mb-4"
                  />
                  <p
                    className="leading-relaxed italic mb-6"
                    style={{
                      color: DESIGN_TOKENS.colors.description,
                      fontSize: DESIGN_TOKENS.typography.description.minSize,
                      lineHeight: 1.7,
                    }}
                  >
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        className="bg-primary text-primary-foreground font-semibold text-sm"
                        aria-label={`Avatar de ${testimonial.name}`}
                      >
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: DESIGN_TOKENS.colors.title }}
                      >
                        {testimonial.name}
                      </p>
                      <div
                        className="flex gap-0.5"
                        aria-label={`Calificacion: ${testimonial.rating} de 5 estrellas`}
                      >
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              size={12}
                              weight="fill"
                              className="text-accent"
                            />
                          )
                        )}
                      </div>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: DESIGN_TOKENS.colors.description }}
                    >
                      {testimonial.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
