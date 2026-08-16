import Hero from '../components/sections/Hero.jsx'
import TrustBar from '../components/sections/TrustBar.jsx'
import Trust from '../components/sections/Trust.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import EarlyAccess from '../components/sections/EarlyAccess.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { useT } from '../lib/i18n.js'

export default function Home() {
  const { t } = useT()
  usePageMeta(t['meta.home.title'], t['meta.home.description'])

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