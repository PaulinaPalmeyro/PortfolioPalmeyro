export type ProyectoLink = {
  label: string
  href: string
}

export type ProyectoDestacado = {
  title: string
  paragraphs: readonly string[]
  dirigidoLabel?: string
  /** Líneas extra antes de "Dirigido a" (p. ej. Rol). */
  metaLines?: readonly string[]
  links?: readonly ProyectoLink[]
  /** Sin botón: proyecto confidencial. */
  confidentialNote?: string
}

export const PROYECTOS_DESTACADOS: readonly ProyectoDestacado[] = [
  {
    title: 'Marketplace digital TodoAgro',
    paragraphs: [
      'Desarrollo y mantenimiento de funcionalidades backend para un marketplace digital orientado al sector agroindustrial. La plataforma permite la gestión de productos, órdenes de compra, envíos, membresías y métricas de rendimiento para vendedores.',
    ],
    metaLines: ['Rol: Backend Developer'],
    dirigidoLabel:
      'MacroIntell, empresa de desarrollo tecnológico encargada de la construcción y evolución de soluciones digitales como TodoAgro.',
    confidentialNote: 'Proyecto confidencial — sin repositorio público.',
  },
  {
    title: 'PACman Auditivo | Plataforma terapéutica interactiva',
    paragraphs: [
      'PACman Auditivo es una aplicación web desarrollada en conjunto con estudiantes de fonoaudiología, orientada al tratamiento del procesamiento auditivo central en niños. El sistema permite que profesionales gestionen pacientes, asignen actividades por niveles y realicen seguimiento del progreso.',
    ],
    dirigidoLabel: 'Proyecto académico con aplicación real, pensado para profesionales fonoaudiólogos.',
    links: [
      {
        label: 'Repositorio en GitHub',
        href: 'https://github.com/PaulinaPalmeyro/pacman-auditivo',
      },
    ],
  },
  {
    title: 'Sistema de votación de esculturas (Bienal)',
    paragraphs: [
      'Aplicación web desarrollada para gestionar votaciones de esculturas, permitiendo a los usuarios emitir votos y visualizar resultados en tiempo real. En este proyecto participé en la implementación de la lógica de votación, control de estados y manejo de datos, asegurando la integridad de la información y la correcta actualización de resultados.',
    ],
    dirigidoLabel: 'Proyecto académico orientado a la práctica de desarrollo web.',
    links: [
      {
        label: 'Backend en GitHub',
        href: 'https://github.com/gmartineza/bienal-backend',
      },
    ],
  },
  {
    title: 'Sistema Integrador Nutrición | Evaluación de productos alimenticios',
    paragraphs: [
      'Sistema desarrollado en el marco de un proyecto interdisciplinario junto a la carrera de Nutrición, orientado al análisis de productos alimenticios. La aplicación permite registrar la composición nutricional de distintos productos (como galletitas) y recopilar devoluciones de usuarios sobre su aceptación, facilitando el estudio tanto desde un enfoque técnico como desde la percepción del consumidor.',
    ],
    dirigidoLabel: 'Proyecto académico con estudiantes de Nutrición como clientes.',
    links: [
      {
        label: 'Backend en GitHub',
        href: 'https://github.com/PaulinaPalmeyro/BackEndNutricion',
      },
      {
        label: 'Frontend en GitHub',
        href: 'https://github.com/PaulinaPalmeyro/FrontEndNutricion',
      },
    ],
  },
  {
    title: 'Simulador de sistema de mails | Programación orientada a objetos',
    paragraphs: [
      'Desarrollo de un simulador de sistema de correos electrónicos implementado en Java, con el objetivo de aplicar principios de programación orientada a objetos. El sistema permite modelar el envío, recepción y organización de mensajes, trabajando con estructuras como bandejas de entrada, usuarios y gestión de correos.',
    ],
    dirigidoLabel:
      'Proyecto académico orientado a la práctica y consolidación de conceptos de programación orientada a objetos.',
    links: [
      {
        label: 'Repositorio en GitHub',
        href: 'https://github.com/PaulinaPalmeyro/MailFinalPosiblemente',
      },
    ],
  },
  {
    title: 'Simulación de sistema de atención en cafetería UCP | Análisis de colas',
    paragraphs: [
      'Proyecto de modelado y simulación desarrollado a partir de un caso real: el funcionamiento de la cafetería en la Universidad de la Cuenca del Plata. El objetivo fue analizar el sistema de atención al cliente mediante un enfoque de teoría de colas, identificando tiempos de espera, congestión y eficiencia del servicio. Se modeló el flujo de clientes, los tiempos de atención y la dinámica del sistema, implementando una simulación que permitió evaluar distintos escenarios y proponer mejoras en la organización del servicio.',
    ],
    dirigidoLabel:
      'Proyecto académico basado en un caso real, orientado al análisis y mejora de sistemas de atención en el ámbito de servicios.',
    links: [
      {
        label: 'Repositorio en GitHub',
        href: 'https://github.com/PaulinaPalmeyro/simulador-bar-ucp',
      },
    ],
  },
  {
    title: 'Este portfolio',
    paragraphs: [
      '¿Te gustó este portfolio? Mirá el repositorio con el código fuente de este sitio.',
    ],
    dirigidoLabel: 'Elaborado como proyecto académico y como espacio para mi desarrollo profesional.',
    links: [
      {
        label: 'Repositorio en GitHub',
        href: 'https://github.com/PaulinaPalmeyro/PortfolioPalmeyro',
      },
    ],
  },
] as const
