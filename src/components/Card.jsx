import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { cn } from '../utils/cn'

export default function Card({ children, className, isDarkMode, hoverable = false }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [isDarkMode])

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border-2 backdrop-blur-md shadow-xl transition-all duration-300',
        isDarkMode
          ? 'border-gray-800/50 bg-gray-900/40'
          : 'border-blue-200/50 bg-white/40',
        hoverable && 'cursor-pointer hover:shadow-2xl hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  )
}
