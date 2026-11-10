// Catálogo de trabajos — contenido curado con fotos reales del taller.
// Vive en el código (no en Supabase) para que el catálogo nunca quede vacío
// aunque la base se pause. Los trabajos que se carguen desde Admin → Trabajos
// se agregan al final automáticamente (ver Catalogo.tsx).

export interface CatalogoTrabajo {
  id: string
  titulo: string
  /** Segunda línea del título, en itálica */
  tituloItalica?: string
  categoria: string
  texto: string
  detalles: { label: string; valor: string }[]
  /** La primera es la foto principal de la página */
  fotos: { src: string; alt: string }[]
}

const F = '/fotos/trabajos/'

export const CATALOGO: CatalogoTrabajo[] = [
  {
    id: 'chesterfield-bordo',
    titulo: 'Chesterfield',
    tituloItalica: 'en cuero bordó',
    categoria: 'Restauración',
    texto:
      'Llegó cansado y se fue entero. Desarmamos, rehicimos la base y el relleno, y volvimos a armar el capitoné botón por botón, respetando el diseño original.',
    detalles: [
      { label: 'Trabajo', valor: 'Restauración completa' },
      { label: 'Material', valor: 'Cuero' },
      { label: 'Detalle', valor: 'Capitoné a mano' },
    ],
    fotos: [
      { src: F + 'chesterfield-bordo-patio.jpg', alt: 'Sofá Chesterfield de cuero bordó terminado' },
      { src: F + 'chesterfield-proceso-1.jpg', alt: 'El Chesterfield desarmado en el taller' },
      { src: F + 'chesterfield-proceso-2.jpg', alt: 'Base y relleno nuevos del Chesterfield' },
      { src: F + 'chesterfield-bordo-lateral.jpg', alt: 'Vista lateral del Chesterfield terminado' },
    ],
  },
  {
    id: 'butacas-rayadas',
    titulo: 'Butaca Leopoldo',
    tituloItalica: 'a rayas finas',
    categoria: 'Sillones',
    texto:
      'Un par de butacas Leopoldo, de respaldo envolvente, tapizadas en una tela clara de rayas finas. Las rayas se alinean de pieza a pieza para que el dibujo no se corte.',
    detalles: [
      { label: 'Trabajo', valor: 'Tapizado completo' },
      { label: 'Tela', valor: 'Rayada clara' },
      { label: 'Patas', valor: 'Madera natural' },
    ],
    fotos: [
      { src: F + 'butacas-rayadas-par.jpg', alt: 'Par de butacas Leopoldo blancas con rayas finas' },
      { src: F + 'butacas-rayadas-detalle.jpg', alt: 'Detalle de una butaca Leopoldo' },
      { src: F + 'butacas-rayadas-patio.jpg', alt: 'Las dos butacas Leopoldo en el patio' },
    ],
  },
  {
    id: 'sofa-verde',
    titulo: 'Sofá verde',
    tituloItalica: 'con faldón',
    categoria: 'Sofás',
    texto:
      'Tres cuerpos con faldón hasta el piso y almohadones claros a juego. Un clásico que vuelve a estar en tendencia.',
    detalles: [
      { label: 'Trabajo', valor: 'Retapizado' },
      { label: 'Color', valor: 'Verde salvia' },
      { label: 'Detalle', valor: 'Faldón y almohadones' },
    ],
    fotos: [
      { src: F + 'sofa-verde-faldon.jpg', alt: 'Sofá verde de tres cuerpos con faldón' },
      { src: F + 'sofa-verde-faldon-2.jpg', alt: 'Sofá verde visto en diagonal' },
      { src: F + 'almohadones-rayados.jpg', alt: 'Almohadones rayados sobre el sofá verde' },
    ],
  },
  {
    id: 'sofa-azul',
    titulo: 'Sofá azul',
    tituloItalica: 'líneas rectas',
    categoria: 'Sofás',
    texto:
      'Líneas simples, almohadones firmes y un azul que se lleva bien con la madera. Recién salido del taller.',
    detalles: [
      { label: 'Trabajo', valor: 'A medida' },
      { label: 'Color', valor: 'Azul' },
      { label: 'Estilo', valor: 'Moderno' },
    ],
    fotos: [
      { src: F + 'sofa-azul.jpg', alt: 'Sofá azul de líneas rectas' },
      { src: F + 'sofa-azul-frente.jpg', alt: 'Sofá azul de frente' },
      { src: F + 'sofa-azul-respaldo.jpg', alt: 'Respaldo del sofá azul' },
    ],
  },
  {
    id: 'almohadones',
    titulo: 'Almohadones',
    tituloItalica: 'de todo tipo',
    categoria: 'Almohadones',
    texto:
      'A juego o en contraste, con vivo, con volado o lisos. Funda con cierre para sacarla y lavarla. También para exterior: reposeras, camastros y bancos.',
    detalles: [
      { label: 'Terminación', valor: 'Vivo, volado o lisa' },
      { label: 'Funda', valor: 'Con cierre' },
      { label: 'Uso', valor: 'Interior y exterior' },
    ],
    fotos: [
      { src: F + 'almohadones-verde-vivo.jpg', alt: 'Almohadones verdes con vivo crudo' },
      { src: F + 'almohadones-oliva.jpg', alt: 'Almohadones color oliva' },
      { src: F + 'almohadon-vivo-detalle.jpg', alt: 'Detalle del vivo de un almohadón' },
      { src: F + 'banco-curvo-almohadones.jpg', alt: 'Banco curvo con almohadones' },
    ],
  },
  {
    id: 'recibidor',
    titulo: 'Recibidor',
    tituloItalica: 'a medida',
    categoria: 'Proyectos especiales',
    texto:
      'Banco-baúl con asiento tapizado en rayas, pensado junto al perchero para el hall de entrada. No todo son sillones: si se puede tapizar, lo diseñamos.',
    detalles: [
      { label: 'Trabajo', valor: 'Diseño y tapizado' },
      { label: 'Asiento', valor: 'Rayado, con vivo' },
      { label: 'Extra', valor: 'Baúl de guardado' },
    ],
    fotos: [
      { src: F + 'recibidor-banco.jpg', alt: 'Recibidor con banco tapizado y perchero' },
      { src: F + 'recibidor-baul.jpg', alt: 'Banco abierto con baúl de guardado' },
      { src: F + 'recibidor-detalle.jpg', alt: 'Detalle del asiento rayado' },
    ],
  },
  {
    id: 'taller',
    titulo: 'Lo que',
    tituloItalica: 'no se ve',
    categoria: 'Desde el taller',
    texto:
      'Antes de la tela está la estructura. La revisamos y la reforzamos primero, porque es lo que hace que un sillón dure otra generación.',
    detalles: [
      { label: 'Taller', valor: 'Pocitos, Montevideo' },
      { label: 'Oficio', valor: 'Tres generaciones' },
    ],
    fotos: [
      { src: F + 'chesterfield-amarillo-estructura.jpg', alt: 'Chesterfield con la estructura a la vista' },
      { src: F + 'taller-tachas.jpg', alt: 'Tachas y herramientas en el banco del taller' },
    ],
  },
]
