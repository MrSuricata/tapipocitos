import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { SafeImage } from '@/components/SafeImage'
import { BackgroundDecor } from '@/components/BackgroundDecor'
import {
  CheckCircle,
  Seal,
  Users,
  Scissors,
  ChatCircle,
  Diamond,
  ShieldCheck,
  Buildings,
  Clock,
} from '@phosphor-icons/react'
import { DESIGN_TOKENS } from '@/lib/constants'

// Proyectos y clientes destacados (trayectoria real de TAPIPOCITOS).
const GRANDES_PROYECTOS = [
  { name: 'Torre Yoo', place: 'Punta del Este' },
  { name: 'Bodega Garzón', place: 'Maldonado' },
  { name: 'Centro Cultural Calvin', place: 'Maldonado' },
  { name: 'Hotel del Prado', place: 'Montevideo' },
  { name: 'Hotel Anastasio', place: 'José Ignacio' },
  { name: 'Montevideo Shopping', place: 'Montevideo' },
  { name: 'Zonamérica', place: 'Montevideo' },
  { name: 'Estudios de decoración y arquitectura', place: '' },
]

function NeedleThreadOrnament() {
  return (
    <svg
      width="180"
      height="32"
      viewBox="0 0 180 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mt-4"
      aria-hidden="true"
    >
      {/* Thread line */}
      <path
        d="M10 16 C40 6, 60 26, 90 16 C120 6, 140 26, 170 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-accent"
        fill="none"
      />
      {/* Needle */}
      <path
        d="M170 16 L180 14 L180 18 Z"
        fill="currentColor"
        className="text-accent"
      />
      {/* Needle eye */}
      <ellipse cx="172" cy="16" rx="1.5" ry="2.5" stroke="currentColor" strokeWidth="1" className="text-accent" fill="none" />
      {/* Small decorative dots along thread */}
      <circle cx="30" cy="11" r="1.5" fill="currentColor" className="text-accent/50" />
      <circle cx="90" cy="16" r="2" fill="currentColor" className="text-accent" />
      <circle cx="150" cy="11" r="1.5" fill="currentColor" className="text-accent/50" />
    </svg>
  )
}

function UpholsteryToolsWatermark() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Upholstery hammer */}
      <g transform="translate(150, 100) rotate(-25)">
        <rect x="0" y="60" width="16" height="120" rx="4" fill="currentColor" />
        <rect x="-20" y="30" width="56" height="35" rx="6" fill="currentColor" />
        <circle cx="8" cy="42" r="3" fill="white" opacity="0.3" />
      </g>
      {/* Tacks / nails scattered */}
      <g transform="translate(350, 80)">
        <circle cx="0" cy="0" r="8" fill="currentColor" />
        <rect x="-2" y="8" width="4" height="16" rx="1" fill="currentColor" />
      </g>
      <g transform="translate(380, 120)">
        <circle cx="0" cy="0" r="6" fill="currentColor" />
        <rect x="-1.5" y="6" width="3" height="12" rx="1" fill="currentColor" />
      </g>
      <g transform="translate(330, 140)">
        <circle cx="0" cy="0" r="7" fill="currentColor" />
        <rect x="-1.5" y="7" width="3" height="14" rx="1" fill="currentColor" />
      </g>
      {/* Fabric roll */}
      <g transform="translate(520, 150)">
        <ellipse cx="0" cy="0" rx="40" ry="60" fill="currentColor" />
        <ellipse cx="0" cy="0" rx="15" ry="22" fill="white" opacity="0.15" />
        <rect x="40" y="-40" width="160" height="80" rx="4" fill="currentColor" opacity="0.6" />
        <line x1="60" y1="-30" x2="60" y2="30" stroke="white" strokeWidth="1" opacity="0.1" />
        <line x1="100" y1="-35" x2="100" y2="35" stroke="white" strokeWidth="1" opacity="0.1" />
        <line x1="140" y1="-38" x2="140" y2="38" stroke="white" strokeWidth="1" opacity="0.1" />
      </g>
      {/* Scissors */}
      <g transform="translate(200, 400) rotate(20)">
        <ellipse cx="-15" cy="0" rx="20" ry="10" stroke="currentColor" strokeWidth="6" fill="none" />
        <ellipse cx="15" cy="0" rx="20" ry="10" stroke="currentColor" strokeWidth="6" fill="none" />
        <line x1="-30" y1="5" x2="-80" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <line x1="30" y1="5" x2="80" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* Measuring tape */}
      <g transform="translate(580, 380)">
        <rect x="0" y="0" width="180" height="24" rx="4" fill="currentColor" />
        {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((x) => (
          <line key={x} x1={x + 10} y1="0" x2={x + 10} y2="10" stroke="white" strokeWidth="1.5" opacity="0.2" />
        ))}
      </g>
    </svg>
  )
}

