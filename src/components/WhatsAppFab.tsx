import { WhatsappLogo } from '@phosphor-icons/react'

const WHATSAPP_LINK =
  'https://wa.me/59899251310?text=Hola%20TAPIPOCITOS!%20Quiero%20consultar%20por%20un%20trabajo%20de%20tapiceria.'

// Sticky WhatsApp call-to-action, bottom-right on every page. High-conversion
// pattern for service businesses. Pulses gently to draw the eye.
export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping"
        style={{ animationDuration: '2.5s' }}
        aria-hidden="true"
      />
      <span
        className="relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-float transition-transform duration-300 group-hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
      >
        <WhatsappLogo size={30} weight="fill" />
      </span>
    </a>
  )
}
