import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../utils/cn'

export default function ChatInput({ onSend, disabled, isDarkMode, placeholder, compact = false }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 120)
      textarea.style.height = newHeight + 'px'
    }
  }, [input])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn(
        'border-t backdrop-blur-md',
        isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200',
        compact ? 'p-3' : 'p-4'
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <motion.textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder={placeholder || 'Type a message...'}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full rounded-2xl border-2 resize-none transition-all duration-300 font-medium scrollbar-thin scrollbar-thumb-gray-600 max-h-40',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 focus:border-cyan-500 focus:bg-gray-800'
                : 'bg-gray-50 border-gray-300 focus:border-indigo-500 focus:bg-white',
              'focus:outline-none focus:ring-4',
              isDarkMode ? 'focus:ring-cyan-500/20' : 'focus:ring-indigo-500/20',
              disabled && 'opacity-50 cursor-not-allowed',
              compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'
            )}
            whileFocus={{ scale: 1.01 }}
          />
          {!compact && (
            <Sparkles
              size={20}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none',
                isDarkMode ? 'text-cyan-500' : 'text-indigo-500'
              )}
            />
          )}
        </div>

        <motion.button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            'rounded-xl font-semibold transition-all duration-300 shadow-lg flex-shrink-0',
            !disabled && input.trim()
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white'
              : isDarkMode
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            compact ? 'p-2' : 'p-3'
          )}
          whileHover={!disabled && input.trim() ? { scale: 1.05 } : {}}
          whileTap={!disabled && input.trim() ? { scale: 0.95 } : {}}
        >
          <Send size={compact ? 16 : 20} />
        </motion.button>
      </div>
    </motion.form>
  )
}
