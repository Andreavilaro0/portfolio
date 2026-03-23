interface SketchEmbedProps {
  src: string
  width?: string
  height?: string
  style?: React.CSSProperties
}

export function SketchEmbed({
  src,
  width = '100%',
  height = '400px',
  style,
}: SketchEmbedProps) {
  return (
    <iframe
      src={src}
      title="Decorative sketch"
      scrolling="no"
      frameBorder="0"
      aria-hidden="true"
      style={{
        width,
        height,
        border: 'none',
        pointerEvents: 'none',
        background: 'transparent',
        display: 'block',
        ...style,
      }}
    />
  )
}
