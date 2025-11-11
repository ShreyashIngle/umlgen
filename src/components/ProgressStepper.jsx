import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../utils/cn'

const steps = [
  { id: 1, label: 'Analyze', icon: '🔍' },
  { id: 2, label: 'Select Type', icon: '📊' },
  { id: 3, label: 'Generate', icon: '⚡' },
  { id: 4, label: 'Render', icon: '🎨' }
]

export default function ProgressStepper({ currentStep, isDarkMode }) {
  return (
    <div className="flex items-center justify-between w-full px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <motion.div
            className="flex flex-col items-center relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg relative z-10',
                currentStep > step.id
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                  : currentStep === step.id
                  ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg animate-pulse-glow'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                  : 'bg-gray-200 text-gray-400 border-2 border-gray-300'
              )}
              whileHover={{ scale: 1.1 }}
            >
              {currentStep > step.id ? <Check size={24} /> : step.icon}
            </motion.div>
            <motion.span
              className={cn(
                'text-xs mt-2 font-semibold',
                currentStep >= step.id
                  ? isDarkMode ? 'text-cyan-400' : 'text-indigo-600'
                  : isDarkMode ? 'text-gray-500' : 'text-gray-400'
              )}
            >
              {step.label}
            </motion.span>
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div
              className={cn(
                'flex-1 h-1 mx-2 rounded-full',
                currentStep > step.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : isDarkMode ? 'bg-gray-800' : 'bg-gray-300'
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStep > step.id ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
