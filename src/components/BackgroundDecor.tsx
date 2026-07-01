import { cn } from '@/lib/utils'

interface BackgroundDecorProps {
  className?: string
  /** Colour theme for the orbs. */
  variant?: 'warm' | 'sand'
}

// Soft, slowly-drifting gradient orbs that fill otherwise-empty section
// backgrounds with warm depth. Purely decorative; sits behind z-10 content.
export function BackgroundDecor({ className, variant = 'warm' }: BackgroundDecorProps) {
  const orbs =
    variant === 'sand'
      ? [
          { c: 'rgba(196,148,74,0.26)', w: 420, h: 420, pos: { top: '-8%', left: '-6%' }, cls: 'orb-1' },
          { c: 'rgba(160,118,75,0.20)', w: 380, h: 380, pos: { top: '25%', right: '-10%' }, cls: 'orb-2' },
          { c: 'rgba(139,105,20,0.16)', w: 460, h: 460, pos: { bottom: '-14%', left: '28%' }, cls: 'orb-3' },
        ]
      : [
          { c: 'rgba(201,122,64,0.30)', w: 430, h: 430, pos: { top: '-6%', left: '-8%' }, cls: 'orb-1' },
          { c: 'rgba(139,105,20,0.22)', w: 380, h: 380, pos: { top: '22%', right: '-10%' }, cls: 'orb-2' },
          { c: 'rgba(107,68,35,0.20)', w: 470, h: 470, pos: { bottom: '-12%', left: '26%' }, cls: 'orb-3' },
        ]

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className={`bg-orb ${o.cls}`}
          style={{
            width: o.w,
            height: o.h,
            background: `radial-gradient(circle, ${o.c}, transparent 70%)`,
            ...o.pos,
          }}
        />
      ))}
    </div>
  )
}
