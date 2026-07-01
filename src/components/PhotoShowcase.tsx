import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from '@phosphor-icons/react'

const SHOWCASE_PHOTOS = [
  { src: '/fotos/sofas/sofa-esquinero-beige-ottoman-hogar.jpg', alt: 'Sofa esquinero beige en hogar' },
  { src: '/fotos/restauraciones/restauracion-chesterfield-cuero-1.jpg', alt: 'Restauracion Chesterfield en proceso' },
  { src: '/fotos/sofas/sofa-clasico-beige-brazos-curvos.jpg', alt: 'Sofa clasico beige' },
  { src: '/fotos/sofas/sofa-dos-cuerpos-mostaza.jpg', alt: 'Sofa dos cuerpos mostaza' },
  { src: '/fotos/sofas/sofa-esquinero-gris-hogar-living.jpg', alt: 'Sofa esquinero gris en living' },
  { src: '/fotos/sofas/sofa-esquinero-oscuro-almohadones-etnicos.jpg', alt: 'Sofa esquinero con almohadones' },
  { src: '/fotos/restauraciones/restauracion-chesterfield-cuero-2.jpg', alt: 'Chesterfield en taller' },
  { src: '/fotos/sofas/sofa-beige-vivo-contrastante-naranja.jpg', alt: 'Sofa beige con vivo naranja' },
]

const TILE_GRADIENTS = [
  'linear-gradient(135deg, #8B6914 0%, #A0764B 55%, #6B4423 100%)',
  'linear-gradient(135deg, #7A4B3A 0%, #9C6B59 55%, #5A3526 100%)',
  'linear-gradient(135deg, #5B7B8A 0%, #6D929F 55%, #3E5F6B 100%)',
  'linear-gradient(135deg, #8A6E2F 0%, #B89444 55%, #6E5624 100%)',
]

function SofaMini() {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-2/5 h-auto opacity-40" aria-hidden="true">
      <path
        d="M20 90 Q20 50 40 45 L45 40 Q50 35 60 35 L140 35 Q150 35 155 40 L160 45 Q180 50 180 90"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M35 90 L35 70 Q35 55 55 52 L145 52 Q165 55 165 70 L165 90"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2"
        fill="none"
      />
      <line x1="20" y1="90" x2="180" y2="90" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <rect x="30" y="90" width="8" height="10" rx="2" fill="rgba(255,255,255,0.6)" />
      <rect x="162" y="90" width="8" height="10" rx="2" fill="rgba(255,255,255,0.6)" />
    </svg>
  )
}

interface Photo {
  src: string
  alt: string
}

function PhotoTile({
  photo,
  index,
  onOpen,
}: {
  photo: Photo
  index: number
  onOpen: (p: Photo) => void
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className="flex-shrink-0 w-56 h-40 md:w-72 md:h-48 rounded-lg overflow-hidden group cursor-pointer"
      onClick={() => !failed && onOpen(photo)}
    >
      {failed ? (
        <div
          className="w-full h-full flex items-center justify-center relative"
          style={{ background: TILE_GRADIENTS[index % TILE_GRADIENTS.length] }}
          aria-label={photo.alt}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)',
            }}
          />
          <SofaMini />
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
      )}
    </div>
  )
}

export function PhotoShowcase() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    if (!selectedPhoto) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [selectedPhoto])

  return (
    <section className="py-8 overflow-hidden bg-[#2C1810]" aria-label="Trabajos recientes">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm uppercase tracking-[0.25em] text-[#C4A882] mb-6 font-medium"
      >
        Algunos de nuestros trabajos
      </motion.p>

      {/* Scrolling photo strip */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#2C1810] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#2C1810] to-transparent z-10 pointer-events-none" />

        {/* Auto-scrolling strip */}
        <div className="flex gap-3 animate-scroll-photos">
          {[...SHOWCASE_PHOTOS, ...SHOWCASE_PHOTOS].map((photo, i) => (
            <PhotoTile key={i} photo={photo} index={i} onOpen={setSelectedPhoto} />
          ))}
        </div>
      </div>

      {/* CSS animation for infinite scroll */}
      <style>{`
        @keyframes scroll-photos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-photos {
          animation: scroll-photos 40s linear infinite;
        }
        .animate-scroll-photos:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-photos {
            animation: none;
            overflow-x: auto;
          }
        }
      `}</style>

      {/* Lightbox modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Cerrar"
          >
            <X size={32} weight="bold" />
          </button>
          <div
            className="flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            />
            <p className="text-white/70 text-sm text-center">{selectedPhoto.alt}</p>
          </div>
        </div>
      )}
    </section>
  )
}
