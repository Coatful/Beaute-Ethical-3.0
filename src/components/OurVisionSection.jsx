import { useRef, useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import Section2Canvas from './Section2Canvas.jsx'
import '../styles/our-vision-section.css'

export default function OurVisionSection() {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const scrolled = -rect.top
      const scrollable = container.offsetHeight - window.innerHeight
      const p = Math.max(0, Math.min(1, scrolled / scrollable))
      setProgress(p)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Part 1 fades out 40–60%, Part 2 fades in 50–70%
  const part1Opacity = progress < 0.4 ? 1 : Math.max(0, 1 - (progress - 0.4) * 5)
  const part2Opacity = progress < 0.5 ? 0 : Math.min(1, (progress - 0.5) * 5)

  return (
    <section ref={containerRef} className="our-vision-section">
      {/* Full-viewport canvas — seamless visual continuation of Hero.mp4 */}
      <Section2Canvas containerRef={containerRef} />

      {/* Text overlay — left side, sticky on top of canvas */}
      <div className="our-vision-overlay">
        <div className="our-vision-text-panel">
          <div className="our-vision-accent-line" />
          <h2 className="our-vision-heading">{t('vision.title')}</h2>
          <div className="our-vision-parts">
            <p className="our-vision-part" style={{ opacity: part1Opacity }}>{t('vision.part1')}</p>
            <p className="our-vision-part our-vision-part--abs" style={{ opacity: part2Opacity }}>{t('vision.part2')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
