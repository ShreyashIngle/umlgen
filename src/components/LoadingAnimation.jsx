import { motion } from 'framer-motion'

export default function LoadingAnimation({ isDarkMode, message = 'Generating diagram...' }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div className="relative w-24 h-24 mb-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-full ${
              isDarkMode ? 'border-cyan-500' : 'border-indigo-500'
            } border-4 border-t-transparent`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5 - i * 0.3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2
            }}
            style={{ opacity: 1 - i * 0.3 }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡
        </motion.div>
      </motion.div>

      <motion.p
        className={cn(
          'text-lg font-semibold',
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        )}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>

      <motion.div className="flex gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full',
              isDarkMode ? 'bg-cyan-500' : 'bg-indigo-500'
            )}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
