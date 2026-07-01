import { useState, type ImgHTMLAttributes, type ReactNode } from 'react'

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Rendered when the image fails to load. If omitted, a warm gradient tile is shown. */
  fallback?: ReactNode
  /** Class applied to the default gradient fallback (defaults to the image className). */
  fallbackClassName?: string
}

// Drop-in <img> replacement that degrades gracefully: if the src 404s (e.g. a
// photo that hasn't been uploaded yet), it shows a branded gradient placeholder
// instead of a broken-image icon. As soon as the real file exists, it just works.
export function SafeImage({ fallback, fallbackClassName, className, alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    if (fallback !== undefined) return <>{fallback}</>
    return (
      <div
        className={fallbackClassName ?? className}
        role="img"
        aria-label={alt}
        style={{
          background:
            'linear-gradient(135deg, #8B6914 0%, #A0764B 55%, #6B4423 100%)',
        }}
      />
    )
  }

  return (
    <img
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
