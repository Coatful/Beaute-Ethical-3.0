import { useEffect, useRef, useCallback } from 'react'

/**
 * Preloads frames and maps scroll position to frame index.
 *
 * @param {Object} options
 * @param {string} options.framesDir - Base URL path to frames dir (e.g. '/frames/hero')
 * @param {number} options.totalFrames - Total number of frames
 * @param {React.RefObject} options.containerRef - Ref to the scroll container element
 * @param {function} options.onProgress - Called with progress [0,1] on scroll
 * @returns {{ canvasRef, imagesRef, isLoadedRef }}
 */
export function useScrollAnimation({ framesDir, totalFrames, containerRef, onProgress }) {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const isLoadedRef = useRef(false)
  const rafRef = useRef(null)
  const currentFrameRef = useRef(0)

  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current
    const images = imagesRef.current
    if (!canvas || !images[frameIndex]) return

    const ctx = canvas.getContext('2d')
    const img = images[frameIndex]

    // Guard against broken/unloaded images
    if (!img || img.naturalWidth === 0) return

    // Fit image to canvas maintaining aspect ratio (cover)
    const canvasAspect = canvas.width / canvas.height
    const imgAspect = img.naturalWidth / img.naturalHeight

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight

    if (imgAspect > canvasAspect) {
      // Image is wider — crop sides
      sw = img.naturalHeight * canvasAspect
      sx = (img.naturalWidth - sw) / 2
    } else {
      // Image is taller — crop top/bottom
      sh = img.naturalWidth / canvasAspect
      sy = (img.naturalHeight - sh) / 2
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
  }, [])

  // Preload all frames
  useEffect(() => {
    if (totalFrames === 0) return

    const images = []
    let loadedCount = 0

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image()
      const paddedIndex = String(i).padStart(4, '0')
      img.src = `${framesDir}/frame_${paddedIndex}.jpg`
      img.onload = () => {
        loadedCount++
        if (loadedCount === totalFrames) {
          isLoadedRef.current = true
          // Draw first frame immediately
          drawFrame(0)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === totalFrames) {
          isLoadedRef.current = true
        }
      }
      images.push(img)
    }
    imagesRef.current = images

    return () => {
      isLoadedRef.current = false
    }
  }, [framesDir, totalFrames, drawFrame])

  // Scroll handler
  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const viewportHeight = window.innerHeight

      // Progress: 0 when container top hits viewport top, 1 when container bottom hits viewport bottom
      const scrolled = -rect.top
      const scrollable = containerHeight - viewportHeight
      const progress = Math.max(0, Math.min(1, scrolled / scrollable))

      const targetFrame = Math.min(
        Math.floor(progress * totalFrames),
        totalFrames - 1
      )

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          drawFrame(targetFrame)
          onProgress?.(progress)
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef, totalFrames, drawFrame, onProgress])

  return { canvasRef, imagesRef, isLoadedRef }
}
