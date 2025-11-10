import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export default function Card({ children, className, isDarkMode, hoverable = false }) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl border-2 backdrop-blur-md shadow-xl',
        isDarkMode
          ? 'border-gray-800/50 bg-gray-900/40'
          : 'border-blue-200/50 bg-white/40',
        hoverable && 'cursor-pointer hover:shadow-2xl transition-shadow',
        className
      )}
      whileHover={hoverable ? { y: -5 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
