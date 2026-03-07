import { useEffect, useRef, useCallback } from 'react'

/**
 * Drives a single canvas through two video sources based on scroll position.
 *
 * The container is split into two scroll phases:
 *   Phase 1 (hero): scrolled distance 0 → (heroHeightVh - 100)vh
 *   Phase 2 (vision): scrolled distance → rest up to (totalHeightVh - 100)vh
 *
 * @param {string}  heroFramesDir        - e.g. '/frames/hero'
 * @param {number}  heroTotalFrames      - frame count for hero video
 * @param {number}  heroHeightVh         - height of hero scroll portion in vh units
 * @param {string}  section2FramesDir    - e.g. '/frames/section2'
 * @param {number}  section2TotalFrames  - frame count for section2 video
 * @param {number}  totalHeightVh        - total container height in vh (hero + vision)
 * @param {React.RefObject} containerRef - ref to the outer scroll-story section
 * @param {function} onHeroProgress      - called with hero local progress [0,1]
 * @param {function} onVisionProgress    - called with vision local progress [0,1]
 */
export function useDualScrollAnimation({
  heroFramesDir,
  heroTotalFrames,
  heroHeightVh,
  section2FramesDir,
  section2TotalFrames,
  totalHeightVh,
  containerRef,
  onHeroProgress,
  onVisionProgress,
}) {
  const canvasRef = useRef(null)
  const heroImagesRef = useRef([])
  const section2ImagesRef = useRef([])
  const rafRef = useRef(null)

  const drawFrame = useCallback((images, frameIndex) => {
    const canvas = canvasRef.current
    if (!canvas || !images[frameIndex]) return
    const img = images[frameIndex]
    if (!img || img.naturalWidth === 0) return

    // Resize canvas buffer to match the incoming frame's native dimensions.
    // This ensures the cover-crop math is always correct regardless of which
    // video source is active (Hero.mp4 may differ from Section2.mp4).
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
    }

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }, [])

  // Preload hero frames
  useEffect(() => {
    if (heroTotalFrames === 0) return
    const images = []
    let loaded = 0
    for (let i = 1; i <= heroTotalFrames; i++) {
      const img = new Image()
      img.src = `${heroFramesDir}/frame_${String(i).padStart(4, '0')}.jpg`
      img.onload = img.onerror = () => {
        loaded++
        if (loaded === heroTotalFrames) drawFrame(images, 0)
      }
      images.push(img)
    }
    heroImagesRef.current = images
  }, [heroFramesDir, heroTotalFrames, drawFrame])

  // Preload section2 frames (skipped when section2TotalFrames === 0)
  useEffect(() => {
    if (section2TotalFrames === 0) {
      section2ImagesRef.current = []
      return
    }
    const images = []
    let loaded = 0
    for (let i = 1; i <= section2TotalFrames; i++) {
      const img = new Image()
      img.src = `${section2FramesDir}/frame_${String(i).padStart(4, '0')}.jpg`
      img.onload = img.onerror = () => { loaded++ }
      images.push(img)
    }
    section2ImagesRef.current = images
  }, [section2FramesDir, section2TotalFrames])

  // Scroll → frame mapping
  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    // heroRatio: fraction of total scrollable distance that belongs to hero phase
    // scrollable for hero  = (heroHeightVh - 100) vh
    // scrollable for total = (totalHeightVh - 100) vh
    const heroRatio = (heroHeightVh - 100) / (totalHeightVh - 100)

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const scrolled = -rect.top
      const scrollable = container.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / scrollable))

      let frameImages, frameIndex

      if (progress <= heroRatio) {
        // Hero phase
        const heroLocal = heroRatio > 0 ? progress / heroRatio : 0
        onHeroProgress?.(heroLocal)
        onVisionProgress?.(0)
        frameIndex = Math.min(
          Math.floor(heroLocal * heroTotalFrames),
          heroTotalFrames - 1
        )
        frameImages = heroImagesRef.current
      } else {
        // Vision phase
        const visionLocal = (1 - heroRatio) > 0
          ? (progress - heroRatio) / (1 - heroRatio)
          : 0
        onHeroProgress?.(1)
        onVisionProgress?.(visionLocal)

        if (section2TotalFrames === 0) {
          // No section2 frames yet — freeze on last hero frame
          frameIndex = heroTotalFrames - 1
          frameImages = heroImagesRef.current
        } else {
          frameIndex = Math.min(
            Math.floor(visionLocal * section2TotalFrames),
            section2TotalFrames - 1
          )
          frameImages = section2ImagesRef.current
        }
      }

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(frameImages, frameIndex)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [
    containerRef,
    heroHeightVh,
    totalHeightVh,
    heroTotalFrames,
    section2TotalFrames,
    drawFrame,
    onHeroProgress,
    onVisionProgress,
  ])

  return { canvasRef }
}
