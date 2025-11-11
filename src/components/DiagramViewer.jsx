import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Code2, Copy, Download, Eye, Maximize2, X } from 'lucide-react'
import { encode } from 'plantuml-encoder'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { cn } from '../utils/cn'
import Button from './Button'
import Card from './Card'

export default function DiagramViewer({
  plantUMLCode,
  isLoading,
  onCodeChange,
  isDarkMode,
  onNewDiagram,
  fullScreen = false
}) {
  const [showCode, setShowCode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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
    <>
      {/* Fullscreen Modal - Shows either Preview or Code based on tab */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Fullscreen Header */}
            <motion.div
              className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-xl p-4 flex items-center justify-between sticky top-0 z-10 shadow-lg`}
              initial={{ y: -50 }}
              animate={{ y: 0 }}
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {showCode ? '📝 Code Editor' : '🎨 Diagram Preview'}
                </h2>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${showCode ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  Fullscreen
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                {/* Tab Switcher in Fullscreen */}
                <div className={`flex gap-1 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <button
                    onClick={() => setShowCode(false)}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 ${
                      !showCode
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDarkMode
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => setShowCode(true)}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 ${
                      showCode
                        ? isDarkMode
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-500 text-white'
                        : isDarkMode
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Code2 size={16} />
                    Code
                  </button>
                </div>

                {diagramUrl && !showCode && (
                  <motion.div className="flex gap-2">
                    <Button
                      onClick={handleDownloadPNG}
                      variant="success"
                      size="sm"
                    >
                      <Download size={16} />
                      PNG
                    </Button>
                    <Button
                      onClick={handleDownloadSVG}
                      variant="success"
                      size="sm"
                    >
                      <Download size={16} />
                      SVG
                    </Button>
                  </motion.div>
                )}

                {showCode && plantUMLCode && (
                  <Button
                    onClick={handleCopyCode}
                    variant="primary"
                    size="sm"
                  >
                    <Copy size={16} />
                    Copy
                  </Button>
                )}

                <Button
                  onClick={() => setIsFullscreen(false)}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <X size={24} />
                </Button>
              </div>
            </motion.div>

            {/* Fullscreen Content */}
            <AnimatePresence mode="wait">
              {!showCode ? (
                // Fullscreen Preview
                <motion.div
                  key="fs-preview"
                  className="flex-1 overflow-auto flex items-center justify-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isLoading ? (
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
                  ) : diagramUrl ? (
                    <motion.div
                      className="flex items-center justify-center w-full h-full"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.img
                        src={diagramUrl}
                        alt="UML Diagram Full Preview"
                        className="max-w-full max-h-full rounded-xl shadow-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div className="text-center">
                      <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">
                        🎨
                      </motion.div>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        No diagram yet
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                // Fullscreen Code Editor
                <motion.div
                  key="fs-code"
                  className="flex-1 flex flex-col p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <textarea
                    value={plantUMLCode}
                    onChange={(e) => onCodeChange(e.target.value)}
                    placeholder="PlantUML code appears here..."
                    className={`flex-1 w-full px-6 py-4 rounded-xl border-2 font-mono text-base ${
                      isDarkMode
                        ? 'border-gray-700 bg-gray-900 text-gray-100'
                        : 'border-gray-300 bg-white text-gray-900'
                    } focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition resize-none shadow-xl`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <Card isDarkMode={isDarkMode} className={cn(
        "shadow-2xl w-full flex flex-col",
        fullScreen && "rounded-2xl"
      )}>
        {/* Header - Fixed */}
        <motion.div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4 flex-shrink-0`}>
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {onNewDiagram && (
                <Button
                  onClick={onNewDiagram}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-red-500/20 flex-shrink-0"
                >
                  <ArrowLeft size={20} />
                </Button>
              )}
              <div className="min-w-0">
                <h2 className="text-lg font-bold truncate">
                  {fullScreen ? '🎨 Full Screen Diagram' : 'Diagram Viewer'}
                </h2>
                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {showCode ? 'Edit PlantUML code' : fullScreen ? 'Scroll to view large diagrams' : 'Preview your diagram'}
                </p>
              </div>
            </div>
            <motion.div className="flex gap-2 flex-shrink-0">
              {!fullScreen && (
                <Button
                  onClick={() => setIsFullscreen(true)}
                  variant="primary"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <Maximize2 size={16} />
                  <span className="hidden sm:inline">Expand</span>
                </Button>
              )}
              {diagramUrl && !showCode && (
                <>
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
                </>
              )}
              {showCode && plantUMLCode && (
                <Button
                  onClick={handleCopyCode}
                  variant="primary"
                  size="sm"
                >
                  <Copy size={16} />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
              )}
              {/* Add expand button for both code and preview modes */}
              <Button
                onClick={() => setIsFullscreen(true)}
                variant="ghost"
                size="sm"
                className="p-2"
                title={`Expand ${showCode ? 'code editor' : 'preview'} to fullscreen`}
              >
                <Maximize2 size={16} />
              </Button>
            </motion.div>
          </div>

          {/* Tab Buttons - Full Width */}
          <motion.div className={`flex gap-0 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} -mx-4 px-4`}>
            <motion.button
              onClick={() => setShowCode(false)}
              className={`flex-1 px-4 py-2 font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                !showCode
                  ? 'border-blue-500 text-blue-500'
                  : isDarkMode
                  ? 'border-transparent text-gray-400'
                  : 'border-transparent text-gray-500'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <Eye size={18} />
              <span>Preview</span>
            </motion.button>
            <motion.button
              onClick={() => setShowCode(true)}
              className={`flex-1 px-4 py-2 font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                showCode
                  ? 'border-purple-500 text-purple-500'
                  : isDarkMode
                  ? 'border-transparent text-gray-400'
                  : 'border-transparent text-gray-500'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <Code2 size={18} />
              <span>Code</span>
            </motion.button>
            {/* Add expand button in tab bar */}
            <motion.button
              onClick={() => setIsFullscreen(true)}
              className={`px-4 py-2 font-semibold flex items-center justify-center gap-2 border-b-2 border-transparent transition ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              title="Expand to fullscreen"
            >
              <Maximize2 size={18} />
              <span className="hidden md:inline">Expand</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Content - Scrollable with minimum height */}
        <div className="w-full" style={{ minHeight: fullScreen ? '600px' : '500px' }}>
          <AnimatePresence mode="wait">
            {!showCode && (
              <motion.div
                key="preview"
                className={cn(
                  "w-full",
                  fullScreen ? "p-8" : "p-6"
                )}
                style={{ minHeight: fullScreen ? '600px' : '500px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isLoading ? (
                  <motion.div className="h-full flex items-center justify-center" style={{ minHeight: '400px' }}>
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
                  <div
                    className={cn(
                      "w-full rounded-xl border-2 p-4",
                      isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-100/50'
                    )}
                    style={{ 
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      minHeight: '400px'
                    }}
                  >
                    <motion.img
                      src={diagramUrl}
                      alt="UML Diagram"
                      className="rounded-lg shadow-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{ 
                        maxWidth: 'none',
                        width: 'auto',
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    />
                  </div>
                ) : (
                  <motion.div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <motion.div className="text-center">
                      <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">
                        🎨
                      </motion.div>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        No diagram yet
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {showCode && (
              <motion.div
                key="code"
                className="flex flex-col gap-3 p-6"
                style={{ minHeight: fullScreen ? '600px' : '500px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  onClick={handleCopyCode}
                  disabled={!plantUMLCode}
                  variant={plantUMLCode ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-fit flex-shrink-0"
                >
                  <Copy size={16} />
                  Copy Code
                </Button>

                <div className="flex-1" style={{ minHeight: '450px' }}>
                  <textarea
                    value={plantUMLCode}
                    onChange={(e) => onCodeChange(e.target.value)}
                    placeholder="PlantUML code appears here..."
                    className={`w-full h-full px-4 py-3 rounded-lg border-2 font-mono text-sm ${
                      isDarkMode
                        ? 'border-gray-700 bg-gray-900/50 text-gray-100'
                        : 'border-gray-200 bg-white/50 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition resize-none`}
                    style={{ 
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      minHeight: '450px'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </>
  )
}
