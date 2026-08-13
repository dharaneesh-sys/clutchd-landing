import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import Ecosystem from './components/sections/Ecosystem.jsx'
import Audiences from './components/sections/Audiences.jsx'
import Workflow from './components/sections/Workflow.jsx'
import Trust from './components/sections/Trust.jsx'
import Marketplace from './components/sections/Marketplace.jsx'
import Intelligence from './components/sections/Intelligence.jsx'
import EarlyAccess from './components/sections/EarlyAccess.jsx'

export default function App() {
  return (
    <div id="top" className="min-h-[100dvh] bg-surface-primary text-text-primary">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <Ecosystem />
        <Audiences />
        <Workflow />
        <Trust />
        <Marketplace />
        <Intelligence />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  )
}
