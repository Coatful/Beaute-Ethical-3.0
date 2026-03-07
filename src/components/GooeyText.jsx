import { useRef, useEffect } from 'react'
import '../styles/gooey-text.css'

export default function GooeyText({
  texts,
  morphTime = 1.5,
  cooldownTime = 2,
  className = '',
  textClassName = '',
}) {
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)

  useEffect(() => {
    let textIndex = texts.length - 1
    let time = new Date()
    let morph = 0
    let cooldown = cooldownTime
    let rafId

    const setMorph = (fraction) => {
      const t1 = text1Ref.current
      const t2 = text2Ref.current
      if (!t1 || !t2) return

      t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
      t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

      const inv = 1 - fraction
      t1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`
      t1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`
    }

    const doCooldown = () => {
      morph = 0
      const t1 = text1Ref.current
      const t2 = text2Ref.current
      if (!t1 || !t2) return
      t2.style.filter = ''
      t2.style.opacity = '100%'
      t1.style.filter = ''
      t1.style.opacity = '0%'
    }

    const doMorph = () => {
      morph -= cooldown
      cooldown = 0
      let fraction = morph / morphTime
      if (fraction > 1) {
        cooldown = cooldownTime
        fraction = 1
      }
      setMorph(fraction)
    }

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const newTime = new Date()
      const shouldIncrement = cooldown > 0
      const dt = (newTime.getTime() - time.getTime()) / 1000
      time = newTime

      cooldown -= dt

      if (cooldown <= 0) {
        if (shouldIncrement) {
          textIndex = (textIndex + 1) % texts.length
          if (text1Ref.current) text1Ref.current.textContent = texts[textIndex % texts.length]
          if (text2Ref.current) text2Ref.current.textContent = texts[(textIndex + 1) % texts.length]
        }
        doMorph()
      } else {
        doCooldown()
      }
    }

    // Initialise text
    if (text1Ref.current) text1Ref.current.textContent = texts[textIndex % texts.length]
    if (text2Ref.current) text2Ref.current.textContent = texts[(textIndex + 1) % texts.length]

    animate()
    return () => cancelAnimationFrame(rafId)
  }, [texts, morphTime, cooldownTime])

  return (
    <div className={`gooey-container ${className}`}>
      {/* SVG filter that creates the gooey threshold effect */}
      <svg className="gooey-filter-svg" aria-hidden="true">
        <defs>
          <filter id="gooey-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div className="gooey-texts" style={{ filter: 'url(#gooey-threshold)' }}>
        <span ref={text1Ref} className={`gooey-text ${textClassName}`} />
        <span ref={text2Ref} className={`gooey-text ${textClassName}`} />
      </div>
    </div>
  )
}
