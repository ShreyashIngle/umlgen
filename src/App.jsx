import { AnimatePresence, motion } from 'framer-motion'
import { History, Moon, Settings, Sparkles, Sun, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import SplitPane from 'react-split-pane'
import Button from './components/Button'
import ChatInput from './components/ChatInput'
import DiagramViewer from './components/DiagramViewer'
import LoadingAnimation from './components/LoadingAnimation'
import MessageBubble from './components/MessageBubble'
import ProgressStepper from './components/ProgressStepper'
import { generateUMLWithGemini } from './services/geminiService'

export default function App() {
  // State management
  const [apiKey, setApiKey] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m your UML assistant. Tell me about your project and what diagram you need.', isUser: false }
  ])
  const [plantUMLCode, setPlantUMLCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [projectContext, setProjectContext] = useState('')
  const [diagramType, setDiagramType] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle user message
  const handleSendMessage = async (text) => {
    if (!apiKey) {
      toast.error('Please set your API key in settings')
      setShowSettings(true)
      return
    }

    // Add user message
    const userMessage = { id: Date.now(), text, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setCurrentStep(1)

    // Analyze and extract context
    if (!projectContext) {
      setProjectContext(text)
      setCurrentStep(2)
      
      // AI asks for diagram type
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: 'Great! What type of UML diagram would you like?\n\n• Use Case Diagram\n• Class Diagram\n• Sequence Diagram\n• Activity Diagram\n• Component Diagram\n• Deployment Diagram\n• State Diagram\n• ER Diagram\n\nOr describe a custom diagram.',
          isUser: false,
          isTyping: true
        }
        setMessages(prev => [...prev, aiMessage])
      }, 500)
      return
    }

    // Extract diagram type and generate
    setDiagramType(text)
    setCurrentStep(3)
    setIsLoading(true)

    try {
      const aiThinking = {
        id: Date.now() + 2,
        text: 'Analyzing your requirements and generating the diagram...',
        isUser: false,
        isTyping: true
      }
      setMessages(prev => [...prev, aiThinking])

      const code = await generateUMLWithGemini(apiKey, projectContext, text)
      setPlantUMLCode(code)
      setCurrentStep(4)

      // Success message
      setTimeout(() => {
        const successMsg = {
          id: Date.now() + 3,
          text: '✅ Diagram generated successfully! You can view it on the right panel, edit the code, or download it.',
          isUser: false,
          isTyping: true
        }
        setMessages(prev => [...prev, successMsg])
      }, 500)

      toast.success('Diagram generated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to generate diagram')
      const errorMsg = {
        id: Date.now() + 4,
        text: `❌ Error: ${error.message}. Please try again or check your API key.`,
        isUser: false
      }
      setMessages(prev => [...prev, errorMsg])
      setCurrentStep(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      { id: 1, text: 'Hi! I\'m your UML assistant. Tell me about your project and what diagram you need.', isUser: false }
    ])
    setProjectContext('')
    setDiagramType('')
    setPlantUMLCode('')
    setCurrentStep(0)
    toast.success('Chat cleared')
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'}`}>
        <Toaster position="top-right" />

        {/* Cinematic Header */}
        <motion.header
          className={`border-b backdrop-blur-xl sticky top-0 z-50 ${
            isDarkMode ? 'bg-gray-900/80 border-gray-800 shadow-2xl' : 'bg-white/80 border-gray-200 shadow-xl'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="max-w-full px-6 py-4 flex justify-between items-center">
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={28} />
              </motion.div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-cyan-400 via-indigo-400 to-purple-400' : 'from-indigo-600 via-purple-600 to-cyan-600'} bg-clip-text text-transparent`}>
                  UMLGen AI
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Intelligent Diagram Generation
                </p>
              </div>
            </motion.div>

            {/* Progress Stepper */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <ProgressStepper currentStep={currentStep} isDarkMode={isDarkMode} />
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <Settings size={20} />
              </Button>

              <Button
                onClick={() => setIsDarkMode(!isDarkMode)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`border-t overflow-hidden ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'}`}
              >
                <div className="p-4 max-w-2xl mx-auto">
                  <label className="block text-sm font-semibold mb-2">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key..."
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' : 'bg-white border-gray-300 focus:border-indigo-500'
                    } focus:outline-none transition-all`}
                  />
                  <p className="text-xs mt-2 text-gray-500">
                    Get your key from{' '}
                    <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className={`${isDarkMode ? 'text-cyan-400' : 'text-indigo-600'} hover:underline font-semibold`}>
                      Google AI Studio
                    </a>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Main Split View */}
        <SplitPane split="vertical" minSize={400} defaultSize="50%" className="h-[calc(100vh-80px)]">
          {/* Left Panel - Chat */}
          <motion.div
            className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/30'} backdrop-blur-sm`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Chat Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className="text-lg font-bold">Chat</h2>
              <div className="flex gap-2">
                <Button onClick={handleClearChat} variant="ghost" size="sm" className="p-2">
                  <Trash2 size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <History size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg.text}
                    isUser={msg.isUser}
                    isTyping={msg.isTyping}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </AnimatePresence>

              {isLoading && <LoadingAnimation isDarkMode={isDarkMode} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading}
              isDarkMode={isDarkMode}
              placeholder={
                !projectContext
                  ? 'Describe your project...'
                  : !diagramType
                  ? 'What type of diagram?'
                  : 'Ask for modifications...'
              }
            />
          </motion.div>

          {/* Right Panel - Diagram */}
          <motion.div
            className="h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DiagramViewer
              plantUMLCode={plantUMLCode}
              isLoading={isLoading}
              onCodeChange={setPlantUMLCode}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        </SplitPane>
      </div>
    </div>
  )
}
