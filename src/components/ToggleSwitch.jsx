import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export default function ToggleSwitch({ checked, onChange, isDarkMode, label }) {
  return (
    <motion.div
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-300',
        checked
          ? isDarkMode
            ? 'border-green-700/50 bg-green-900/20'
            : 'border-green-200 bg-green-50/30'
          : isDarkMode
          ? 'border-gray-700 bg-gray-900/30'
          : 'border-gray-200 bg-gray-100/30'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={cn(
          'w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300',
          checked
            ? 'bg-green-500 border-green-600'
            : isDarkMode
            ? 'border-gray-600 bg-gray-800'
            : 'border-gray-300 bg-white'
        )}
        animate={{ scale: checked ? 1.1 : 1 }}
      >
        {checked && <div className="w-3 h-3 bg-white rounded-sm" />}
      </motion.div>
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  )
}
