import { useEffect, useRef } from 'react'
import { cn } from '../../../utils/cn'

export const BubbleBackground = ({ interactive = true, className }) => {
  const containerRef = useRef(null)
  const bubblesRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const bubbles = []
    const bubbleCount = 20

    // Create bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div')
      const size = Math.random() * 60 + 20
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 20 + 10
      const delay = Math.random() * 5

      bubble.className = 'absolute rounded-full opacity-20 blur-xl'
      bubble.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5));
        animation: float-bubble ${duration}s infinite ease-in-out ${delay}s;
        pointer-events: none;
      `

      container.appendChild(bubble)
      bubbles.push({
        element: bubble,
        size,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      })
    }

    bubblesRef.current = bubbles

    // Add keyframe animation
    if (!document.getElementById('bubble-animation')) {
      const style = document.createElement('style')
      style.id = 'bubble-animation'
      style.textContent = `
        @keyframes float-bubble {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-30px) translateX(20px);
          }
          50% {
            transform: translateY(-60px) translateX(-20px);
          }
          75% {
            transform: translateY(-30px) translateX(20px);
          }
        }
      `
      document.head.appendChild(style)
    }

    // Interactive mouse tracking
    const handleMouseMove = (e) => {
      if (!interactive || !container) return

      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      bubbles.forEach((bubble) => {
        const bubbleX = (bubble.x / 100) * rect.width
        const bubbleY = (bubble.y / 100) * rect.height
        const distance = Math.sqrt(
          Math.pow(mouseX - bubbleX, 2) + Math.pow(mouseY - bubbleY, 2)
        )

        if (distance < 150) {
          const angle = Math.atan2(bubbleY - mouseY, bubbleX - mouseX)
          const force = (150 - distance) / 150
          bubble.element.style.transform = `translate(${Math.cos(angle) * force * 50}px, ${Math.sin(angle) * force * 50}px)`
        } else {
          bubble.element.style.transform = ''
        }
      })
    }

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', () => {
        bubbles.forEach((bubble) => {
          bubble.element.style.transform = ''
        })
      })
    }

    return () => {
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [interactive])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden',
        className
      )}
    />
  )
}
