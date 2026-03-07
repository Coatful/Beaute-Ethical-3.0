import { useScrollAnimation } from '../hooks/useScrollAnimation.js'
import '../styles/section2-canvas.css'

// Update to match actual Section2.mp4 frame count after ffmpeg extraction
const TOTAL_FRAMES = 241

export default function Section2Canvas({ containerRef }) {
  const { canvasRef } = useScrollAnimation({
    framesDir: `${import.meta.env.BASE_URL}frames/section2`,
    totalFrames: TOTAL_FRAMES,
    containerRef,
  })

  return (
    <div className="section2-canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="section2-canvas"
        width={1280}
        height={720}
      />
    </div>
  )
}
