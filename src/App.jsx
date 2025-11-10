import gsap from 'gsap'
import { Moon, Sparkles, Sun } from 'lucide-react'
import { useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Button from './components/Button'
import Card from './components/Card'
import ChatPanel from './components/ChatPanel'
import DiagramViewer from './components/DiagramViewer'
import { BubbleBackground } from './components/animate-ui/components/backgrounds/bubble'
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
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [hasGenerated, setHasGenerated] = useState(false)
  const containerRef = useRef(null)

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

      gsap.to(containerRef.current, {
        duration: 0.5,
        onComplete: () => {
          setHasGenerated(true)
        }
      })
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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <BubbleBackground interactive={true} className="fixed inset-0 -z-10" />

      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Toaster for notifications */}
        <Toaster position="top-right" />

        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-colors">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg spin-smooth">
                <Sparkles size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  UMLGen
                </h1>
                <p className="text-xs text-gray-400">
                  AI-Powered Diagrams
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main ref={containerRef} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 overflow-auto">
          {!hasGenerated ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="gsap-slide-in-left">
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
              </div>

              <div className="gsap-slide-in-right">
                <Card isDarkMode={isDarkMode} className="p-8 shadow-2xl flex items-center justify-center min-h-96">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-100">
                      Generate Your Diagram
                    </h3>
                    <p className="text-gray-400">
                      Fill in the details and click generate to create your UML diagram
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 gsap-fade-in">
              <div className="lg:col-span-1">
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
              </div>

              <div className="lg:col-span-2">
                <DiagramViewer
                  plantUMLCode={plantUMLCode}
                  isLoading={isLoading}
                  onCodeChange={handleCodeChange}
                  isDarkMode={isDarkMode}
                  onNewDiagram={() => setHasGenerated(false)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
