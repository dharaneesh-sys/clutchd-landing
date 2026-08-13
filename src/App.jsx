import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import TrustBar from './components/sections/TrustBar.jsx'
import Ecosystem from './components/sections/Ecosystem.jsx'
import Audiences from './components/sections/Audiences.jsx'
import Workflow from './components/sections/Workflow.jsx'
import Trust from './components/sections/Trust.jsx'
import Testimonials from './components/sections/Testimonials.jsx'
import Marketplace from './components/sections/Marketplace.jsx'
import Intelligence from './components/sections/Intelligence.jsx'
import Faq from './components/sections/Faq.jsx'
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
        <TrustBar />
        <Ecosystem />
        <Audiences />
        <Workflow />
        <Trust />
        <Testimonials />
        <Marketplace />
        <Intelligence />
        <Faq />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  )
}
