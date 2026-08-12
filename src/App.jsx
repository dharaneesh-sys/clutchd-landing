import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'

// Landing shell (T5). Header + Footer are live; section bodies are populated
// by T6-T13. Anchor ids here so nav/menu resolve immediately.
const SECTIONS = [
  'workflow',
  'audiences',
  'ecosystem',
  'trust',
  'marketplace',
  'intelligence',
  'early-access',
]

export default function App() {
  return (
    <div id="top" className="min-h-[100dvh] bg-surface-primary text-text-primary">
      <Header />
      <main>
        <Hero />
        {SECTIONS.map((id) => (
          <section key={id} id={id} aria-labelledby={`${id}-heading`} className="min-h-[40vh] scroll-mt-20" />
        ))}
      </main>
      <Footer />
    </div>
  )
}
