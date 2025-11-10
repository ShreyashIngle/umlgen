import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const Select = forwardRef(({ className, isDarkMode, options, ...props }, ref) => (
  <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
    <select
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 appearance-none cursor-pointer',
        isDarkMode
          ? 'border-gray-700 bg-gray-900/50 focus:border-green-500'
          : 'border-gray-200 bg-white/50 focus:border-green-500',
        'focus:outline-none focus:ring-2 focus:ring-green-500/20 pr-10',
        className
      )}
      {...props}
    >
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" size={18} />
  </motion.div>
))

Select.displayName = 'Select'

export default Select
