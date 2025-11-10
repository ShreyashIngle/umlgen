import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const Textarea = forwardRef(({ className, isDarkMode, ...props }, ref) => (
  <motion.textarea
    ref={ref}
    className={cn(
      'w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 resize-none',
      isDarkMode
        ? 'border-gray-700 bg-gray-900/50 focus:border-purple-500'
        : 'border-gray-200 bg-white/50 focus:border-purple-500',
      'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
      className
    )}
    whileFocus={{ scale: 1.01 }}
    {...props}
  />
))

Textarea.displayName = 'Textarea'

export default Textarea
