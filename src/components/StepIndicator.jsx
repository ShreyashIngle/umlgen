import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export default function StepIndicator({ step, totalSteps, isDarkMode }) {
  return (
    <div className="flex gap-2">
      {[...Array(totalSteps)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'h-1 rounded-full transition-all duration-300',
            i < step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
          )}
          initial={{ width: '0px' }}
          animate={{ width: i < step ? '40px' : '20px' }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}
