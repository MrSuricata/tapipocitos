import { motion } from 'framer-motion'
import { Star, Quotes } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import type { Testimonial } from '@/lib/types'

const APPLE_EASE = [0.16, 1, 0.3, 1] as const

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial
  index: number
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: APPLE_EASE }}
      className="relative flex flex-col h-full rounded-2xl p-8 glass-dark shadow-float"
    >
      <Quotes size={40} weight="fill" className="text-[#C97A40] mb-5" aria-hidden="true" />
      <blockquote
        className="flex-1 text-lg leading-relaxed text-[#EDE2D2] italic"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        “{testimonial.text}”
      </blockquote>
      <figcaption className="mt-7 pt-5 border-t border-[#C4A882]/20 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-wide text-[#F5EDE2] uppercase">
            {testimonial.name}
          </p>
          <p className="text-xs text-[#C4A882] mt-0.5">{testimonial.date}</p>
        </div>
        <div
          className="flex gap-0.5"
          aria-label={`Calificacion: ${testimonial.rating} de 5 estrellas`}
        >
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={13} weight="fill" className="text-[#E8B380]" />
          ))}
        </div>
      </figcaption>
    </motion.figure>
  )
}

/* Sala oscura de cuero: la textura real del taller de fondo,
   citas grandes en serif crema — el contrapunto inmersivo de la home. */
export function Testimonials() {
  const { testimonials } = useStore()
  const displayTestimonials = testimonials.slice(0, 3)

  return (
    <section className="relative py-24 md:py-32 px-6 bg-[#1A0F08] overflow-hidden film-grain">
      {/* Textura de cuero real, apenas visible */}
      <div
        className="absolute inset-0 opacity-[0.14] bg-cover bg-center"
        style={{ backgroundImage: "url('/fotos/leather-texture.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F08] via-transparent to-[#1A0F08]" aria-hidden="true" />
      {/* Resplandor ámbar central */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,122,64,0.12),transparent_60%)]"
        aria-hidden="true"
      />
      {/* Comilla gigante de fondo */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 text-[26rem] leading-none text-[#C97A40]/[0.06] pointer-events-none select-none hidden md:block"
        style={{ fontFamily: "'Playfair Display', serif" }}
        aria-hidden="true"
      >
        ”
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: APPLE_EASE }}
          className="mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="block w-12 h-px bg-[#C97A40]" />
            <span className="text-[0.7rem] md:text-xs tracking-[0.35em] uppercase text-[#C4A882] font-medium">
              Testimonios
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#F5EDE2]">
            Lo que dicen{' '}
            <span className="italic font-semibold text-gradient-amber">
              nuestros clientes
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
