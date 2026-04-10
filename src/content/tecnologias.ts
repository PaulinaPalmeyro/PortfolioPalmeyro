export type TechItem = {
  id: string
  /** Nombre mostrado al pasar el mouse (y lectores de pantalla). */
  name: string
  imageSrc: string
  alt: string
}

export type TechSubsection = {
  id: string
  title: string
  items: readonly TechItem[]
}

export const TECNOLOGIAS_SUBSECTIONS: readonly TechSubsection[] = [
  {
    id: 'backend',
    title: 'Backend',
    items: [
      {
        id: 'nodejs',
        name: 'Node.js',
        imageSrc: '/tech/nodejs.png',
        alt: 'Logo de Node.js',
      },
      {
        id: 'nestjs',
        name: 'NestJS',
        imageSrc: '/tech/nestjs.png',
        alt: 'Logo de NestJS',
      },
      {
        id: 'expressjs',
        name: 'Express.js',
        imageSrc: '/tech/expressjs.png',
        alt: 'Logo de Express.js',
      },
    ],
  },
  {
    id: 'lenguajes',
    title: 'Lenguajes',
    items: [
      {
        id: 'cpp',
        name: 'C++',
        imageSrc: '/tech/cpp.png',
        alt: 'Logo de C++',
      },
      {
        id: 'java',
        name: 'Java',
        imageSrc: '/tech/java.png',
        alt: 'Logo de Java',
      },
      {
        id: 'python',
        name: 'Python',
        imageSrc: '/tech/python.png',
        alt: 'Logo de Python',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        imageSrc: '/tech/javascript.png',
        alt: 'Logo de JavaScript',
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        imageSrc: '/tech/typescript.png',
        alt: 'Logo de TypeScript',
      },
    ],
  },
  {
    id: 'frontend-basico',
    title: 'Frontend (Básico)',
    items: [
      {
        id: 'fe-javascript',
        name: 'JavaScript',
        imageSrc: '/tech/javascript.png',
        alt: 'Logo de JavaScript',
      },
      {
        id: 'html',
        name: 'HTML',
        imageSrc: '/tech/html.png',
        alt: 'Logo de HTML',
      },
      {
        id: 'css',
        name: 'CSS',
        imageSrc: '/tech/css.png',
        alt: 'Logo de CSS',
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        imageSrc: '/tech/next.png',
        alt: 'Logo de Next.js',
      },
    ],
  },
  {
    id: 'bases-de-datos',
    title: 'Bases de Datos',
    items: [
      {
        id: 'mongodb',
        name: 'MongoDB',
        imageSrc: '/tech/mongodb.png',
        alt: 'Logo de MongoDB',
      },
      {
        id: 'mongoose',
        name: 'Mongoose',
        imageSrc: '/tech/mongoose.png',
        alt: 'Logo de Mongoose',
      },
      {
        id: 'mysql',
        name: 'MySQL',
        imageSrc: '/tech/mysql.png',
        alt: 'Logo de MySQL',
      },
    ],
  },
  {
    id: 'herramientas-devops',
    title: 'Algunas Herramientas y DevOps que utilizo',
    items: [
      {
        id: 'git',
        name: 'Git',
        imageSrc: '/tech/git.png',
        alt: 'Logo de Git',
      },
      {
        id: 'github',
        name: 'GitHub',
        imageSrc: '/tech/github.png',
        alt: 'Logo de GitHub',
      },
      {
        id: 'gitlab',
        name: 'GitLab',
        imageSrc: '/tech/gitlab.png',
        alt: 'Logo de GitLab',
      },
      {
        id: 'docker',
        name: 'Docker',
        imageSrc: '/tech/docker.png',
        alt: 'Logo de Docker',
      },
      {
        id: 'postman',
        name: 'Postman',
        imageSrc: '/tech/postman.png',
        alt: 'Logo de Postman',
      },
      {
        id: 'apidog',
        name: 'Apidog',
        imageSrc: '/tech/apidog.png',
        alt: 'Logo de Apidog',
      },
    ],
  },
  {
    id: 'automatizacion-scraping',
    title: 'Automatización y Scraping',
    items: [
      {
        id: 'playwright',
        name: 'Playwright',
        imageSrc: '/tech/playwright.png',
        alt: 'Logo de Playwright',
      },
      {
        id: 'axios',
        name: 'Axios',
        imageSrc: '/tech/axios.png',
        alt: 'Logo de Axios',
      },
    ],
  },
] as const
