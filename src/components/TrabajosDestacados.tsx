import { motion } from 'framer-motion'
import { Buildings, Wine, Storefront, Bed, Bank, Briefcase } from '@phosphor-icons/react'
import { DESIGN_TOKENS } from '@/lib/constants'

const FEATURED_PROJECTS = [
  {
    icon: Buildings,
    name: 'Torre Yoo',
    location: 'Punta del Este',
    type: 'Residencial premium',
  },
  {
    icon: Wine,
    name: 'Bodega Garzón',
    location: 'Maldonado',
    type: 'Hospitalidad',
  },
  {
    icon: Bank,
    name: 'Centro Cultural Kalvian',
    location: 'Maldonado',
    type: 'Cultural',
  },
  {
    icon: Bed,
    name: 'Hotel del Prado',
    location: 'Montevideo',
    type: 'Hotelería',
  },
  {
    icon: Bed,
    name: 'Hotel Anastasio',
    location: 'José Ignacio',
    type: 'Hotelería boutique',
  },
  {
    icon: Storefront,
    name: 'Montevideo Shopping',
    location: 'Montevideo',
    type: 'Comercial',
  },
  {
    icon: Briefcase,
    name: 'Zonamerica',
    location: 'Montevideo',
    type: 'Corporativo',
  },
  {
    icon: Buildings,
    name: 'Estudios de arquitectura',
    location: 'Uruguay',
    type: 'Múltiples proyectos',
  },
]

function ThreadOrnament() {
  return (
    <svg
      width="180"
      height="20"
      viewBox="0 0 180 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mt-3 mb-2"
      aria-hidden="true"
    >
      <path
        d="M10 10 Q45 2, 90 10 T170 10"
        stroke="#C97A40"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
        opacity="0.7"
        fill="none"
      />
      <circle cx="90" cy="10" r="2.5" fill="#C97A40" opacity="0.8" />
    </svg>
  )
}

export function TrabajosDestacados() {
  return (
    <section
      id="trabajos-destacados"
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #EFE7DD 100%)' }}
    >
      {/* Subtle pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #8B6D4B 0 1px, transparent 1px 20px), repeating-linear-gradient(-45deg, #8B6D4B 0 1px, transparent 1px 20px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <p
            className="text-sm uppercase tracking-[0.25em] font-semibold mb-3"
            style={{ color: '#C97A40' }}
          >
            Han confiado en nosotros
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: DESIGN_TOKENS.colors.title }}
          >
            Trabajos Destacados
          </h2>
          <ThreadOrnament />
          <p
            className="text-lg max-w-2xl mx-auto mt-4"
            style={{
              color: DESIGN_TOKENS.colors.description,
              fontSize: DESIGN_TOKENS.typography.description.maxSize,
              lineHeight: DESIGN_TOKENS.typography.lineHeight,
            }}
          >
            Hoteles, bodegas, centros culturales y residencias premium en todo
            Uruguay. Más de 50.000 muebles que pasaron por nuestro taller en
            estas cinco décadas.
          </p>
        </motion.div>

        {/* Grid of clients */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURED_PROJECTS.map((project, index) => {
            const Icon = project.icon
            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                className="group"
              >
                <div
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 md:p-6 h-full border border-amber-900/10 hover:border-accent/40 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                    <Icon size={22} weight="duotone" className="text-accent" />
                  </div>
                  <h3
                    className="font-semibold text-base md:text-lg leading-tight mb-1"
                    style={{ color: DESIGN_TOKENS.colors.title }}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="text-xs md:text-sm opacity-70 mb-1"
                    style={{ color: DESIGN_TOKENS.colors.description }}
                  >
                    {project.location}
                  </p>
                  <p
                    className="text-[11px] md:text-xs uppercase tracking-wider font-medium"
                    style={{ color: '#C97A40' }}
                  >
                    {project.type}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p
            className="text-sm md:text-base italic max-w-3xl mx-auto"
            style={{ color: DESIGN_TOKENS.colors.description, opacity: 0.85 }}
          >
            "Muchos clientes nos dicen que tenemos puntualidad inglesa." — y nos
            quedamos con el cumplido. La palabra dada se cumple.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
