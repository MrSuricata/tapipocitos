import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowDown } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { SafeImage } from '@/components/SafeImage'
import { CountUp } from '@/components/CountUp'
import { useSiteSettings } from '@/lib/settings'

interface HeroProps {
  onNavigate: (view: string) => void
}

/* Hilo de costura animado bajo el título — la firma del oficio. */
function ThreadUnderline() {
  return (
    <svg
      viewBox="0 0 340 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-56 md:w-80 h-6 mt-2"
      aria-hidden="true"
    >
      <motion.path
        d="M4 12 Q34 4, 64 12 Q94 20, 124 12 Q154 4, 184 12 Q214 20, 244 12 Q274 4, 304 12"
        style={{ stroke: 'var(--brand-accent)' }}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.9 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <ellipse cx="318" cy="12" rx="2" ry="5" style={{ fill: 'var(--brand-accent-soft)' }} opacity="0.9" />
        <line x1="318" y1="7" x2="327" y2="2" style={{ stroke: 'var(--brand-accent-soft)' }} strokeWidth="1.4" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}

function HeroStat({
  to,
  suffix,
  separator,
  label,
  delay,
}: {
  to: number
  suffix?: string
  separator?: string
  label: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col"
    >
      <span
        className="text-2xl md:text-[2rem] font-bold tracking-tight text-[var(--brand-accent-soft)]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <CountUp to={to} suffix={suffix} separator={separator} />
      </span>
      <span className="text-[0.65rem] md:text-xs mt-1 tracking-[0.25em] uppercase text-[#C4A882]">
        {label}
      </span>
    </motion.div>
  )
}

/* ================================================
   Hero — atelier cinematográfico
   Foto real del taller a pantalla completa, tratada
   como fotograma: gradiente espresso, viñeta y grano.
   ================================================ */

export function Hero({ onNavigate }: HeroProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [reduced, setReduced] = useState(false)
  const settings = useSiteSettings()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 14,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  const dur = (v: number) => (reduced ? 0 : v)
  const del = (v: number) => (reduced ? 0 : v)

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#1A0F08] film-grain">
      {/* -- Fotograma: cuero Chesterfield en pleno retapizado -- */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: reduced ? 'none' : `translate(${mouse.x * 0.4}px, ${mouse.y * 0.4}px) scale(1.03)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <SafeImage
          src="/fotos/restauraciones/restauracion-chesterfield-cuero-1.jpg"
          alt=""
          className={`w-full h-full object-cover ${reduced ? '' : 'hero-kenburns'}`}
          style={{ objectPosition: 'center 62%' }}
          fallbackClassName="w-full h-full"
          aria-hidden="true"
        />
      </div>

      {/* -- Tratamiento de color: espresso + ámbar, legibilidad editorial -- */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F08]/95 via-[#1A0F08]/70 to-[#1A0F08]/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F08]/80 via-transparent to-[#1A0F08]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_45%,rgba(201,122,64,0.14),transparent_55%)]" />
      {/* Viñeta */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 220px 60px rgba(12, 7, 3, 0.75)' }}
      />

      {/* -- Etiqueta lateral vertical, guiño editorial -- */}
      <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-10">
        <span className="w-px h-16 bg-gradient-to-b from-transparent to-[#C4A882]/50" />
        <span className="side-label text-[#C4A882]/80 select-none">
          Montevideo · Desde 1975
        </span>
        <span className="w-px h-16 bg-gradient-to-t from-transparent to-[#C4A882]/50" />
      </div>

      {/* -- Contenido editorial, alineado a la izquierda -- */}
      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-28 pb-10">
          <div className="max-w-3xl">
            {/* Overline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: dur(0.7), ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-7"
            >
              <span className="block w-12 h-px bg-[var(--brand-accent)]" />
              <span className="text-[0.7rem] md:text-xs tracking-[0.35em] uppercase text-[#C4A882] font-medium">
                Tapicería familiar · Tres generaciones
              </span>
            </motion.div>

            {/* Título display */}
            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur(0.8), delay: del(0.1), ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.02] tracking-tight text-[#F5EDE2]"
            >
              {settings.hero_title}{' '}
              <span className="italic font-semibold text-gradient-amber">
                {settings.hero_accent}
              </span>
            </motion.h1>

            <ThreadUnderline />

            {/* Bajada */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur(0.8), delay: del(0.25), ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 mb-10 text-base md:text-lg leading-relaxed text-[#D9C9B4] max-w-xl"
            >
              {settings.hero_subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur(0.8), delay: del(0.4), ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => onNavigate('gallery')}
                className="group text-base px-8 py-6 rounded-full cta-primary bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-strong)] text-[#FFF8F0] border-0"
                aria-label="Ver galería de trabajos realizados"
              >
                Ver trabajos
                <ArrowRight
                  size={20}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('contact')}
                className="text-base px-8 py-6 rounded-full bg-transparent border-[#C4A882]/50 text-[#F5EDE2] hover:bg-[#F5EDE2]/10 hover:text-[#F5EDE2] hover:border-[#C4A882] backdrop-blur-sm"
                aria-label="Solicitar presupuesto personalizado"
              >
                Solicitar presupuesto
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* -- Barra editorial inferior: números + indicador de scroll -- */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.8), delay: del(0.55) }}
            className="border-t border-[#C4A882]/20 pt-6 flex items-end justify-between gap-6"
          >
            <div className="flex gap-8 md:gap-14">
              <HeroStat to={50} suffix="+" label="Años de oficio" delay={del(0.65)} />
              <HeroStat to={50000} suffix="+" separator="." label="Muebles tapizados" delay={del(0.75)} />
              <HeroStat to={100} suffix="%" label="Artesanal" delay={del(0.85)} />
            </div>

            <motion.button
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
              }}
              className="hidden md:flex items-center gap-3 text-[#C4A882] hover:text-[var(--brand-accent-soft)] transition-colors group"
              animate={reduced ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              aria-label="Desplazar hacia abajo"
            >
              <span className="text-[0.65rem] tracking-[0.3em] uppercase">Descubrir</span>
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
