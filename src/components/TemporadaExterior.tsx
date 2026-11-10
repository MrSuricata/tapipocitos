import { motion, useReducedMotion } from 'framer-motion'
import { WhatsappLogo } from '@phosphor-icons/react'

/* Banda de temporada: almohadones, colchonetas y camastros para exterior.
   Minimal y editorial — tres fotos y un llamado. */

const WA =
  'https://wa.me/59899251310?text=' +
  encodeURIComponent('Hola TAPIPOCITOS! Quiero consultar por almohadones / colchonetas para exterior.')

const FOTOS = [
  { src: '/fotos/trabajos/almohadones-verde-vivo.jpg', alt: 'Almohadones verdes con vivo crudo' },
  { src: '/fotos/trabajos/banco-curvo-almohadones.jpg', alt: 'Banco curvo con almohadones a juego' },
  { src: '/fotos/trabajos/almohadones-rayados.jpg', alt: 'Pila de almohadones rayados' },
]

const ITEMS = ['Almohadones de todo tipo', 'Colchonetas para reposeras y camastros', 'Fundas con cierre, para lavar', 'A la medida de tu espacio']

export function TemporadaExterior() {
  const reduce = useReducedMotion()
  return (
    <section className="relative py-20 md:py-28" style={{ background: '#F2ECE4' }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-[1fr_1.15fr] md:gap-16 md:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em]" style={{ color: 'var(--brand-accent, #C97A40)' }}>
            Temporada de playa y piscina
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl" style={{ color: '#2C1810' }}>
            Para el <em style={{ color: 'var(--brand-accent, #C97A40)' }}>afuera</em> también
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: 'rgba(44,24,16,0.68)' }}>
            Se viene el verano. Hacemos almohadones y colchonetas a medida para el jardín, la terraza o la piscina, con telas pensadas
            para estar al aire libre.
          </p>
          <ul className="mt-7 border-t" style={{ borderColor: 'rgba(44,24,16,0.12)' }}>
            {ITEMS.map((it, i) => (
              <li key={it} className="flex items-baseline gap-4 border-b py-3" style={{ borderColor: 'rgba(44,24,16,0.1)', color: '#2C1810' }}>
                <span className="font-serif italic" style={{ color: 'var(--brand-accent, #C97A40)' }}>
                  {i + 1}
                </span>
                <span className="text-[15px]">{it}</span>
              </li>
            ))}
          </ul>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
            style={{ background: '#2C1810', color: '#F5EDE2' }}
          >
            <WhatsappLogo size={16} weight="fill" /> Consultá por tu medida
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {FOTOS.map((f, i) => (
            <motion.figure
              key={f.src}
              className={`overflow-hidden ${i === 0 ? 'row-span-2 aspect-[3/5]' : 'aspect-[4/3]'}`}
              style={{ background: '#E9E0D4' }}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
            >
              <img src={f.src} alt={f.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-[1.04]" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
