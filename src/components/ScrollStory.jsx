import { useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useDualScrollAnimation } from '../hooks/useDualScrollAnimation.js'
import GooeyText from './GooeyText.jsx'
import '../styles/scroll-story.css'

const HERO_PHRASES = ['Beaute Ethical', 'Korean Skincare', 'Premium Quality', 'Since 2012']

const HERO_FRAMES = 241
const SECTION2_FRAMES = 193
const HERO_HEIGHT_VH = 350
const VISION_HEIGHT_VH = 300
const TOTAL_HEIGHT_VH = HERO_HEIGHT_VH + VISION_HEIGHT_VH

export default function ScrollStory() {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const [heroProgress, setHeroProgress] = useState(0)
  const [visionProgress, setVisionProgress] = useState(0)

  const handleHeroProgress = useCallback((p) => setHeroProgress(p), [])
  const handleVisionProgress = useCallback((p) => setVisionProgress(p), [])

  const { canvasRef } = useDualScrollAnimation({
    heroFramesDir: `${import.meta.env.BASE_URL}frames/hero`,
    heroTotalFrames: HERO_FRAMES,
    heroHeightVh: HERO_HEIGHT_VH,
    section2FramesDir: `${import.meta.env.BASE_URL}frames/section2`,
    section2TotalFrames: SECTION2_FRAMES,
    totalHeightVh: TOTAL_HEIGHT_VH,
    containerRef,
    onHeroProgress: handleHeroProgress,
    onVisionProgress: handleVisionProgress,
  })

  // Hero text content fades out early (gone by 40% of hero phase)
  const heroTextOpacity = Math.max(0, 1 - heroProgress * 2.5)

  // Entire hero overlay (gradient + text) fades out 25%→45% of hero phase,
  // so the dark tint is fully gone before Section2 video kicks in
  const heroOverlayOpacity = heroProgress < 0.25
    ? 1
    : Math.max(0, 1 - (heroProgress - 0.25) / 0.20)

  // Canvas swipes upward in the last 15% of vision phase (ease-in cubic for natural acceleration)
  const swipeT = visionProgress > 0.85 ? Math.min(1, (visionProgress - 0.85) / 0.15) : 0
  const canvasSwipeY = -(swipeT * swipeT * swipeT) * 100  // vh, 0 → -100

  // Vision text panel fades in immediately when vision phase starts
  const visionPanelOpacity = Math.min(1, visionProgress * 8)

  // Part 1 fades out 40–60%, Part 2 fades in 50–70%
  const part1Opacity = visionProgress < 0.4 ? 1 : Math.max(0, 1 - (visionProgress - 0.4) * 5)
  const part2Opacity = visionProgress < 0.5 ? 0 : Math.min(1, (visionProgress - 0.5) * 5)

  return (
    <section ref={containerRef} className="scroll-story" style={{ height: `${TOTAL_HEIGHT_VH}vh` }}>

      {/* Single canvas — pinned to viewport for the entire scroll story.
          height: 0 wrapper means it consumes no document-flow space,
          so hero-portion and vision-portion stack naturally below it. */}
      <div className="story-canvas-anchor" style={{ transform: `translateY(${canvasSwipeY}vh)` }}>
        <canvas
          ref={canvasRef}
          className="story-canvas"
        />
      </div>

      {/* Hero text — sticky within its 350vh space.
          heroOverlayOpacity fades the entire gradient+text before Section2 kicks in. */}
      <div className="hero-portion" style={{ height: `${HERO_HEIGHT_VH}vh` }}>
        <div className="hero-text-sticky" style={{ opacity: heroOverlayOpacity }}>
          <div className="hero-content" style={{ opacity: heroTextOpacity }}>
            <GooeyText
              texts={HERO_PHRASES}
              morphTime={1.2}
              cooldownTime={2.5}
              className="hero-gooey"
              textClassName="hero-gooey-text"
            />
            <p className="hero-subtitle">Premium Korean Skincare</p>
            <Link to="/catalog" className="hero-cta">{t('hero.cta')}</Link>
          </div>
        </div>
      </div>

      {/* Vision text — sticky within its 300vh space.
          Only appears after hero-portion has ended. */}
      <div className="vision-portion" style={{ height: `${VISION_HEIGHT_VH}vh` }}>
        <div className="vision-text-sticky" style={{ opacity: visionPanelOpacity }}>
          <div className="vision-text-panel">
            <div className="vision-accent-line" />
            <h2 className="vision-heading">{t('vision.title')}</h2>
            <div className="vision-parts">
              <p className="vision-part" style={{ opacity: part1Opacity }}>{t('vision.part1')}</p>
              <p className="vision-part vision-part--abs" style={{ opacity: part2Opacity }}>{t('vision.part2')}</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
