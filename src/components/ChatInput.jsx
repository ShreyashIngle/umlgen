import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../utils/cn'

export default function ChatInput({ onSend, disabled, isDarkMode, placeholder }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn(
        'p-4 border-t backdrop-blur-md',
        isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <motion.textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder={placeholder || 'Describe your project or diagram...'}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full px-4 py-3 pr-12 rounded-2xl border-2 resize-none transition-all duration-300 font-medium',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 focus:border-cyan-500 focus:bg-gray-750'
                : 'bg-gray-50 border-gray-300 focus:border-indigo-500 focus:bg-white',
              'focus:outline-none focus:ring-4',
              isDarkMode ? 'focus:ring-cyan-500/20' : 'focus:ring-indigo-500/20',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            whileFocus={{ scale: 1.01 }}
          />
          <Sparkles
            size={20}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              isDarkMode ? 'text-cyan-500' : 'text-indigo-500'
            )}
          />
        </div>

        <motion.button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            'p-3 rounded-xl font-semibold transition-all duration-300 shadow-lg',
            !disabled && input.trim()
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white'
              : isDarkMode
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
          whileHover={!disabled && input.trim() ? { scale: 1.05 } : {}}
          whileTap={!disabled && input.trim() ? { scale: 0.95 } : {}}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </motion.form>
  )
}
