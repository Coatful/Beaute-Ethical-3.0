import { useRef } from 'react'
import HeroCanvas from './HeroCanvas.jsx'
import '../styles/hero-section.css'

export default function HeroSection() {
  const containerRef = useRef(null)

  return (
    <section ref={containerRef} className="hero-section">
      <HeroCanvas containerRef={containerRef} />
    </section>
  )
}
