import { useRef } from 'react'
import { useGSAPHover } from '../hooks/useGSAP'
import { cn } from '../utils/cn'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  ...props
}) {
  const ref = useRef(null)
  const { handleMouseEnter, handleMouseLeave } = useGSAPHover(ref)

  const variants = {
    primary: 'gradient-btn text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full spin-smooth" />}
      {children}
    </button>
  )
}
