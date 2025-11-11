import { forwardRef, useRef } from 'react'
import { cn } from '../utils/cn'

const Input = forwardRef(({ className, isDarkMode, icon: Icon, ...props }, ref) => {
  const innerRef = useRef(null)

  const handleFocus = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = 'scale(1.01)'
      innerRef.current.style.transition = 'transform 0.3s ease'
    }
  }

  const handleBlur = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = 'scale(1)'
    }
  }

  return (
    <div ref={innerRef} className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300',
          isDarkMode
            ? 'border-gray-700 bg-gray-900/50 focus:border-blue-500 focus:bg-gray-900'
            : 'border-gray-200 bg-white/50 focus:border-blue-500 focus:bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          Icon && 'pl-10',
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  )
})

Input.displayName = 'Input'

export default Input
