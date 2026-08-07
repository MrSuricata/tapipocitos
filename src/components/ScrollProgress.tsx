import { motion, useScroll, useSpring } from 'framer-motion'

// Thin gradient progress bar pinned to the very top, tracking scroll depth.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--brand-accent) 0%, #8B6914 50%, #6B4423 100%)',
      }}
      aria-hidden="true"
    />
  )
}
