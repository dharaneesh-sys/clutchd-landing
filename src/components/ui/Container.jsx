/**
 * Container — page frame (DESIGN.md §4).
 *
 * Max content width 1280px (max-w-[80rem]); horizontal padding from the
 * spacing scale: 16px mobile (px-4), 24px ≥640px (sm:px-6), 32px ≥1024px
 * (lg:px-8). Centered with mx-auto.
 *
 * API:
 *   <Container as="section" className="py-24">…</Container>
 */
export default function Container({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  )
}