import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { DESIGN_TOKENS } from '@/lib/constants'

interface HeroProps {
  onNavigate: (view: string) => void
}

/* ---------- Inline SVG sub-components ---------- */

function ChesterfieldSofa({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sofa base / seat */}
      <path
        d="M120 280 C120 260, 140 240, 160 240 L640 240 C660 240, 680 260, 680 280 L680 320 C680 330, 670 340, 660 340 L140 340 C130 340, 120 330, 120 320 Z"
        fill="currentColor"
        opacity="0.15"
      />
      {/* Back rest - large curved */}
      <path
        d="M140 240 C140 140, 180 90, 240 80 L560 80 C620 90, 660 140, 660 240"
        stroke="currentColor"
        strokeWidth="3"
        fill="currentColor"
        opacity="0.08"
      />
      {/* Left arm */}
      <path
        d="M120 280 C80 280, 60 250, 60 220 L60 180 C60 150, 80 130, 110 130 L140 130 L140 280 Z"
        fill="currentColor"
        opacity="0.12"
      />
      {/* Right arm */}
      <path
        d="M680 280 C720 280, 740 250, 740 220 L740 180 C740 150, 720 130, 690 130 L660 130 L660 280 Z"
        fill="currentColor"
        opacity="0.12"
      />
      {/* Tufting details - diamond pattern on backrest */}
      {[0, 1, 2, 3, 4].map((col) => {
        const cx = 260 + col * 80
        return [0, 1, 2].map((row) => {
          const cy = 120 + row * 42
          return (
            <g key={`tuft-${col}-${row}`}>
              <circle cx={cx} cy={cy} r="3" fill="currentColor" opacity="0.18" />
              {/* Diamond lines connecting tufts */}
              {col < 4 && (
                <line
                  x1={cx + 4}
                  y1={cy}
                  x2={cx + 76}
                  y2={cy}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.1"
                />
              )}
              {row < 2 && (
                <line
                  x1={cx}
                  y1={cy + 4}
                  x2={cx}
                  y2={cy + 38}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.1"
                />
              )}
            </g>
          )
        })
      })}
      {/* Seat cushion line */}
      <path
        d="M170 260 Q400 250, 630 260"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.12"
        fill="none"
      />
      {/* Legs */}
      <rect x="155" y="340" width="12" height="25" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="633" y="340" width="12" height="25" rx="3" fill="currentColor" opacity="0.15" />
      {/* Scroll arm detail - left */}
      <path
        d="M75 155 C65 155, 58 165, 62 175"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.12"
        fill="none"
      />
      {/* Scroll arm detail - right */}
      <path
        d="M725 155 C735 155, 742 165, 738 175"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.12"
        fill="none"
      />
    </svg>
  )
}

function NeedleThreadDivider() {
  return (
    <svg
      viewBox="0 0 300 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 md:w-64 h-8 mx-auto my-4"
      aria-hidden="true"
    >
      {/* Thread line - wavy stitch */}
      <motion.path
        d="M20 20 Q45 8, 70 20 Q95 32, 120 20 Q145 8, 170 20 Q195 32, 220 20 Q245 8, 260 20"
        stroke="#C97A40"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
      />
      {/* Needle */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.4 }}
      >
        <ellipse cx="272" cy="20" rx="2" ry="5" fill="#8B7355" opacity="0.9" />
        <line x1="272" y1="15" x2="280" y2="10" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
        {/* Needle eye */}
        <circle cx="272" cy="18" r="1" fill="none" stroke="#8B7355" strokeWidth="0.5" />
      </motion.g>
      {/* Small decorative dots at ends */}
      <circle cx="12" cy="20" r="2.5" fill="#C97A40" opacity="0.5" />
      <circle cx="8" cy="20" r="1.5" fill="#C97A40" opacity="0.3" />
    </svg>
  )
}

/* ---------- Floating decorative elements ---------- */

function FloatingScissors({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute w-6 h-6 md:w-8 md:h-8 hidden md:block"
      style={style}
      aria-hidden="true"
      animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx="14" cy="36" r="6" stroke="#C97A40" strokeWidth="1.5" fill="none" opacity="0.3" />
      <circle cx="34" cy="36" r="6" stroke="#C97A40" strokeWidth="1.5" fill="none" opacity="0.3" />
      <line x1="14" y1="30" x2="28" y2="8" stroke="#C97A40" strokeWidth="1.5" opacity="0.3" />
      <line x1="34" y1="30" x2="20" y2="8" stroke="#C97A40" strokeWidth="1.5" opacity="0.3" />
    </motion.svg>
  )
}

