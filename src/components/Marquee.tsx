/* Cinta tipográfica editorial: los oficios de la casa desfilando en serif,
   alternando palabras llenas y en contorno. Transición entre la franja oscura
   de fotos y las secciones claras. */

const WORDS = [
  'Retapizado',
  'Restauración',
  'A medida',
  'Capitoné',
  'Cuero',
  'Pana',
  'Lino',
  'Desde 1975',
]

export function Marquee() {
  // Doble copia para el loop infinito sin costura.
  const items = [...WORDS, ...WORDS]

  return (
    <section
      className="relative py-8 md:py-10 bg-[#F5F0EB] overflow-hidden border-y border-[#6B4423]/10 select-none"
      aria-hidden="true"
    >
      <div className="marquee-track items-baseline gap-10 md:gap-16 px-5">
        {items.map((word, i) => (
          <span key={i} className="flex items-baseline gap-10 md:gap-16 shrink-0">
            <span
              className={`text-4xl md:text-6xl font-bold whitespace-nowrap italic ${
                i % 2 === 0 ? 'text-[#6B4423]/25' : 'text-outline-warm'
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {word}
            </span>
            <span className="text-[var(--brand-accent)]/50 text-2xl md:text-3xl" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}
