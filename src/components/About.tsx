import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import {
  CheckCircle,
  Seal,
  Users,
  Scissors,
  ChatCircle,
  Diamond,
  ShieldCheck,
} from '@phosphor-icons/react'
import { DESIGN_TOKENS } from '@/lib/constants'

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
      description: 'Desde 1990, la familia Calistro ha transmitido el oficio de padres a hijos con orgullo.',
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
      title: 'Garantía de satisfacción',
      description: 'No descansamos hasta que estés 100% conforme con el resultado final de tu mueble.',
    },
  ]

  const timeline = [
    {
      year: 'Orígenes',
      event:
        'Pablo Calistro trabaja en distintas tapicerías de Montevideo, aprendiendo el oficio desde adentro. Acumula años de experiencia antes de dar el salto.',
    },
    {
      year: '1990',
      event:
        'Pablo y su esposa Maris Ferreira abren TAPIPOCITOS. Un taller propio donde Pablo tapiza y Maris se encarga de las costuras: fundas, moldes, almohadones.',
    },
    {
      year: '2000',
      event:
        'Rosana Calistro, hija de Pablo, se suma al taller dedicándose a trabajos en madera, lustre y artesanía manual en muebles de estilo, remodelación y reconstrucción.',
    },
    {
      year: '2010',
      event:
        'Leonardo Marinolli, esposo de Rosana, se incorpora trabajando junto a Pablo en la tapicería y la organización del taller. Comienza a tomar las riendas.',
    },
    {
      year: '2015',
      event:
        'Se suman Diego y Marcelo al taller. Mariela Calistro aporta trabajos en cuero con material reciclado de la tapicería. Johnny, Brian y Leandro también contribuyen en distintos proyectos.',
    },
    {
      year: 'Hoy',
      event:
        'Leonardo dirige TAPIPOCITOS. Tres generaciones, una misma pasión. Toda la familia Calistro-Marinolli sigue dejando su marca en cada mueble que pasa por el taller.',
    },
  ]

  return (
    <section id="about" className="py-20 px-6 bg-secondary/30 subtle-fabric-bg relative overflow-hidden">
      {/* Background watermark of upholstery tools */}
      <UpholsteryToolsWatermark />

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
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: DESIGN_TOKENS.colors.title }}
          >
            Nuestra Historia
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
            Tres décadas de tradición familiar en el arte de la tapicería
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
                Todo comenzó cuando Pablo Calistro, después de años trabajando en
                distintas tapicerías de Montevideo, decidió abrir su propio taller
                en 1990 junto a su esposa Maris Ferreira. Pablo se dedicó a lo que
                mejor sabía hacer — tapizar — mientras Maris se encargaba de las
                costuras: fundas, moldes, almohadones. Así nació TAPIPOCITOS.
              </p>
              <p>
                Con el tiempo se sumó su hija Rosana Calistro, especializada en
                trabajos en madera, lustre y artesanía manual para muebles de
                estilo, remodelación y reconstrucción. Más tarde llegó Leonardo
                Marinolli, esposo de Rosana, quien hoy dirige el taller. También
                contribuyó Mariela Calistro con sus trabajos en cuero reciclado,
                Johnny Ridvanovich, y los nietos Brian y Leandro. Diego y Marcelo
                completan el equipo en el taller.
              </p>
              <p className="italic border-l-4 border-accent pl-4 py-1">
                No somos una fábrica. Somos una familia — abuelos, hijos, yernos,
                nietos — que tapiza con amor. Cuando traés tu mueble al taller, lo
                tratamos como si fuera nuestro. Tres generaciones, una misma pasión.
              </p>
            </div>

            {/* Family photos grid */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <img
                    src="/fotos/familia/pablo-calistro-con-hijas.jpg"
                    alt="Pablo Calistro con sus hijas Rosana y Mariela"
                    className="w-full h-56 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: '50% 25%' }}
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-md">
                  <img
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
                  <img
                    src="/fotos/familia/leonardo-marinolli-cumpleanos.jpg"
                    alt="Leonardo Marinolli, director actual de TAPIPOCITOS"
                    className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: '50% 35%' }}
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-md">
                  <img
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
