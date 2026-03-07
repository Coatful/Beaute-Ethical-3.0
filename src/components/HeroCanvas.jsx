import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import '../styles/hero-canvas.css'

// Adjust TOTAL_FRAMES to match actual extracted frame count after ffmpeg extraction
const TOTAL_FRAMES = 241

export default function HeroCanvas({ containerRef }) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)

  const handleProgress = useCallback((p) => {
    setProgress(p)
  }, [])

  const { canvasRef } = useScrollAnimation({
    framesDir: `${import.meta.env.BASE_URL}frames/hero`,
    totalFrames: TOTAL_FRAMES,
    containerRef,
    onProgress: handleProgress,
  })

  // Text fades out during first 40% of scroll, fully gone by 60%
  const textOpacity = Math.max(0, 1 - progress * 2.5)

  return (
    <div className="hero-canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        width={1920}
        height={1080}
      />
      <div className="hero-overlay" style={{ opacity: textOpacity }}>
        <div className="hero-content">
          <h1 className="hero-title">Beaute Ethical</h1>
          <p className="hero-subtitle">Premium Korean Skincare</p>
          <Link to="/catalog" className="hero-cta">{t('hero.cta')}</Link>
        </div>
      </div>
    </div>
  )
}
