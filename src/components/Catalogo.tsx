import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, WhatsappLogo } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import { CATALOGO, type CatalogoTrabajo } from '@/lib/catalogo'

/* ──────────────────────────────────────────────────────────────
   Catálogo de trabajos en formato revista.
   Escritorio: doble página con vuelta de hoja 3D sobre el lomo.
   Celular: una página por vez, se desliza con el dedo.
   ────────────────────────────────────────────────────────────── */

const WA = 'https://wa.me/59899251310?text='
// Solo se suman los trabajos cargados desde el admin a partir de esta fecha:
// los anteriores son contenido de ejemplo (títulos que no coinciden con la foto).
const DESDE = '2026-11-10'
const PAPER = '#FBF8F3'
const INK = '#2C1810'
const ESPRESSO = '#1A0F08'
const ACCENT = 'var(--brand-accent, #C97A40)'
const FLIP_MS = 900
const EASE = [0.645, 0.045, 0.355, 1] as const

type Page =
  | { kind: 'cover' }
  | { kind: 'intro' }
  | { kind: 'index' }
  | { kind: 'photo'; t: CatalogoTrabajo; n: number }
  | { kind: 'text'; t: CatalogoTrabajo; n: number }
  | { kind: 'cta' }
  | { kind: 'back' }

interface CatalogoProps {
  onNavigate: (view: string, data?: any) => void
}

function useIsDesktop() {
  const q = '(min-width: 900px)'
  const [v, setV] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : true))
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setV(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return v
}

