import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface CountUpProps {
  to: number
  duration?: number
  /** Delay before the count starts (seconds). */
  delay?: number
  separator?: string
  prefix?: string
  suffix?: string
  className?: string
}

function format(n: number, separator?: string) {
  const s = Math.round(n).toString()
  if (!separator) return s
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

// Animated number that counts up from 0 to `to` shortly after it mounts. Used
// for hero stats ("50.000+ muebles"). Respects reduced motion.
export function CountUp({
  to,
  duration = 1.8,
  delay = 0.3,
  separator,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)

  useEffect(() => {
    if (reduce) {
      setVal(to)
      return
    }
    let raf = 0
    const startTimer = setTimeout(() => {
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000))
        const eased = 1 - Math.pow(1 - t, 3)
        setVal(to * eased)
        if (t < 1) raf = requestAnimationFrame(step)
        else setVal(to)
      }
      raf = requestAnimationFrame(step)
    }, delay * 1000)

    return () => {
      clearTimeout(startTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [to, duration, delay, reduce])

  return (
    <span className={className}>
      {prefix}
      {format(val, separator)}
      {suffix}
    </span>
  )
}
