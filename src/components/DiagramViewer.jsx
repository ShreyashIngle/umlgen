import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Code2, Copy, Download, Eye } from 'lucide-react'
import { encode } from 'plantuml-encoder'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Button from './Button'
import Card from './Card'

export default function DiagramViewer({
  plantUMLCode,
  isLoading,
  onCodeChange,
  isDarkMode,
  onNewDiagram
}) {
  const [showCode, setShowCode] = useState(false)

  // Encode PlantUML code to generate diagram URL
  const diagramUrl = useMemo(() => {
    if (!plantUMLCode.trim()) return null
    try {
      const encoded = encode(plantUMLCode)
      return `https://www.plantuml.com/plantuml/png/${encoded}`
    } catch (err) {
      console.error('Encoding error:', err)
      return null
    }
  }, [plantUMLCode])

  // Handle code copy
  const handleCopyCode = () => {
    navigator.clipboard.writeText(plantUMLCode)
    toast.success('Code copied to clipboard!')
  }

  // Handle PNG download
  const handleDownloadPNG = async () => {
    if (!diagramUrl) return
    try {
      const response = await fetch(diagramUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'uml-diagram.png'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('PNG downloaded successfully!')
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to download PNG')
    }
  }

  // Handle SVG download
  const handleDownloadSVG = async () => {
    if (!plantUMLCode.trim()) return
    try {
      const encoded = encode(plantUMLCode)
      const svgUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`
      const response = await fetch(svgUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'uml-diagram.svg'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('SVG downloaded successfully!')
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to download SVG')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <Card isDarkMode={isDarkMode} className="shadow-2xl h-full flex flex-col overflow-hidden p-0">
      {/* Header */}
      <motion.div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`} variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {onNewDiagram && (
              <Button
                onClick={onNewDiagram}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
            )}
            <h2 className="text-xl font-bold">Diagram Viewer</h2>
          </div>
          {diagramUrl && (
            <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                onClick={handleDownloadPNG}
                variant="success"
                size="sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">PNG</span>
              </Button>
              <Button
                onClick={handleDownloadSVG}
                variant="success"
                size="sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">SVG</span>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Tab Buttons */}
        <motion.div className={`flex gap-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} variants={itemVariants}>
          <motion.button
            onClick={() => setShowCode(false)}
            className={`px-4 py-2 font-semibold flex items-center gap-2 border-b-2 transition ${
              !showCode
                ? 'border-blue-500 text-blue-500'
                : isDarkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={18} />
            <span className="hidden sm:inline">Preview</span>
          </motion.button>
          <motion.button
            onClick={() => setShowCode(true)}
            className={`px-4 py-2 font-semibold flex items-center gap-2 border-b-2 transition ${
              showCode
                ? 'border-purple-500 text-purple-500'
                : isDarkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Code2 size={18} />
            <span className="hidden sm:inline">Code</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* Preview Tab */}
        {!showCode && (
          <motion.div
            key="preview"
            className="flex-1 flex flex-col p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <motion.div className="flex-1 flex items-center justify-center">
                <motion.div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-6xl mb-4"
                  >
                    ⚡
                  </motion.div>
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Drawing your diagram...
                  </motion.p>
                </motion.div>
              </motion.div>
            ) : diagramUrl ? (
              <motion.div
                className={`flex-1 rounded-xl border-2 ${isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-100/50'} p-4 flex items-center justify-center overflow-auto`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.img
                  src={diagramUrl}
                  alt="Generated UML Diagram"
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                />
              </motion.div>
            ) : (
              <motion.div className="flex-1 flex items-center justify-center">
                <motion.div className="text-center">
                  <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">
                    🎨
                  </motion.div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Generate a diagram to see the preview
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Code Tab */}
        {showCode && (
          <motion.div
            key="code"
            className="flex-1 flex flex-col gap-3 p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleCopyCode}
              disabled={!plantUMLCode}
              variant={plantUMLCode ? 'primary' : 'secondary'}
              size="sm"
              className="w-fit"
            >
              <Copy size={16} />
              Copy Code
            </Button>

            <textarea
              value={plantUMLCode}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="Generated PlantUML code will appear here. Edit it manually to update the diagram."
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-mono text-sm ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-900/50 focus:border-purple-500'
                  : 'border-gray-200 bg-white/50 focus:border-purple-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition resize-none`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
