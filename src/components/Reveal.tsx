import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealVariant = 'up' | 'scale' | 'blur' | 'left' | 'right'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in seconds before the reveal starts. */
  delay?: number
  /** Vertical offset (px) for the 'up'/'blur' variants. */
  y?: number
  /** Only animate the first time it enters the viewport. */
  once?: boolean
  /** Animation style. */
  variant?: RevealVariant
}

// Apple-style ease-out expo.
const APPLE_EASE = [0.16, 1, 0.3, 1] as const

function hiddenState(variant: RevealVariant, y: number) {
  switch (variant) {
    case 'scale':
      return { opacity: 0, scale: 0.94 }
    case 'blur':
      return { opacity: 0, y: y * 0.6, filter: 'blur(10px)' }
    case 'left':
      return { opacity: 0, x: -36 }
    case 'right':
      return { opacity: 0, x: 36 }
    default:
      return { opacity: 0, y }
  }
}

function shownState(variant: RevealVariant) {
  switch (variant) {
    case 'scale':
      return { opacity: 1, scale: 1 }
    case 'blur':
      return { opacity: 1, y: 0, filter: 'blur(0px)' }
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 }
    default:
      return { opacity: 1, y: 0 }
  }
}

// Scroll-reveal wrapper for NEW UI and section polish. Existing sections keep
// their own framer-motion animations; do not wrap those or they double-trigger.
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  variant = 'up',
}: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={hiddenState(variant, y)}
      whileInView={shownState(variant)}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: APPLE_EASE }}
    >
      {children}
    </motion.div>
  )
}
