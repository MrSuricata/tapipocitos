import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Reveal } from '@/components/Reveal'
import { BackgroundDecor } from '@/components/BackgroundDecor'
import { DESIGN_TOKENS } from '@/lib/constants'

const FAQS = [
  {
    q: '¿Retiran y entregan el mueble a domicilio?',
    a: 'Sí. Coordinamos el retiro y la entrega en Montevideo y zona metropolitana, para que no tengas que preocuparte por el traslado.',
  },
  {
    q: '¿Cuánto demora un trabajo?',
    a: 'Depende del mueble y del trabajo, pero en general entre 1 y 3 semanas. Te damos una fecha y la cumplimos — muchos clientes nos dicen que tenemos puntualidad inglesa 😉.',
  },
  {
    q: '¿Dan garantía?',
    a: 'Los armazones que fabricamos tienen garantía de por vida. En retapizados y restauraciones garantizamos la mano de obra y los materiales.',
  },
  {
    q: '¿Puedo llevar mi propia tela?',
    a: 'Claro. Podés traer tu tela o elegir entre las nuestras — trabajamos con telas importadas y nacionales de primera calidad.',
  },
  {
    q: '¿El presupuesto tiene costo?',
    a: 'No, el presupuesto es totalmente sin cargo. Mandanos fotos y medidas por WhatsApp y te lo pasamos a la brevedad.',
  },
  {
    q: '¿Hacen muebles a medida?',
    a: 'Sí. Diseñamos y fabricamos sofás, sillones y piezas a medida según tu espacio, estilo y necesidad.',
  },
  {
    q: '¿Dónde están?',
    a: 'Nuestro taller está en Malvín Norte, Montevideo (Pedro Cosío 2430). Atendemos de lunes a viernes de 8:00 a 17:00.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="py-24 px-6 bg-secondary/20 relative warm-mesh">
      <BackgroundDecor variant="sand" />
      <div className="max-w-3xl mx-auto relative z-10">
        <Reveal className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-3">
            Preguntas frecuentes
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tight"
            style={{ color: DESIGN_TOKENS.colors.title }}
          >
            ¿Tenés <span className="text-gradient-warm">dudas</span>?
          </h2>
          <p className="text-lg mt-4" style={{ color: DESIGN_TOKENS.colors.description }}>
            Las respuestas a lo que más nos consultan.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass rounded-2xl border border-white/50 px-5 shadow-soft last:border-b"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-[#1F2937] hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-[#374151] pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
