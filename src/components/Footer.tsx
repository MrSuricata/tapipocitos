import { Armchair, Phone, Envelope, MapPin, WhatsappLogo } from '@phosphor-icons/react'

function StitchBorder() {
  return (
    <svg
      className="w-full h-4"
      viewBox="0 0 1200 16"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stitch pattern - diagonal crosses repeating */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = i * 30 + 5
        return (
          <g key={i} opacity="0.5">
            <line x1={x} y1={3} x2={x + 12} y2={13} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1={x + 12} y1={3} x2={x} y2={13} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )
      })}
      {/* Thread line running through */}
      <line x1="0" y1="8" x2="1200" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.25" strokeDasharray="4 6" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#2C1810' }}>
      {/* Decorative stitch border */}
      <div className="text-amber-700/60">
        <StitchBorder />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 text-amber-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Armchair size={32} weight="duotone" className="text-amber-300" />
              <div>
                <h3 className="text-xl font-bold">TAPIPOCITOS</h3>
                <p className="text-xs opacity-80">Tapiceria Familiar</p>
              </div>
            </div>

            {/* Founding year badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/50 border border-amber-700/40 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-amber-200 tracking-wide">Desde 1990</span>
            </div>

            <p className="text-sm opacity-75 leading-relaxed">
              Tapiceria artesanal uruguaya de generacion en generacion
            </p>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-200">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Retapizados
                </a>
              </li>
              <li>
                <a href="#services" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Restauraciones
                </a>
              </li>
              <li>
                <a href="#services" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Muebles a Medida
                </a>
              </li>
              <li>
                <a href="#services" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Proyectos Comerciales
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links column */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-200">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#gallery" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#about" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#contact" className="opacity-75 hover:opacity-100 hover:text-amber-300 transition-all">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-200">Contacto</h4>
            <ul className="space-y-3 text-sm">
              {/* WhatsApp quick link - primary */}
              <li>
                <a
                  href="https://wa.me/59899511196?text=Hola%20TAPIPOCITOS!%20Quiero%20consultar%20por%20un%20trabajo%20de%20tapiceria."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-all group"
                >
                  <WhatsappLogo size={20} weight="fill" className="text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="hover:text-green-300 transition-colors">+598 99 123 456</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} weight="duotone" className="text-amber-400/70" />
                <span className="opacity-75">+598 99 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Envelope size={18} weight="duotone" className="text-amber-400/70" />
                <span className="opacity-75">tapipocitos@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} weight="duotone" className="text-amber-400/70" />
                <span className="opacity-75">Montevideo, Uruguay</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-amber-800/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-60">
            &copy; {new Date().getFullYear()} TAPIPOCITOS. Todos los derechos reservados.
          </p>
          <p className="text-xs opacity-40 italic">
            Hecho con dedicacion en Montevideo, Uruguay
          </p>
        </div>
      </div>
    </footer>
  )
}
