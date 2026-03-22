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

export function PhotoShowcase() {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; alt: string } | null>(null)

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
            <div
              key={i}
              className="flex-shrink-0 w-56 h-40 md:w-72 md:h-48 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
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
