import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in seconds before the reveal animation starts. */
  delay?: number
  /** Vertical offset (px) the element travels from. */
  y?: number
  /** Only animate the first time it enters the viewport. */
  once?: boolean
}

// Lightweight scroll-reveal wrapper for NEW UI. Existing sections keep their own
// framer-motion animations; do not wrap those or they will double-trigger.
export function Reveal({ children, className, delay = 0, y = 24, once = true }: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