function FloatingNeedle({ style, delay = 0 }: { style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute w-5 h-5 md:w-7 md:h-7 hidden md:block"
      style={style}
      aria-hidden="true"
      animate={{ y: [0, -12, 0], rotate: [0, 15, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {/* Needle body */}
      <line x1="8" y1="32" x2="32" y2="8" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      {/* Needle eye */}
      <circle cx="30" cy="10" r="2" fill="none" stroke="#8B7355" strokeWidth="1" opacity="0.3" />
      {/* Thread trailing */}
      <path d="M8 32 Q4 36, 6 38 Q8 40, 12 38" stroke="#C97A40" strokeWidth="1" fill="none" opacity="0.25" />
    </motion.svg>
  )
}

function FloatingFabricSwatch({ style, delay = 0 }: { style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute w-5 h-5 md:w-7 md:h-7 hidden md:block"
      style={style}
      aria-hidden="true"
      animate={{ y: [0, -6, 0], rotate: [0, -8, 4, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <rect x="6" y="6" width="28" height="28" rx="3" stroke="#C97A40" strokeWidth="1.2" fill="none" opacity="0.25" />
      {/* Fabric weave pattern */}
      <line x1="10" y1="12" x2="30" y2="12" stroke="#C97A40" strokeWidth="0.6" opacity="0.15" />
      <line x1="10" y1="18" x2="30" y2="18" stroke="#C97A40" strokeWidth="0.6" opacity="0.15" />
      <line x1="10" y1="24" x2="30" y2="24" stroke="#C97A40" strokeWidth="0.6" opacity="0.15" />
      <line x1="10" y1="30" x2="30" y2="30" stroke="#C97A40" strokeWidth="0.6" opacity="0.15" />
      <line x1="14" y1="8" x2="14" y2="32" stroke="#C97A40" strokeWidth="0.6" opacity="0.12" />
      <line x1="22" y1="8" x2="22" y2="32" stroke="#C97A40" strokeWidth="0.6" opacity="0.12" />
      {/* Folded corner */}
      <path d="M30 6 L34 6 L34 10 Z" fill="#C97A40" opacity="0.15" />
    </motion.svg>
  )
}

/* ---------- Stitch border ---------- */

function StitchBorder() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stitch pattern - dashes with cross-stitches */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = i * 30 + 5
          return (
            <g key={`stitch-${i}`}>
              <motion.line
                x1={x}
                y1="10"
                x2={x + 20}
                y2="10"
                stroke="#C97A40"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              />
              {/* Cross-stitch marks */}
              {i % 3 === 0 && (
                <>
                  <line
                    x1={x + 10 - 2}
                    y1="7"
                    x2={x + 10 + 2}
                    y2="13"
                    stroke="#C97A40"
                    strokeWidth="0.8"
                    opacity="0.2"
                  />
                  <line
                    x1={x + 10 + 2}
                    y1="7"
                    x2={x + 10 - 2}
                    y2="13"
                    stroke="#C97A40"
                    strokeWidth="0.8"
                    opacity="0.2"
                  />
                </>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ---------- Trust badge ---------- */

function TrustBadge({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center px-4 md:px-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span
        className="text-xl md:text-2xl font-bold tracking-tight"
        style={{ color: '#C97A40' }}
      >
        {value}
      </span>
      <span
        className="text-xs md:text-sm mt-1 tracking-wide uppercase"
        style={{ color: `${DESIGN_TOKENS.colors.description}99` }}
      >
        {label}
      </span>
    </motion.div>
  )
}

/* ================================================
   Main Hero Component
   ================================================ */

export function Hero({ onNavigate }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [prefersReducedMotion])

  const dur = (v: number) => (prefersReducedMotion ? 0 : v)
  const del = (v: number) => (prefersReducedMotion ? 0 : v)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* -- Full background photo -- */}
      <div className="absolute inset-0">
        <img
          src="/fotos/sofas/sofa-esquinero-beige-ottoman-hogar.jpg"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0EB]/85 via-[#F5F0EB]/75 to-[#F5F0EB]/90" />
      </div>

      {/* -- Warm leather/wood gradient on top -- */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{
          background:
            'linear-gradient(135deg, rgba(139,115,85,0.12) 0%, rgba(201,122,64,0.08) 25%, transparent 50%, rgba(160,100,55,0.10) 75%, rgba(101,67,33,0.12) 100%)',
          transform: prefersReducedMotion
            ? 'none'
            : `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      />

      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,122,64,0.10),transparent_60%)]" />

      {/* Secondary subtle glow bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(139,115,85,0.08),transparent_50%)]" />

      {/* -- Real sofa photo background -- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px)`,
        }}
      >
        <img
          src="/fotos/restauraciones/restauracion-chesterfield-cuero-1.jpg"
          alt=""
          className="absolute bottom-0 right-0 w-[500px] md:w-[700px] lg:w-[850px] opacity-20 object-cover select-none blur-[1px]"
          style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 80%)' }}
          aria-hidden="true"
        />
      </div>

      {/* -- Floating decorative elements -- */}
      {!prefersReducedMotion && (
        <>
          <FloatingScissors style={{ top: '12%', left: '8%' }} />
          <FloatingNeedle style={{ top: '20%', right: '10%' }} delay={1.5} />
          <FloatingFabricSwatch style={{ bottom: '22%', left: '12%' }} delay={2} />
          <FloatingNeedle style={{ bottom: '30%', right: '8%' }} delay={3} />
          <FloatingFabricSwatch style={{ top: '15%', right: '22%' }} delay={0.8} />
          <FloatingScissors style={{ bottom: '18%', right: '18%' }} />
        </>
      )}

      {/* -- Main content -- */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Decorative ornament above title */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: dur(0.5), ease: 'easeOut' }}
          className="flex items-center justify-center gap-3 mb-5"
          aria-hidden="true"
        >
          <span className="block w-8 h-px bg-[#C97A40] opacity-50" />
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-[#C97A40] opacity-60" fill="currentColor">
            <path d="M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z" />
          </svg>
          <span className="block w-8 h-px bg-[#C97A40] opacity-50" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.3), ease: 'easeOut' }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 leading-tight tracking-tight"
            style={{ color: DESIGN_TOKENS.colors.title }}
          >
            El Arte de Tapizar,{' '}
            <span className="italic" style={{ color: '#8B6D4B' }}>
              una Tradición Familiar
            </span>
          </h1>
        </motion.div>

        {/* Needle & thread divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur(0.4), delay: del(0.2) }}
        >
          <NeedleThreadDivider />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.3), delay: del(0.1), ease: 'easeOut' }}
          className="text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          style={{
            color: DESIGN_TOKENS.colors.description,
            fontSize: DESIGN_TOKENS.typography.description.maxSize,
            lineHeight: DESIGN_TOKENS.typography.lineHeight,
          }}
        >
          Desde 1990, tres generaciones de la familia Calistro transforman telas y
          espumas en piezas que cuentan historias. Retapizados, restauraciones y
          creaciones a medida en Montevideo.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.3), delay: del(0.2), ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => onNavigate('gallery')}
            className="group text-base px-8 py-6"
            aria-label="Ver galería de trabajos realizados"
          >
            Ver Trabajos
            <ArrowRight
              size={20}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate('contact')}
            className="text-base px-8 py-6 bg-card/80 backdrop-blur-sm"
            aria-label="Solicitar presupuesto personalizado"
          >
            Solicitar Presupuesto
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.4), delay: del(0.4), ease: 'easeOut' }}
          className="mt-10 mb-16 flex items-center justify-center divide-x divide-[#C97A4033]"
        >
          <TrustBadge value="30+" label="Años" />
          <TrustBadge value="1000+" label="Muebles" />
          <TrustBadge value="100%" label="Artesanal" />
        </motion.div>
      </div>

      {/* -- Scroll indicator -- */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2"
          style={{ borderColor: `${DESIGN_TOKENS.colors.description}50` }}
          aria-label="Desplazar hacia abajo"
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: `${DESIGN_TOKENS.colors.description}50` }}
          />
        </div>
      </motion.div>

      {/* -- Animated stitch border at bottom -- */}
      <StitchBorder />
    </section>
  )
}