export function Catalogo({ onNavigate }: CatalogoProps) {
  const { projects } = useStore()
  const reduce = useReducedMotion()
  const desktop = useIsDesktop()

  // Trabajos curados + los que se carguen desde el admin (con fotos).
  const trabajos = useMemo<CatalogoTrabajo[]>(() => {
    const extra = projects
      .filter((p) => !p.id.startsWith('demo') && p.images?.length && (p.created_at ?? '') >= DESDE)
      .map((p) => ({
        id: p.id,
        titulo: p.title,
        categoria: p.category,
        texto: p.description,
        detalles: [
          ...(p.materials?.length ? [{ label: 'Materiales', valor: p.materials.join(', ') }] : []),
          ...(p.completed_date ? [{ label: 'Fecha', valor: p.completed_date }] : []),
        ],
        fotos: p.images.map((src) => ({ src, alt: p.title })),
      }))
    return [...CATALOGO, ...extra]
  }, [projects])

  const pages = useMemo<Page[]>(() => {
    const list: Page[] = [{ kind: 'cover' }, { kind: 'intro' }, { kind: 'index' }]
    trabajos.forEach((t, i) => {
      list.push({ kind: 'photo', t, n: i + 1 }, { kind: 'text', t, n: i + 1 })
    })
    list.push({ kind: 'cta' }, { kind: 'back' })
    return list
  }, [trabajos])

  // Número de página impresa de cada trabajo (para el índice).
  const folioOf = useCallback(
    (id: string) => pages.findIndex((p) => p.kind === 'photo' && p.t.id === id),
    [pages],
  )

  // Foto elegida en cada trabajo (las miniaturas cambian la foto de la página).
  const [sel, setSel] = useState<Record<string, number>>({})
  const pick = (id: string, i: number) => setSel((s) => ({ ...s, [id]: i }))

  // ── Escritorio: pliegos ───────────────────────────────────
  const spreads = useMemo(() => {
    const s: [Page | null, Page | null][] = [[null, pages[0]]]
    for (let i = 1; i < pages.length; i += 2) s.push([pages[i] ?? null, pages[i + 1] ?? null])
    return s
  }, [pages])

  const [spread, setSpread] = useState(0)
  const [flip, setFlip] = useState<0 | 1 | -1>(0)
  const [page, setPage] = useState(0) // celular
  const [dir, setDir] = useState(1)

  const lastSpread = spreads.length - 1
  const lastPage = pages.length - 1

  const next = useCallback(() => {
    if (desktop) {
      if (flip || spread >= lastSpread) return
      if (reduce) return setSpread((s) => s + 1)
      setFlip(1)
    } else if (page < lastPage) {
      setDir(1)
      setPage((p) => p + 1)
    }
  }, [desktop, flip, spread, lastSpread, reduce, page, lastPage])

  const prev = useCallback(() => {
    if (desktop) {
      if (flip || spread <= 0) return
      if (reduce) return setSpread((s) => s - 1)
      setFlip(-1)
    } else if (page > 0) {
      setDir(-1)
      setPage((p) => p - 1)
    }
  }, [desktop, flip, spread, reduce, page])

  const goToPage = (pi: number) => {
    if (desktop) {
      setFlip(0)
      setSpread(pi === 0 ? 0 : Math.floor((pi - 1) / 2) + 1)
    } else {
      setDir(pi > page ? 1 : -1)
      setPage(pi)
    }
  }

  // Mantener la posición al rotar el celular / cambiar de ancho.
  const prevDesktop = useRef(desktop)
  useEffect(() => {
    if (prevDesktop.current === desktop) return
    prevDesktop.current = desktop
    if (desktop) setSpread(page === 0 ? 0 : Math.floor((page - 1) / 2) + 1)
    else setPage(spread === 0 ? 0 : spread * 2 - 1)
    setFlip(0)
  }, [desktop, page, spread])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const endFlip = () => {
    setSpread((s) => s + flip)
    setFlip(0)
  }

  const render = (p: Page | null, side: 'left' | 'right' | 'single') =>
    p ? (
      <PageView
        key={pages.indexOf(p)}
        page={p}
        side={side}
        folio={pages.indexOf(p)}
        sel={sel}
        pick={pick}
        trabajos={trabajos}
        folioOf={folioOf}
        goToPage={goToPage}
        onNavigate={onNavigate}
      />
    ) : null

  // Indicador de páginas
  const label = desktop
    ? spread === 0
      ? 'Tapa'
      : `Páginas ${spread * 2 - 1}–${Math.min(spread * 2, lastPage)} de ${lastPage}`
    : page === 0
      ? 'Tapa'
      : `Página ${page} de ${lastPage}`
  const progress = desktop ? spread / lastSpread : page / lastPage
  const atStart = desktop ? spread === 0 : page === 0
  const atEnd = desktop ? spread === lastSpread : page === lastPage

  const cur = spreads[spread]
  const target = flip ? spreads[spread + flip] : null

  return (
    <section className="relative overflow-hidden pb-20 pt-10 md:pt-8" style={{ background: '#F2ECE4' }}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <header className="mx-auto mb-8 max-w-2xl text-center md:mb-8">
          <p className="text-[11px] uppercase tracking-[0.32em]" style={{ color: ACCENT }}>
            Catálogo · Edición 2026
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl" style={{ color: INK }}>
            Trabajos <em className="font-serif italic" style={{ color: ACCENT }}>hechos en el taller</em>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: 'rgba(44,24,16,0.65)' }}>
            {desktop ? 'Pasá las páginas con las flechas o tocando el borde de la hoja.' : 'Deslizá para pasar las páginas.'}
          </p>
        </header>

        {desktop ? (
          <div className="mx-auto w-full" style={{ perspective: 2600, maxWidth: 'min(1120px, max(640px, calc((100svh - 300px) * 1.5)))' }}>
            <div className="relative aspect-[3/2] w-full" style={{ transformStyle: 'preserve-3d' }}>
              {/* sombra de apoyo */}
              <div
                className="pointer-events-none absolute -bottom-6 left-[6%] right-[6%] h-10 rounded-[50%] blur-2xl"
                style={{ background: 'rgba(44,24,16,0.28)' }}
              />
              {/* base izquierda */}
              <div className="absolute inset-y-0 left-0 w-1/2">
                {render(flip === -1 ? target![0] : cur[0], 'left')}
              </div>
              {/* base derecha */}
              <div className="absolute inset-y-0 right-0 w-1/2">
                {render(flip === 1 ? target![1] : cur[1], 'right')}
              </div>
              {/* lomo */}
              {Boolean(cur[0] || (flip && target?.[0])) && (
                <div
                  className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-16 -translate-x-1/2"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(44,24,16,0.10) 42%, rgba(44,24,16,0.22) 50%, rgba(44,24,16,0.10) 58%, transparent 100%)',
                  }}
                />
              )}

              {/* hoja que gira */}
              {flip !== 0 && target && (
                <motion.div
                  key={`leaf-${spread}-${flip}`}
                  className="absolute inset-y-0 z-30 w-1/2"
                  style={{
                    left: flip === 1 ? '50%' : 0,
                    transformOrigin: flip === 1 ? 'left center' : 'right center',
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: flip === 1 ? -180 : 180 }}
                  transition={{ duration: FLIP_MS / 1000, ease: EASE }}
                  onAnimationComplete={endFlip}
                >
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                    {render(flip === 1 ? cur[1] : cur[0], flip === 1 ? 'right' : 'left')}
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.35, 0] }}
                      transition={{ duration: FLIP_MS / 1000, ease: 'easeInOut' }}
                      style={{
                        background:
                          flip === 1
                            ? 'linear-gradient(90deg, rgba(0,0,0,0.25), transparent 60%)'
                            : 'linear-gradient(270deg, rgba(0,0,0,0.25), transparent 60%)',
                      }}
                    />
                  </div>
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    {render(flip === 1 ? target[0] : target[1], flip === 1 ? 'left' : 'right')}
                  </div>
                </motion.div>
              )}

              {/* zonas para dar vuelta tocando el borde */}
              {!atStart && (
                <button
                  aria-label="Página anterior"
                  onClick={prev}
                  className="absolute inset-y-0 left-0 z-40 w-[9%] cursor-w-resize"
                />
              )}
              {!atEnd && (
                <button
                  aria-label="Página siguiente"
                  onClick={next}
                  className="absolute inset-y-0 right-0 z-40 w-[9%] cursor-e-resize"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="relative aspect-[5/8] w-full overflow-hidden rounded-[2px] shadow-[0_24px_50px_-20px_rgba(44,24,16,0.45)]">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={page}
                  custom={dir}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { x: dir > 0 ? '100%' : '-100%', opacity: 0.6 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { x: dir > 0 ? '-30%' : '30%', opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) next()
                    else if (info.offset.x > 60) prev()
                  }}
                >
                  {render(pages[page], 'single')}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* controles */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-between gap-4 pr-[76px] md:pr-0">
          <NavBtn onClick={prev} disabled={atStart} label="Anterior">
            <ArrowLeft size={18} />
          </NavBtn>
          <div className="flex-1 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: 'rgba(44,24,16,0.6)' }}>
              {label}
            </p>
            <div className="mx-auto mt-3 h-px w-full max-w-[220px]" style={{ background: 'rgba(44,24,16,0.15)' }}>
              <motion.div
                className="h-px"
                style={{ background: ACCENT }}
                animate={{ width: `${Math.max(4, progress * 100)}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>
          </div>
          <NavBtn onClick={next} disabled={atEnd} label="Siguiente">
            <ArrowRight size={18} />
          </NavBtn>
        </div>
      </div>
    </section>
  )
}

function NavBtn({ onClick, disabled, label, children }: { onClick: () => void; disabled: boolean; label: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-25"
      style={{ borderColor: 'rgba(44,24,16,0.2)', color: INK, background: 'rgba(255,255,255,0.5)' }}
    >
      {children}
    </button>
  )
}

/* ─────────────── Páginas ─────────────── */

interface PageViewProps {
  page: Page
  side: 'left' | 'right' | 'single'
  folio: number
  sel: Record<string, number>
  pick: (id: string, i: number) => void
  trabajos: CatalogoTrabajo[]
  folioOf: (id: string) => number
  goToPage: (pi: number) => void
  onNavigate: (view: string, data?: any) => void
}

function Sheet({ side, dark, children }: { side: PageViewProps['side']; dark?: boolean; children: ReactNode }) {
  // sombreado del lado del lomo + borde suave de papel
  const spine =
    side === 'left'
      ? 'linear-gradient(270deg, rgba(44,24,16,0.10) 0%, transparent 9%)'
      : side === 'right'
        ? 'linear-gradient(90deg, rgba(44,24,16,0.10) 0%, transparent 9%)'
        : 'none'
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: dark ? ESPRESSO : PAPER,
        containerType: 'inline-size',
        boxShadow:
          side === 'single'
            ? 'none'
            : side === 'left'
              ? 'inset -1px 0 0 rgba(44,24,16,0.06), -10px 18px 40px -22px rgba(44,24,16,0.5)'
              : 'inset 1px 0 0 rgba(44,24,16,0.06), 10px 18px 40px -22px rgba(44,24,16,0.5)',
      }}
    >
      {children}
      <div className="pointer-events-none absolute inset-0" style={{ background: spine }} />
    </div>
  )
}

function Folio({ n, side, dark }: { n: number; side: PageViewProps['side']; dark?: boolean }) {
  return (
    <div
      className={`absolute bottom-[4.5cqw] flex w-full px-[7cqw] text-[max(9px,1.9cqw)] uppercase tracking-[0.22em] ${
        side === 'left' ? 'justify-start' : side === 'right' ? 'justify-end' : 'justify-between'
      }`}
      style={{ color: dark ? 'rgba(245,237,226,0.5)' : 'rgba(44,24,16,0.4)' }}
    >
      {side === 'single' && <span>Tapipocitos</span>}
      <span>{String(n).padStart(2, '0')}</span>
    </div>
  )
}

function PageView(props: PageViewProps) {
  const { page, side, folio } = props
  switch (page.kind) {
    case 'cover':
      return (
        <Sheet side={side} dark>
          <img
            src="/fotos/trabajos/chesterfield-bordo-diagonal.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,15,8,0.55) 0%, rgba(26,15,8,0.2) 40%, rgba(26,15,8,0.9) 100%)' }} />
          <div className="absolute inset-[4.5cqw] border" style={{ borderColor: 'rgba(245,237,226,0.25)' }} />
          <div className="relative flex h-full flex-col justify-between p-[11cqw]" style={{ color: '#F5EDE2' }}>
            <p className="text-[max(9px,2.3cqw)] font-medium tracking-[0.42em]">TAPIPOCITOS</p>
            <div>
              <p className="text-[max(9px,2.1cqw)] uppercase tracking-[0.3em]" style={{ color: '#E8B380' }}>
                Edición 2026
              </p>
              <h2 className="mt-[3cqw] font-serif leading-[0.92] tracking-tight" style={{ fontSize: '17cqw' }}>
                Catálogo
              </h2>
              <p className="font-serif italic" style={{ fontSize: '8cqw', color: '#E8B380' }}>
                de trabajos
              </p>
              <div className="my-[5cqw] h-px w-[12cqw]" style={{ background: '#C97A40' }} />
              <p className="max-w-[70cqw] text-[max(11px,2.8cqw)] font-light leading-relaxed" style={{ color: 'rgba(245,237,226,0.8)' }}>
                Tapicería a mano en Pocitos, Montevideo. Desde 1975.
              </p>
            </div>
          </div>
        </Sheet>
      )

    case 'intro':
      return (
        <Sheet side={side}>
          <div className="flex h-full flex-col justify-center px-[13cqw]" style={{ color: INK }}>
            <p className="text-[max(9px,2.1cqw)] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
              Bienvenidos
            </p>
            <p className="mt-[6cqw] font-serif leading-[1.25]" style={{ fontSize: '6.2cqw' }}>
              Cada pieza de estas páginas pasó por nuestras manos, <em style={{ color: ACCENT }}>botón por botón.</em>
            </p>
            <p className="mt-[6cqw] text-[max(11px,2.9cqw)] leading-[1.75]" style={{ color: 'rgba(44,24,16,0.68)' }}>
              Restauramos lo que tiene historia y hacemos a medida lo que todavía no existe. Sofás, sillones,
              almohadones y proyectos especiales: todo sale del mismo taller familiar.
            </p>
            <p className="mt-[8cqw] font-serif italic" style={{ fontSize: '4cqw', color: 'rgba(44,24,16,0.55)' }}>
              — La familia Tapipocitos
            </p>
          </div>
          <Folio n={folio} side={side} />
        </Sheet>
      )

    case 'index':
      return (
        <Sheet side={side}>
          <div className="flex h-full flex-col px-[11cqw] pt-[13cqw]" style={{ color: INK }}>
            <p className="text-[max(9px,2.1cqw)] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
              Contenido
            </p>
            <ol className="mt-[6cqw] flex flex-col">
              {props.trabajos.map((t, i) => {
                const pi = props.folioOf(t.id)
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => props.goToPage(pi)}
                      className="group relative z-50 flex w-full items-baseline gap-[3cqw] border-b py-[2.6cqw] text-left"
                      style={{ borderColor: 'rgba(44,24,16,0.1)' }}
                    >
                      <span className="font-serif italic" style={{ fontSize: '3.4cqw', color: ACCENT, minWidth: '5cqw' }}>
                        {i + 1}
                      </span>
                      <span className="flex-1 font-serif transition-colors group-hover:text-[color:var(--brand-accent)]" style={{ fontSize: '4.3cqw' }}>
                        {t.titulo} {t.tituloItalica && <em>{t.tituloItalica}</em>}
                      </span>
                      <span className="text-[max(9px,2.2cqw)] tabular-nums tracking-wider" style={{ color: 'rgba(44,24,16,0.45)' }}>
                        {String(pi).padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
          <Folio n={folio} side={side} />
        </Sheet>
      )

    case 'photo': {
      const { t } = page
      const i = Math.min(props.sel[t.id] ?? 0, t.fotos.length - 1)
      const f = t.fotos[i]
      return (
        <Sheet side={side}>
          <div className="absolute inset-[5cqw] bottom-[13cqw] overflow-hidden" style={{ background: '#E9E0D4' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={f.src}
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className="h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </AnimatePresence>
          </div>
          <p
            className="absolute bottom-[5.5cqw] left-[5cqw] right-[14cqw] truncate font-serif italic"
            style={{ fontSize: 'max(11px, 2.6cqw)', color: 'rgba(44,24,16,0.6)' }}
          >
            {f.alt}
          </p>
          {side !== 'single' && <Folio n={folio} side={side} />}
          {side === 'single' && (
            <div className="absolute bottom-[5.5cqw] right-[5cqw] text-[max(9px,1.9cqw)] tracking-[0.22em]" style={{ color: 'rgba(44,24,16,0.4)' }}>
              {String(folio).padStart(2, '0')}
            </div>
          )}
        </Sheet>
      )
    }

    case 'text': {
      const { t, n } = page
      const cur = props.sel[t.id] ?? 0
      const msg = encodeURIComponent(`Hola TAPIPOCITOS! Vi en el catálogo el trabajo "${t.titulo}${t.tituloItalica ? ' ' + t.tituloItalica : ''}" y quiero consultar por algo así.`)
      return (
        <Sheet side={side}>
          <div className="flex h-full flex-col px-[10cqw] pb-[14cqw] pt-[11cqw]" style={{ color: INK }}>
            <div className="flex items-baseline gap-[3cqw]">
              <span className="font-serif italic" style={{ fontSize: '9cqw', color: ACCENT, lineHeight: 1 }}>
                {String(n).padStart(2, '0')}
              </span>
              <span className="text-[max(9px,2.1cqw)] uppercase tracking-[0.3em]" style={{ color: 'rgba(44,24,16,0.55)' }}>
                {t.categoria}
              </span>
            </div>
            <h3 className="mt-[5cqw] font-serif leading-[1.02] tracking-tight" style={{ fontSize: '9.5cqw' }}>
              {t.titulo}
              {t.tituloItalica && (
                <>
                  <br />
                  <em style={{ color: ACCENT }}>{t.tituloItalica}</em>
                </>
              )}
            </h3>
            <div className="my-[5cqw] h-px w-[10cqw]" style={{ background: ACCENT }} />
            <p className="text-[max(12px,3cqw)] leading-[1.7]" style={{ color: 'rgba(44,24,16,0.72)' }}>
              {t.texto}
            </p>

            {t.detalles.length > 0 && (
              <dl className="mt-[6cqw] grid grid-cols-1 border-t" style={{ borderColor: 'rgba(44,24,16,0.12)' }}>
                {t.detalles.map((d) => (
                  <div key={d.label} className="flex items-baseline justify-between gap-4 border-b py-[1.9cqw]" style={{ borderColor: 'rgba(44,24,16,0.08)' }}>
                    <dt className="text-[max(9px,2cqw)] uppercase tracking-[0.22em]" style={{ color: 'rgba(44,24,16,0.5)' }}>
                      {d.label}
                    </dt>
                    <dd className="text-right font-serif" style={{ fontSize: 'max(12px,3cqw)' }}>
                      {d.valor}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-auto flex items-end justify-between gap-[3cqw] pt-[5cqw]">
              {t.fotos.length > 1 && (
                <div className="relative z-50 flex gap-[2cqw]">
                  {t.fotos.map((f, i) => (
                    <button
                      key={f.src}
                      onClick={() => props.pick(t.id, i)}
                      aria-label={`Ver foto: ${f.alt}`}
                      className="relative overflow-hidden transition-all duration-300"
                      style={{
                        width: '10cqw',
                        height: '13cqw',
                        outline: i === cur ? `1.5px solid ${ACCENT}` : '1px solid rgba(44,24,16,0.12)',
                        outlineOffset: 2,
                        opacity: i === cur ? 1 : 0.62,
                      }}
                    >
                      <img src={f.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <a
                href={WA + msg}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-50 ml-auto inline-flex items-center gap-2 whitespace-nowrap border-b pb-1 text-[max(10px,2.2cqw)] uppercase tracking-[0.2em] transition-colors hover:text-[color:var(--brand-accent)]"
                style={{ borderColor: 'rgba(44,24,16,0.3)' }}
              >
                Consultar <ArrowRight size={12} />
              </a>
            </div>
          </div>
          <Folio n={folio} side={side} />
        </Sheet>
      )
    }

    case 'cta':
      return (
        <Sheet side={side}>
          <div className="flex h-full flex-col justify-center px-[12cqw]" style={{ color: INK }}>
            <p className="text-[max(9px,2.1cqw)] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
              El próximo puede ser el tuyo
            </p>
            <h3 className="mt-[5cqw] font-serif leading-[1.04] tracking-tight" style={{ fontSize: '10cqw' }}>
              ¿Tenés uno <em style={{ color: ACCENT }}>para recuperar?</em>
            </h3>
            <p className="mt-[5cqw] text-[max(12px,3cqw)] leading-[1.7]" style={{ color: 'rgba(44,24,16,0.7)' }}>
              Mandanos una foto y las medidas aproximadas. Te respondemos con un presupuesto sin cargo.
            </p>
            <div className="relative z-50 mt-[8cqw] flex flex-col items-start gap-[3cqw]">
              <a
                href={WA + encodeURIComponent('Hola TAPIPOCITOS! Vi el catálogo y quiero pedir un presupuesto.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full px-[6cqw] py-[3cqw] text-[max(11px,2.4cqw)] font-medium uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
                style={{ background: INK, color: '#F5EDE2' }}
              >
                <WhatsappLogo size={16} weight="fill" /> Escribinos
              </a>
              <button
                onClick={() => props.onNavigate('contact')}
                className="border-b pb-1 text-[max(10px,2.2cqw)] uppercase tracking-[0.2em] transition-colors hover:text-[color:var(--brand-accent)]"
                style={{ borderColor: 'rgba(44,24,16,0.3)' }}
              >
                O pedí presupuesto por formulario
              </button>
            </div>
          </div>
          <Folio n={folio} side={side} />
        </Sheet>
      )

    case 'back':
      return (
        <Sheet side={side} dark>
          <div className="absolute inset-[4.5cqw] border" style={{ borderColor: 'rgba(245,237,226,0.18)' }} />
          <div className="flex h-full flex-col items-center justify-center text-center" style={{ color: '#F5EDE2' }}>
            <svg viewBox="0 0 40 32" fill="none" style={{ width: '14cqw', height: 'auto' }} aria-hidden="true">
              <path d="M4 22V18C4 14 6 12 10 12H30C34 12 36 14 36 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 22C2 20 3 19 5 19H35C37 19 38 20 38 22V24C38 25 37 26 36 26H4C3 26 2 25 2 24V22Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 26V29M32 26V29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="mt-[5cqw] text-[max(10px,2.6cqw)] font-medium tracking-[0.42em]">TAPIPOCITOS</p>
            <p className="mt-[3cqw] font-serif italic" style={{ fontSize: '4cqw', color: '#E8B380' }}>
              Gracias por pasar las páginas
            </p>
            <p className="mt-[10cqw] text-[max(9px,2cqw)] uppercase tracking-[0.26em]" style={{ color: 'rgba(245,237,226,0.55)' }}>
              Pocitos · Montevideo · @tapipocitos
            </p>
          </div>
        </Sheet>
      )
  }
}
