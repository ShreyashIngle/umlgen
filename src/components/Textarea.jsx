import gsap from 'gsap'
import { forwardRef, useRef } from 'react'
import { cn } from '../utils/cn'

const Textarea = forwardRef(({ className, isDarkMode, ...props }, ref) => {
  const innerRef = useRef(null)

  const handleFocus = () => {
    if (innerRef.current) {
      gsap.to(innerRef.current, {
        scale: 1.01,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const handleBlur = () => {
    if (innerRef.current) {
      gsap.to(innerRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  return (
    <div ref={innerRef} className="w-full">
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 resize-none',
          isDarkMode
            ? 'border-gray-700 bg-gray-900/50 focus:border-purple-500'
            : 'border-gray-200 bg-white/50 focus:border-purple-500',
          'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
