'use client'

import { useEffect, useRef } from 'react'

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Enhanced star data
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 ? '#87CEEB' : Math.random() > 0.6 ? '#FFD700' : '#ffffff'
    }))

    // Shooting stars
    const shootingStars: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      trail: Array<{x: number, y: number, opacity: number}>
    }> = []

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create enhanced gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      )
      gradient.addColorStop(0, '#1b2735')
      gradient.addColorStop(0.5, '#16213e')
      gradient.addColorStop(1, '#090a0f')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw enhanced stars
      stars.forEach(star => {
        ctx.save()
        
        // Twinkle effect
        const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        ctx.globalAlpha = star.opacity * twinkle
        
        // Star glow
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        )
        glowGradient.addColorStop(0, star.color)
        glowGradient.addColorStop(0.5, star.color + '80')
        glowGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2)
        ctx.fill()
        
        // Star core
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Occasional bright flash
        if (Math.random() < 0.005) {
          ctx.globalAlpha = star.opacity * 3
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.restore()

        // Move stars
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Generate shooting stars
      if (Math.random() < 0.02) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: 0,
          vx: (Math.random() - 0.5) * 8 + 2,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 2 + 1,
          opacity: 1,
          trail: []
        })
      }

      // Draw shooting stars
      shootingStars.forEach((star, index) => {
        ctx.save()
        
        // Draw trail
        star.trail.forEach((point, trailIndex) => {
          ctx.globalAlpha = point.opacity
          ctx.fillStyle = '#87CEEB'
          ctx.beginPath()
          ctx.arc(point.x, point.y, star.size * (1 - trailIndex / star.trail.length), 0, Math.PI * 2)
          ctx.fill()
        })
        
        // Draw shooting star
        ctx.globalAlpha = star.opacity
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 6
        )
        glowGradient.addColorStop(0, '#87CEEB')
        glowGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 6, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
        
        // Update position and trail
        star.x += star.vx
        star.y += star.vy
        star.opacity -= 0.01
        
        // Add trail point
        star.trail.push({
          x: star.x,
          y: star.y,
          opacity: star.opacity
        })
        
        // Limit trail length
        if (star.trail.length > 10) {
          star.trail.shift()
        }
        
        // Remove old shooting stars
        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1)
        }
      })

      // Add nebula effect
      const time = Date.now() * 0.001
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * 0.5) * 100,
        canvas.height * 0.2 + Math.cos(time * 0.3) * 50,
        0,
        canvas.width * 0.3 + Math.sin(time * 0.5) * 100,
        canvas.height * 0.2 + Math.cos(time * 0.3) * 50,
        200
      )
      nebulaGradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)')
      nebulaGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)')
      nebulaGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = nebulaGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #16213e 50%, #090a0f 100%)' }}
    />
  )
} 