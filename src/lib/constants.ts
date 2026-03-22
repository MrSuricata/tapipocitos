export const DESIGN_TOKENS = {
  colors: {
    title: '#1F2937',
    description: '#374151',
    overlay: 'rgba(0, 0, 0, 0.35)',
    textOnOverlay: '#FFFFFF',
  },
  typography: {
    title: {
      minSize: '20px',
      maxSize: '24px',
    },
    description: {
      minSize: '16px',
      maxSize: '18px',
    },
    lineHeight: 1.5,
  },
  animations: {
    duration: {
      fast: 200,
      medium: 250,
      slow: 300,
    },
    easing: 'ease-in-out',
    hover: {
      translateY: -5,
      scale: 1.03,
    },
  },
  accessibility: {
    minContrast: 4.5,
    focusRingWidth: '2px',
  },
} as const

export const SERVICE_DETAILS = {
  'Tapizado a Medida': {
    title: 'Tapizado a Medida',
    description: 'Creamos piezas únicas adaptadas a tus necesidades y estilo. Selección de telas premium y acabados personalizados.',
    expandedDescription: 'En TAPIPOCITOS diseñamos y fabricamos muebles tapizados completamente personalizados. Trabajamos contigo desde el concepto inicial hasta el acabado final, seleccionando las mejores telas, espumas de alta densidad y estructuras resistentes. Cada pieza es única y refleja tu personalidad y necesidades específicas.',
    benefits: [
      'Diseño 100% personalizado según tus medidas y estilo',
      'Amplia selección de telas premium importadas y nacionales',
      'Estructuras de madera maciza de primera calidad',
      'Espumas de alta densidad para máximo confort y durabilidad',
      'Garantía de 5 años en estructura y mano de obra',
    ],
    filter: 'Sofás',
  },
  'Restauración de Muebles': {
    title: 'Restauración de Muebles',
    description: 'Devolvemos la vida a tus muebles favoritos. Reparación estructural, retapizado y acabados que respetan la esencia original.',
    expandedDescription: 'Rescatamos muebles con valor sentimental o histórico, devolviéndoles su esplendor original. Nuestro proceso incluye evaluación estructural completa, reparación de marcos de madera, reemplazo de resortes y rellenos, y retapizado profesional. Respetamos el diseño original mientras incorporamos mejoras en comodidad y durabilidad.',
    benefits: [
      'Evaluación gratuita del estado del mueble',
      'Reparación completa de estructura de madera',
      'Restauración de sistemas de resortes tradicionales',
      'Preservación de diseños antiguos y vintage',
      'Antes y después documentado con fotos',
    ],
    filter: 'Restauraciones',
  },
  'Diseño de Interiores': {
    title: 'Diseño de Interiores',
    description: 'Asesoramiento integral para espacios residenciales y comerciales. Combinamos funcionalidad y estética para crear ambientes únicos.',
    expandedDescription: 'Ofrecemos servicio completo de diseño de interiores especializado en tapicería y mobiliario. Trabajamos tanto en proyectos residenciales como comerciales, creando espacios armoniosos que reflejan la identidad de nuestros clientes. Desde la selección de colores y texturas hasta la disposición óptima del mobiliario.',
    benefits: [
      'Consulta inicial y levantamiento de necesidades',
      'Propuesta de paleta de colores y materiales',
      'Renders 3D para visualizar el resultado final',
      'Coordinación con otros proveedores si es necesario',
      'Seguimiento completo hasta la entrega final',
    ],
    filter: 'Proyectos Especiales',
  },
  'Proyectos Especiales': {
    title: 'Proyectos Especiales',
    description: 'Desarrollamos proyectos corporativos, hoteles, restaurants y espacios comerciales. Soluciones personalizadas a gran escala.',
    expandedDescription: 'Nos especializamos en proyectos de gran envergadura para sectores corporativos, hoteleros y comerciales. Gestionamos todo el proceso desde el diseño conceptual hasta la instalación final, cumpliendo plazos estrictos y estándares de calidad profesional. Tenemos experiencia en hoteles boutique, restaurants, oficinas corporativas y espacios de coworking.',
    benefits: [
      'Gestión integral de proyectos de gran escala',
      'Cumplimiento de normativas comerciales y de seguridad',
      'Plazos garantizados con planificación detallada',
      'Volúmenes corporativos con precios especiales',
      'Servicio post-venta y mantenimiento programado',
    ],
    filter: 'Proyectos Especiales',
  },
} as const
