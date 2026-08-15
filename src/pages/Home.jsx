import Hero from '../components/sections/Hero.jsx'
import TrustBar from '../components/sections/TrustBar.jsx'
import Trust from '../components/sections/Trust.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import EarlyAccess from '../components/sections/EarlyAccess.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function Home() {
  usePageMeta(
    'ClutchD — Connected automotive care',
    'On-demand verified mechanics, roadside help, parts marketplace, real-time tracking and digital service history — one connected automotive ecosystem, live in Coimbatore.',
  )

  return (
    <>
      <Hero />
      <TrustBar />
      <Trust />
      <Testimonials />
      <EarlyAccess />
    </>
  )
}