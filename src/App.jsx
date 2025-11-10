import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sparkles, Sun } from 'lucide-react'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Card from './components/Card'
import ChatPanel from './components/ChatPanel'
import DiagramViewer from './components/DiagramViewer'
import { generateUMLWithGemini } from './services/geminiService'

export default function App() {
  // State management
  const [apiKey, setApiKey] = useState('')
  const [projectContext, setProjectContext] = useState('')
  const [diagramPrompt, setDiagramPrompt] = useState('')
  const [diagramType, setDiagramType] = useState('')
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const [plantUMLCode, setPlantUMLCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  // Diagram type options
  const diagramTypes = [
    'Use Case Diagram',
    'Class Diagram',
    'Sequence Diagram',
    'Activity Diagram',
    'Component Diagram',
    'Deployment Diagram',
    'State Diagram',
    'ER Diagram'
  ]

  // Handle UML generation
  const handleGenerateUML = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key')
      return
    }
    if (!projectContext.trim()) {
      setError('Please enter your project context')
      return
    }
    if (!useCustomPrompt && !diagramType) {
      setError('Please select a diagram type or enable custom prompt')
      return
    }
    if (useCustomPrompt && !diagramPrompt.trim()) {
      setError('Please enter your custom prompt')
      return
    }

    setIsLoading(true)
    setError('')
    setPlantUMLCode('')

    try {
      const finalPrompt = useCustomPrompt ? diagramPrompt : diagramType
      const code = await generateUMLWithGemini(apiKey, projectContext, finalPrompt)
      setPlantUMLCode(code)
      setHasGenerated(true)
    } catch (err) {
      setError(err.message || 'Failed to generate UML diagram')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle manual code edit
  const handleCodeChange = (newCode) => {
    setPlantUMLCode(newCode)
  }

  const panelVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  }

  const diagramVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'}`}>
        {/* Toaster for notifications */}
        <Toaster position="top-right" />

        {/* Header */}
        <header className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/80 backdrop-blur-md' : 'border-blue-200/50 bg-white/80 backdrop-blur-md'} shadow-lg sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={24} />
              </motion.div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                  UMLGen
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI-Powered Diagrams
                </p>
              </div>
            </motion.div>

            <motion.button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            {!hasGenerated ? (
              <motion.div
                key="input-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Left Panel - Chat */}
                <ChatPanel
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  projectContext={projectContext}
                  setProjectContext={setProjectContext}
                  diagramPrompt={diagramPrompt}
                  setDiagramPrompt={setDiagramPrompt}
                  diagramType={diagramType}
                  setDiagramType={setDiagramType}
                  useCustomPrompt={useCustomPrompt}
                  setUseCustomPrompt={setUseCustomPrompt}
                  diagramTypes={diagramTypes}
                  onGenerate={handleGenerateUML}
                  isLoading={isLoading}
                  error={error}
                  isDarkMode={isDarkMode}
                />

                {/* Right Panel - Illustration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card isDarkMode={isDarkMode} className="p-8 shadow-2xl flex items-center justify-center min-h-96">
                    <div className="text-center">
                      <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        🎨
                      </motion.div>
                      <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        Generate Your Diagram
                      </h3>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Fill in the details and click generate to create your UML diagram
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="diagram-view"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={diagramVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Left Panel - Compact */}
                <motion.div
                  className="lg:col-span-1"
                  layout
                  transition={{ duration: 0.5 }}
                >
                  <ChatPanel
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    projectContext={projectContext}
                    setProjectContext={setProjectContext}
                    diagramPrompt={diagramPrompt}
                    setDiagramPrompt={setDiagramPrompt}
                    diagramType={diagramType}
                    setDiagramType={setDiagramType}
                    useCustomPrompt={useCustomPrompt}
                    setUseCustomPrompt={setUseCustomPrompt}
                    diagramTypes={diagramTypes}
                    onGenerate={handleGenerateUML}
                    isLoading={isLoading}
                    error={error}
                    isDarkMode={isDarkMode}
                    isCompact={true}
                  />
                </motion.div>

                {/* Right Panel - Expanded Diagram Viewer */}
                <motion.div
                  className="lg:col-span-2"
                  layout
                  transition={{ duration: 0.5 }}
                >
                  <DiagramViewer
                    plantUMLCode={plantUMLCode}
                    isLoading={isLoading}
                    onCodeChange={handleCodeChange}
                    isDarkMode={isDarkMode}
                    onNewDiagram={() => setHasGenerated(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
