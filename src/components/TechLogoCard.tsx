type TechLogoCardProps = {
  name: string
  imageSrc: string
  alt: string
  /** Desfase de la animación (p. ej. índice × 0.12s) para efecto retro escalonado. */
  bobDelaySec?: number
}

/**
 * Muestra el logo tal cual está en /public. Los PNG deben exportarse con canal alpha
 * (fondo transparente). El procesado en canvas degradaba bordes y dejaba artefactos.
 */
export function TechLogoCard({ name, imageSrc, alt, bobDelaySec = 0 }: TechLogoCardProps) {
  return (
    <div
      className="tech-logo-card"
      style={{ ['--tech-bob-delay' as string]: `${bobDelaySec}s` }}
      tabIndex={0}
    >
      <div className="tech-logo-frame">
        <div className="tech-logo-bob">
          <img className="tech-logo-img" src={imageSrc} alt={alt} width={160} height={56} loading="lazy" decoding="async" />
        </div>
      </div>
      <p className="tech-logo-caption" aria-hidden="true">
        {name}
      </p>
    </div>
  )
}
