export type ContactameLink = {
  id: string
  label: string
  href: string
}

export const CONTACTAME_LINKS: readonly ContactameLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/paulina-palmeyro-beltramo-71771a364',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/paulinapalmeyro/',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/PaulinaPalmeyro',
  },
  {
    id: 'email',
    label: 'Mail',
    href: 'mailto:paulina.palmeyro@gmail.com',
  },
] as const
