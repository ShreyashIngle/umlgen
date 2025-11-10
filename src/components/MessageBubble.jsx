import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'
import { cn } from '../utils/cn'

export default function MessageBubble({ message, isUser, isTyping, isDarkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex gap-3 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <motion.div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600'
        )}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
      </motion.div>

      <motion.div
        className={cn(
          'max-w-[75%] px-4 py-3 rounded-2xl shadow-lg',
          isUser
            ? isDarkMode
              ? 'bg-indigo-900/50 border border-indigo-700/50 backdrop-blur-md'
              : 'bg-indigo-100 border border-indigo-200'
            : isDarkMode
            ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-md'
            : 'bg-white border border-gray-200'
        )}
        whileHover={{ scale: 1.02 }}
      >
        {isTyping ? (
          <TypeAnimation
            sequence={[message]}
            wrapper="p"
            cursor={false}
            speed={75}
            className="text-sm leading-relaxed"
          />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
      </motion.div>
    </motion.div>
  )
}
