import { cn } from '@/lib/utils'

interface BackgroundDecorProps {
  className?: string
  /** Colour theme for the orbs. */
  variant?: 'warm' | 'sand'
}

// Rich, warm section background: a diagonal gradient wash + a visible fabric
// weave texture + soft glowing orbs. Fills otherwise-empty section backgrounds
// with depth and warmth. Purely decorative; sits behind z-10 content.
export function BackgroundDecor({ className, variant = 'warm' }: BackgroundDecorProps) {
  const orbs =
    variant === 'sand'
      ? [
          { c: 'rgba(196,148,74,0.42)', w: 480, h: 480, pos: { top: '-10%', left: '-6%' }, cls: 'orb-1' },
          { c: 'rgba(160,118,75,0.34)', w: 400, h: 400, pos: { top: '18%', right: '-8%' }, cls: 'orb-2' },
          { c: 'rgba(139,105,20,0.30)', w: 540, h: 540, pos: { bottom: '-18%', left: '30%' }, cls: 'orb-3' },
          { c: 'rgba(201,122,64,0.20)', w: 320, h: 320, pos: { top: '48%', left: '40%' }, cls: 'orb-2' },
        ]
      : [
          { c: 'rgba(201,122,64,0.46)', w: 500, h: 500, pos: { top: '-8%', left: '-8%' }, cls: 'orb-1' },
          { c: 'rgba(139,105,20,0.34)', w: 420, h: 420, pos: { top: '15%', right: '-8%' }, cls: 'orb-2' },
          { c: 'rgba(107,68,35,0.32)', w: 540, h: 540, pos: { bottom: '-16%', left: '26%' }, cls: 'orb-3' },
          { c: 'rgba(201,122,64,0.24)', w: 340, h: 340, pos: { top: '45%', left: '38%' }, cls: 'orb-2' },
        ]

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      {/* Warm diagonal gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(155deg, rgba(201,122,64,0.14) 0%, transparent 40%, rgba(139,105,20,0.08) 68%, rgba(107,68,35,0.16) 100%)',
        }}
      />
      {/* Fabric weave texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(122,75,45,0.07) 0px, rgba(122,75,45,0.07) 1px, transparent 1px, transparent 13px), repeating-linear-gradient(-45deg, rgba(122,75,45,0.07) 0px, rgba(122,75,45,0.07) 1px, transparent 1px, transparent 13px)',
        }}
      />
      {/* Glowing orbs */}
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
