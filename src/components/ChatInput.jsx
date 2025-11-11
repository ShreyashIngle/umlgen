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
      const newHeight = Math.min(textarea.scrollHeight, compact ? 80 : 120)
      textarea.style.height = newHeight + 'px'
    }
  }, [input, compact])

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'border-t backdrop-blur-md flex-shrink-0 sticky bottom-0',
        isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Type a message...'}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full rounded-xl border-2 resize-none transition-all duration-200 font-medium overflow-y-auto',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 focus:border-cyan-500 text-gray-100 placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2',
              isDarkMode ? 'focus:ring-cyan-500/20' : 'focus:ring-indigo-500/20',
              disabled && 'opacity-50 cursor-not-allowed',
              compact ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base',
              !compact && 'pr-10'
            )}
            style={{
              maxHeight: compact ? '80px' : '120px',
              minHeight: compact ? '36px' : '44px'
            }}
          />
          {!compact && (
            <Sparkles
              size={18}
              className={cn(
                'absolute right-3 top-3 pointer-events-none',
                isDarkMode ? 'text-cyan-500/50' : 'text-indigo-500/50'
              )}
            />
          )}
        </div>

        <motion.button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            'rounded-xl font-semibold transition-all duration-200 shadow-md flex-shrink-0',
            !disabled && input.trim()
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white hover:shadow-lg'
              : isDarkMode
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            compact ? 'p-2' : 'p-2.5'
          )}
          whileHover={!disabled && input.trim() ? { scale: 1.05 } : {}}
          whileTap={!disabled && input.trim() ? { scale: 0.95 } : {}}
        >
          <Send size={compact ? 16 : 18} />
        </motion.button>
      </div>
    </form>
  )
}