export function About() {
  const values = [
    {
      icon: Seal,
      title: 'Calidad sin atajos',
      description: 'Cada detalle importa. Usamos las mejores técnicas y no tomamos atajos en ningún paso del proceso.',
    },
    {
      icon: Users,
      title: 'Tradición de 3 generaciones',
      description: 'Desde 1975, la familia Calistro ha transmitido el oficio de padres a hijos con orgullo.',
    },
    {
      icon: Scissors,
      title: '100% hecho a mano',
      description: 'Cada corte, cada puntada, cada terminación es realizada artesanalmente por nuestros tapiceros.',
    },
    {
      icon: ChatCircle,
      title: 'Atención personalizada',
      description: 'Te escuchamos, te asesoramos y trabajamos juntos para lograr exactamente lo que imaginás.',
    },
    {
      icon: Diamond,
      title: 'Materiales premium',
      description: 'Seleccionamos telas, espumas y componentes de primera calidad para resultados duraderos.',
    },
    {
      icon: ShieldCheck,
      title: 'Armazones garantidos de por vida',
      description: 'Confiamos tanto en nuestras estructuras de madera que las garantizamos de por vida. Sin letra chica.',
    },
  ]

  const timeline = [
    {
      year: '1975',
      event:
        'Pablo Calistro abre el primer taller TAPIPOCITOS en Gestido y Obligado, en plena Pocitos. Empieza tapizando solo, con las técnicas aprendidas en años de oficio.',
    },
    {
      year: '1990',
      event:
        'Se incorpora Leonardo Marinolli al taller. Aprende junto a Pablo la tapicería y empieza a manejar la organización, los presupuestos y las visitas a clientes.',
    },
    {
      year: '2010',
      event:
        'Se suma Rosana Calistro, hija de Pablo y esposa de Leonardo, dedicándose a trabajos en madera, lustre y restauración artesanal de muebles de estilo.',
    },
    {
      year: 'Mudanzas',
      event:
        'Durante décadas el taller se mudó varias veces, siempre dentro de Pocitos — de ahí el nombre TAPIPOCITOS. La familia y el barrio fueron parte de la identidad.',
    },
    {
      year: 'Hoy',
      event:
        'Después de muchos años en Pocitos compraron una casa en Malvín Norte y la convirtieron en taller. Leonardo dirige TAPIPOCITOS con la misma dedicación de siempre.',
    },
  ]

  return (
    <section id="about" className="py-20 px-6 bg-secondary/30 subtle-fabric-bg relative overflow-hidden">
      {/* Background watermark of upholstery tools */}
      <UpholsteryToolsWatermark />
      <BackgroundDecor variant="sand" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header with needle/thread ornament */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-6xl font-bold mb-2 tracking-tight"
            style={{ color: DESIGN_TOKENS.colors.title }}
          >
            Nuestra <span className="text-gradient-warm">Historia</span>
          </h2>
          <NeedleThreadOrnament />
          <p
            className="text-lg max-w-2xl mx-auto mt-4"
            style={{
              color: DESIGN_TOKENS.colors.description,
              fontSize: DESIGN_TOKENS.typography.description.maxSize,
              lineHeight: DESIGN_TOKENS.typography.lineHeight,
            }}
          >
            Más de cinco décadas de tradición familiar en el arte de la tapicería
          </p>
        </motion.div>

        {/* Family story and timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Family story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className="text-3xl font-semibold mb-6"
              style={{ color: DESIGN_TOKENS.colors.title }}
            >
              Una familia, una pasión
            </h3>
            <div
              className="space-y-5 leading-relaxed"
              style={{
                color: DESIGN_TOKENS.colors.description,
                fontSize: DESIGN_TOKENS.typography.description.minSize,
                lineHeight: DESIGN_TOKENS.typography.lineHeight,
              }}
            >
              <p>
                Todo empezó en 1975, cuando Pablo Calistro abrió su primer taller
                en Gestido y Obligado, en plena Pocitos. Más de 50.000 muebles
                después, TAPIPOCITOS sigue siendo una historia de familia, oficio
                y barrio.
              </p>
              <p>
                En 1990 se incorporó Leonardo Marinolli, que aprendió junto a
                Pablo y hoy dirige el taller. En 2010 se sumó Rosana Calistro
                — hija de Pablo y esposa de Leonardo — con su trabajo en madera,
                lustre y restauración artesanal. Tres generaciones trabajando
                codo a codo.
              </p>
              <p>
                Después de muchos años de mudanzas siempre dentro de Pocitos,
                compraron una casa en Malvín Norte y la convirtieron en taller.
                Es el lugar donde funcionan hoy — más espacio, la misma esencia.
              </p>
              <p className="italic border-l-4 border-accent pl-4 py-1">
                No somos una fábrica. Somos una familia que tapiza con amor.
                Cuando traés tu mueble al taller, lo tratamos como si fuera
                nuestro. Tres generaciones, una misma pasión.
              </p>
            </div>

            {/* Family photos grid */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <SafeImage
                    src="/fotos/familia/pablo-calistro-con-hijas.jpg"
                    alt="Pablo Calistro con sus hijas Rosana y Mariela"
                    className="w-full h-56 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: '50% 25%' }}
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-md">
                  <SafeImage
                    src="/fotos/familia/pablo-y-esposa-retrato.jpg"
                    alt="Pablo Calistro y Maris Ferreira, fundadores de TAPIPOCITOS"
                    className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: '50% 30%' }}
                  />
                </div>
                <p className="text-xs text-center opacity-60 italic">Pablo y Maris — Los fundadores</p>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <SafeImage
                    src="/fotos/familia/leonardo-marinolli-cumpleanos.jpg"
                    alt="Leonardo Marinolli, director actual de TAPIPOCITOS"
                    className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: '50% 35%' }}
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-md">
                  <SafeImage
                    src="/fotos/familia/familia-grupo-jardin.jpg"
                    alt="La familia Calistro-Marinolli completa"
                    className="w-full h-56 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
                <p className="text-xs text-center opacity-60 italic">Leonardo y la familia — Hoy</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className="text-3xl font-semibold mb-6"
              style={{ color: DESIGN_TOKENS.colors.title }}
            >
              Nuestra trayectoria
            </h3>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration:
                      DESIGN_TOKENS.animations.duration.medium / 1000,
                    delay: index * 0.05,
                  }}
                >
                  <Card
                    className="p-5 border-l-4 border-l-accent hover:shadow-md transition-shadow"
                    style={{
                      transitionDuration: `${DESIGN_TOKENS.animations.duration.medium}ms`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl font-bold text-accent flex-shrink-0">
                        {item.year}
                      </div>
                      <div className="flex-1">
                        <p
                          className="leading-relaxed"
                          style={{
                            color: DESIGN_TOKENS.colors.description,
                            fontSize:
                              DESIGN_TOKENS.typography.description.minSize,
                            lineHeight: DESIGN_TOKENS.typography.lineHeight,
                          }}
                        >
                          {item.event}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Grandes proyectos / clientes destacados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h3
              className="text-3xl font-semibold"
              style={{ color: DESIGN_TOKENS.colors.title }}
            >
              Grandes proyectos
            </h3>
            <p
              className="text-base max-w-2xl mx-auto mt-3"
              style={{
                color: DESIGN_TOKENS.colors.description,
                lineHeight: DESIGN_TOKENS.typography.lineHeight,
              }}
            >
              Más de 50.000 muebles a lo largo de los años, incluyendo trabajos para
              algunos de los espacios más exigentes del país.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {GRANDES_PROYECTOS.map((p, index) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: DESIGN_TOKENS.animations.duration.fast / 1000,
                  delay: index * 0.04,
                }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card/70 border border-border/60 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <Buildings size={22} weight="duotone" className="text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: DESIGN_TOKENS.colors.title }}
                  >
                    {p.name}
                  </p>
                  {p.place && (
                    <p className="text-xs text-muted-foreground">{p.place}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Puntualidad inglesa */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20">
              <Clock size={18} weight="duotone" className="text-accent flex-shrink-0" />
              <span
                className="text-sm font-medium"
                style={{ color: DESIGN_TOKENS.colors.title }}
              >
                Puntualidad inglesa: la fecha que damos, la cumplimos.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Values grid - 3 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <h3
            className="text-3xl font-semibold"
            style={{ color: DESIGN_TOKENS.colors.title }}
          >
            Nuestros valores
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: DESIGN_TOKENS.animations.duration.fast / 1000,
                  delay: index * 0.07,
                }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow text-center"
                      style={{
                        transitionDuration: `${DESIGN_TOKENS.animations.duration.medium}ms`,
                      }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-1">
                      <Icon size={26} weight="fill" className="text-accent" />
                    </div>
                    <h4
                      className="text-lg font-semibold"
                      style={{ color: DESIGN_TOKENS.colors.title }}
                    >
                      {value.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: DESIGN_TOKENS.colors.description,
                        lineHeight: DESIGN_TOKENS.typography.lineHeight,
                      }}
                    >
                      {value.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
