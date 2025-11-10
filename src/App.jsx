import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, History, Moon, Settings, Sparkles, Sun, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Button from './components/Button'
import Card from './components/Card'
import ChatInput from './components/ChatInput'
import DiagramViewer from './components/DiagramViewer'
import LoadingAnimation from './components/LoadingAnimation'
import MessageBubble from './components/MessageBubble'
import ProgressStepper from './components/ProgressStepper'
import { generateUMLWithGemini } from './services/geminiService'

const DIAGRAM_TYPES = [
  'Use Case Diagram',
  'Class Diagram',
  'Sequence Diagram',
  'Activity Diagram',
  'Component Diagram',
  'Deployment Diagram',
  'State Diagram',
  'ER Diagram'
]

export default function App() {
  const [apiKey, setApiKey] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! 👋 I\'m your UML assistant. Describe your project and I\'ll generate the perfect diagram for you.', isUser: false }
  ])
  const [plantUMLCode, setPlantUMLCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [projectContext, setProjectContext] = useState('')
  const [showApiModal, setShowApiModal] = useState(true)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedDiagramType, setSelectedDiagramType] = useState('')
  const [showDiagramSelector, setShowDiagramSelector] = useState(false)
  const [isChatCollapsed, setIsChatCollapsed] = useState(false)

  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close modal if API key is set
  useEffect(() => {
    if (apiKey.trim()) {
      setShowApiModal(false)
    }
  }, [apiKey])

  const handleSendMessage = async (text) => {
    if (!apiKey.trim()) {
      toast.error('Please set your API key first')
      setShowApiModal(true)
      return
    }

    const userMessage = { id: Date.now(), text, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setCurrentStep(1)

    if (!projectContext) {
      // First interaction: save context
      setProjectContext(text)
      setCurrentStep(2)
      setShowDiagramSelector(true)

      // Show diagram type selector
      setTimeout(() => {
        const selectorMsg = {
          id: Date.now() + 1,
          text: 'Perfect! 📊 Which UML diagram would you like me to generate? Select from the options below or describe a custom diagram.',
          isUser: false,
          isDiagramSelector: true,
          options: DIAGRAM_TYPES
        }
        setMessages(prev => [...prev, selectorMsg])
      }, 300)
      return
    }

    // Generate diagram
    setSelectedDiagramType(text)
    setCurrentStep(3)
    setIsLoading(true)

    try {
      const aiMsg = {
        id: Date.now() + 2,
        text: '✨ Generating your diagram...',
        isUser: false
      }
      setMessages(prev => [...prev, aiMsg])

      const code = await generateUMLWithGemini(apiKey, projectContext, text)
      setPlantUMLCode(code)
      setCurrentStep(4)
      setHasGenerated(true)

      setTimeout(() => {
        const successMsg = {
          id: Date.now() + 3,
          text: '🎉 Diagram generated! You can preview it on the right, edit the code, or download it.',
          isUser: false
        }
        setMessages(prev => [...prev, successMsg])
      }, 500)

      toast.success('Diagram generated!')
    } catch (error) {
      toast.error(error.message || 'Failed to generate diagram')
      const errorMsg = {
        id: Date.now() + 4,
        text: `❌ Error: ${error.message}. Please try again.`,
        isUser: false
      }
      setMessages(prev => [...prev, errorMsg])
      setCurrentStep(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectDiagram = (type) => {
    setShowDiagramSelector(false)
    handleSendMessage(type)
  }

  const handleClearChat = () => {
    setMessages([
      { id: 1, text: 'Hi! 👋 I\'m your UML assistant. Describe your project and I\'ll generate the perfect diagram for you.', isUser: false }
    ])
    setProjectContext('')
    setPlantUMLCode('')
    setCurrentStep(0)
    setHasGenerated(false)
    setShowDiagramSelector(false)
    toast.success('Chat cleared')
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen w-full flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'}`}>
        <Toaster position="top-right" />

        {/* Header */}
        <motion.header
          className={`border-b backdrop-blur-xl sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} shadow-lg`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={28} />
              </motion.div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-cyan-400 via-indigo-400 to-purple-400' : 'from-indigo-600 via-purple-600 to-cyan-600'} bg-clip-text text-transparent`}>
                  UMLGen AI
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Intelligent Diagrams</p>
              </div>
            </motion.div>

            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <ProgressStepper currentStep={currentStep} isDarkMode={isDarkMode} />
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowApiModal(true)}
                variant={apiKey ? 'ghost' : 'primary'}
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
        </motion.header>

        {/* API Key Modal */}
        <AnimatePresence>
          {showApiModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => apiKey.trim() && setShowApiModal(false)}
            >
              <motion.div
                className={`rounded-2xl border-2 p-8 max-w-md w-full mx-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">🔑 Setup API Key</h2>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter your Gemini API key to get started generating UML diagrams.
                </p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className={`w-full px-4 py-3 rounded-lg border-2 mb-4 ${isDarkMode ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' : 'bg-gray-50 border-gray-300 focus:border-indigo-500'} focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                  autoFocus
                />
                <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Get your free API key from{' '}
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-semibold">
                    Google AI Studio
                  </a>
                </p>
                <Button
                  onClick={() => apiKey.trim() && setShowApiModal(false)}
                  disabled={!apiKey.trim()}
                  className="w-full"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 py-4 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              {!hasGenerated ? (
                // Chat Only View
                <motion.div
                  key="chat-only"
                  className="h-[calc(100vh-180px)] flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card isDarkMode={isDarkMode} className="w-full h-full p-0 flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4 flex items-center justify-between`}>
                      <h2 className="text-xl font-bold">Chat</h2>
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
                          <div key={msg.id}>
                            {msg.isDiagramSelector ? (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 mb-4`}
                              >
                                <motion.div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-600">
                                  <Sparkles size={20} className="text-white" />
                                </motion.div>
                                <div className="flex-1">
                                  <motion.p className={`px-4 py-3 rounded-2xl inline-block ${isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200'} text-sm mb-4`}>
                                    {msg.text}
                                  </motion.p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {msg.options?.map((option) => (
                                      <motion.button
                                        key={option}
                                        onClick={() => handleSelectDiagram(option)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDarkMode ? 'bg-indigo-900/50 hover:bg-indigo-800/80 border border-indigo-700/50' : 'bg-indigo-100 hover:bg-indigo-200 border border-indigo-300'}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        {option}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <MessageBubble
                                message={msg.text}
                                isUser={msg.isUser}
                                isTyping={msg.isTyping}
                                isDarkMode={isDarkMode}
                              />
                            )}
                          </div>
                        ))}
                      </AnimatePresence>

                      {isLoading && <LoadingAnimation isDarkMode={isDarkMode} message="Generating your diagram..." />}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <ChatInput
                      onSend={handleSendMessage}
                      disabled={isLoading || showDiagramSelector}
                      isDarkMode={isDarkMode}
                      placeholder={!projectContext ? 'Describe your project...' : 'Ask for modifications...'}
                    />
                  </Card>
                </motion.div>
              ) : (
                // Split View with Diagram
                <motion.div
                  key="split-view"
                  className="h-[calc(100vh-180px)] grid gap-4 relative"
                  style={{
                    gridTemplateColumns: isChatCollapsed ? '0px 1fr' : 'minmax(300px, 350px) 1fr'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Left - Collapsible Chat Panel */}
                  <AnimatePresence>
                    {!isChatCollapsed && (
                      <motion.div
                        initial={{ x: -50, opacity: 0, width: 0 }}
                        animate={{ x: 0, opacity: 1, width: 'auto' }}
                        exit={{ x: -50, opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <Card isDarkMode={isDarkMode} className="h-full flex flex-col shadow-xl overflow-hidden">
                          {/* Chat Header */}
                          <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4 flex items-center justify-between flex-shrink-0`}>
                            <h3 className="font-bold text-base">Messages</h3>
                            <div className="flex gap-2 items-center">
                              <Button onClick={handleClearChat} variant="ghost" size="sm" className="p-1.5">
                                <Trash2 size={16} />
                              </Button>
                              <Button onClick={() => setIsChatCollapsed(true)} variant="ghost" size="sm" className="p-1.5">
                                <ChevronLeft size={16} />
                              </Button>
                            </div>
                          </div>

                          {/* Messages List - Improved Scroll */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-rounded">
                            <AnimatePresence>
                              {messages.slice(-8).map((msg) => (
                                <motion.div
                                  key={msg.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className={`p-3 rounded-lg text-sm shadow-sm ${
                                    msg.isUser 
                                      ? isDarkMode 
                                        ? 'bg-indigo-900/50 border border-indigo-700/50' 
                                        : 'bg-indigo-100 border border-indigo-200'
                                      : isDarkMode 
                                      ? 'bg-gray-800/50 border border-gray-700/50' 
                                      : 'bg-gray-100 border border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      msg.isUser 
                                        ? 'bg-indigo-500' 
                                        : 'bg-cyan-500'
                                    }`}>
                                      <span className="text-white text-xs">
                                        {msg.isUser ? '👤' : '🤖'}
                                      </span>
                                    </div>
                                    <p className="leading-relaxed break-words flex-1">{msg.text}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>

                          {/* Sticky Input at Bottom */}
                          <div className="flex-shrink-0">
                            <ChatInput
                              onSend={handleSendMessage}
                              disabled={isLoading}
                              isDarkMode={isDarkMode}
                              placeholder="Modify the diagram..."
                              compact
                            />
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapse/Expand Button - Floating */}
                  {isChatCollapsed && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setIsChatCollapsed(false)}
                      className={`absolute left-4 top-4 z-10 p-3 rounded-xl shadow-lg backdrop-blur-md transition-all ${
                        isDarkMode 
                          ? 'bg-gray-800/90 hover:bg-gray-700/90 border border-gray-700' 
                          : 'bg-white/90 hover:bg-gray-100/90 border border-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  )}

                  {/* Right - Diagram Viewer */}
                  <motion.div
                    layout
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <DiagramViewer
                      plantUMLCode={plantUMLCode}
                      isLoading={isLoading}
                      onCodeChange={setPlantUMLCode}
                      isDarkMode={isDarkMode}
                      onNewDiagram={() => {
                        setHasGenerated(false)
                        setIsChatCollapsed(false)
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
