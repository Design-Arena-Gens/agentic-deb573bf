'use client'

import { useEffect, useRef } from 'react'
import styles from './page.module.css'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrame: number
    let carX = -200
    let cameraOffset = 0

    // Particle system for film grain
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    class Particle {
      x: number
      y: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.opacity = Math.random() * 0.3
      }

      update() {
        this.opacity = Math.random() * 0.3
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < 800; i++) {
      particles.push(new Particle())
    }

    // Child positions
    const children = [
      { x: 800, y: 0, speed: 0.3 },
      { x: 950, y: 0, speed: 0.25 },
      { x: 1100, y: 0, speed: 0.35 }
    ]

    function drawSky(ctx: CanvasRenderingContext2D) {
      // Golden hour gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.6)
      gradient.addColorStop(0, '#FFB347')
      gradient.addColorStop(0.3, '#FFCC99')
      gradient.addColorStop(1, '#87CEEB')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.6)
    }

    function drawGround(ctx: CanvasRenderingContext2D) {
      // Road
      ctx.fillStyle = '#4A4A4A'
      ctx.fillRect(0, canvasHeight * 0.6, canvasWidth, canvasHeight * 0.4)

      // Road lines
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 3
      ctx.setLineDash([30, 30])
      ctx.beginPath()
      ctx.moveTo(0, canvasHeight * 0.7)
      ctx.lineTo(canvasWidth, canvasHeight * 0.7)
      ctx.stroke()
      ctx.setLineDash([])

      // Lawns
      for (let i = -200; i < canvasWidth + 200; i += 350) {
        const lawnX = i - cameraOffset * 0.7
        // Left side lawns
        ctx.fillStyle = '#4CAF50'
        ctx.fillRect(lawnX, canvasHeight * 0.45, 250, canvasHeight * 0.15)

        // Right side lawns
        ctx.fillRect(lawnX + 100, canvasHeight * 0.75, 250, canvasHeight * 0.25)
      }
    }

    function drawTrees(ctx: CanvasRenderingContext2D) {
      for (let i = 0; i < canvasWidth + 400; i += 200) {
        const treeX = i - cameraOffset * 0.6

        // Left side trees
        ctx.fillStyle = '#654321'
        ctx.fillRect(treeX - 10, canvasHeight * 0.35, 20, 100)
        ctx.beginPath()
        ctx.fillStyle = '#228B22'
        ctx.arc(treeX, canvasHeight * 0.35, 40, 0, Math.PI * 2)
        ctx.fill()

        // Right side trees
        ctx.fillStyle = '#654321'
        ctx.fillRect(treeX + 100, canvasHeight * 0.72, 20, 80)
        ctx.beginPath()
        ctx.fillStyle = '#2E7D32'
        ctx.arc(treeX + 110, canvasHeight * 0.72, 35, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawFences(ctx: CanvasRenderingContext2D) {
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 4

      for (let i = -100; i < canvasWidth + 200; i += 40) {
        const fenceX = i - cameraOffset * 0.8

        // Left side fences
        ctx.beginPath()
        ctx.moveTo(fenceX, canvasHeight * 0.52)
        ctx.lineTo(fenceX, canvasHeight * 0.57)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(fenceX, canvasHeight * 0.54)
        ctx.lineTo(fenceX + 40, canvasHeight * 0.54)
        ctx.stroke()

        // Right side fences
        ctx.beginPath()
        ctx.moveTo(fenceX + 50, canvasHeight * 0.78)
        ctx.lineTo(fenceX + 50, canvasHeight * 0.82)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(fenceX + 50, canvasHeight * 0.8)
        ctx.lineTo(fenceX + 90, canvasHeight * 0.8)
        ctx.stroke()
      }
    }

    function drawCar(ctx: CanvasRenderingContext2D) {
      const carY = canvasHeight * 0.62

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(carX + 80, carY + 55, 90, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Car body
      ctx.fillStyle = '#DC143C'
      ctx.fillRect(carX, carY, 160, 40)
      ctx.fillRect(carX + 30, carY - 30, 100, 30)

      // Chrome details
      ctx.fillStyle = '#C0C0C0'
      ctx.fillRect(carX - 5, carY + 15, 10, 10)
      ctx.fillRect(carX + 155, carY + 15, 10, 10)

      // Windows
      ctx.fillStyle = '#87CEEB'
      ctx.globalAlpha = 0.6
      ctx.fillRect(carX + 35, carY - 25, 40, 20)
      ctx.fillRect(carX + 85, carY - 25, 40, 20)
      ctx.globalAlpha = 1

      // Wheels
      ctx.fillStyle = '#2C2C2C'
      ctx.beginPath()
      ctx.arc(carX + 35, carY + 40, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(carX + 125, carY + 40, 15, 0, Math.PI * 2)
      ctx.fill()

      // Hubcaps
      ctx.fillStyle = '#C0C0C0'
      ctx.beginPath()
      ctx.arc(carX + 35, carY + 40, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(carX + 125, carY + 40, 7, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawChildren(ctx: CanvasRenderingContext2D) {
      children.forEach(child => {
        const childX = child.x - cameraOffset * 0.5
        const childY = canvasHeight * 0.52

        // Simple stick figure child
        ctx.strokeStyle = '#FF6B6B'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'

        // Head
        ctx.beginPath()
        ctx.arc(childX, childY, 8, 0, Math.PI * 2)
        ctx.fillStyle = '#FFD1A3'
        ctx.fill()
        ctx.stroke()

        // Body
        ctx.beginPath()
        ctx.moveTo(childX, childY + 8)
        ctx.lineTo(childX, childY + 25)
        ctx.stroke()

        // Arms (running position)
        const armOffset = Math.sin(child.x * 0.05) * 10
        ctx.beginPath()
        ctx.moveTo(childX, childY + 12)
        ctx.lineTo(childX - 8, childY + 20 + armOffset)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(childX, childY + 12)
        ctx.lineTo(childX + 8, childY + 20 - armOffset)
        ctx.stroke()

        // Legs (running position)
        ctx.beginPath()
        ctx.moveTo(childX, childY + 25)
        ctx.lineTo(childX - 6, childY + 40 - armOffset)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(childX, childY + 25)
        ctx.lineTo(childX + 6, childY + 40 + armOffset)
        ctx.stroke()

        // Animate running
        child.x += child.speed
        if (child.x - cameraOffset > canvasWidth + 100) {
          child.x = cameraOffset - 100
        }
      })
    }

    function drawFilmGrain(ctx: CanvasRenderingContext2D) {
      particles.forEach(particle => {
        particle.update()
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fillRect(particle.x, particle.y, 1, 1)
      })
    }

    function drawLensFlare(ctx: CanvasRenderingContext2D) {
      const flareX = canvasWidth * 0.3
      const flareY = canvasHeight * 0.2

      const gradient = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 200)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(0.3, 'rgba(255, 230, 150, 0.15)')
      gradient.addColorStop(1, 'rgba(255, 200, 100, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }

    function drawVignette(ctx: CanvasRenderingContext2D) {
      const gradient = ctx.createRadialGradient(
        canvasWidth / 2,
        canvasHeight / 2,
        canvasHeight * 0.3,
        canvasWidth / 2,
        canvasHeight / 2,
        canvasHeight * 0.8
      )
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }

    function animate() {
      if (!ctx) return

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      drawSky(ctx)
      drawGround(ctx)
      drawTrees(ctx)
      drawFences(ctx)
      drawChildren(ctx)
      drawCar(ctx)
      drawLensFlare(ctx)
      drawFilmGrain(ctx)
      drawVignette(ctx)

      // Move car and camera
      carX += 1.2
      cameraOffset += 0.8

      if (carX > canvasWidth + 200) {
        carX = -200
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay}>
        <h1>1960s Suburban Dream</h1>
        <p>A cinematic journey through infinite peace</p>
      </div>
    </main>
  )
}
