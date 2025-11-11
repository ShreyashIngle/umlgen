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
  const [showEditDialog, setShowEditDialog] = useState(false)

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

        {/* Header - Fixed */}
        <motion.header
          className={`border-b backdrop-blur-xl sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} shadow-lg flex-shrink-0`}
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
            </div>

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

        {/* Edit Dialog - Popup */}
        <AnimatePresence>
          {showEditDialog && hasGenerated && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditDialog(false)}
            >
              <motion.div
                className={`rounded-2xl border-2 p-6 max-w-2xl w-full max-h-[80vh] flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">✏️ Edit Diagram</h2>
                  <button
                    onClick={() => setShowEditDialog(false)}
                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-rounded">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Project Context</label>
                    <textarea
                      value={projectContext}
                      onChange={(e) => setProjectContext(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 resize-none ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 focus:border-cyan-500'
                          : 'bg-gray-50 border-gray-300 focus:border-indigo-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                      rows="3"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Modification Request</label>
                    <ChatInput
                      onSend={(text) => {
                        handleSendMessage(text)
                        setShowEditDialog(false)
                      }}
                      disabled={isLoading}
                      isDarkMode={isDarkMode}
                      placeholder="Describe what you want to change..."
                      compact
                    />
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-semibold">Recent Messages</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                      {messages.slice(-3).map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2 rounded-lg text-xs ${
                            msg.isUser
                              ? isDarkMode
                                ? 'bg-indigo-900/50'
                                : 'bg-indigo-100'
                              : isDarkMode
                              ? 'bg-gray-800/50'
                              : 'bg-gray-100'
                          }`}
                        >
                          {msg.text.substring(0, 100)}...
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowEditDialog(false)}
                    variant="ghost"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleClearChat()
                      setShowEditDialog(false)
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    Start New
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - Always scrollable */}
        <main className="flex-1 w-full px-4 sm:px-6 py-4 min-h-0 flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 flex flex-col">
            <AnimatePresence mode="wait">
              {!hasGenerated ? (
                // Chat Only View
                <motion.div
                  key="chat-only"
                  className="flex-1 flex min-h-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card isDarkMode={isDarkMode} className="w-full flex-1 p-0 flex flex-col shadow-2xl min-h-0">
                    {/* Header */}
                    <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4 flex items-center justify-between flex-shrink-0`}>
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

                    {/* Messages - Always scrollable */}
                    <div 
                      ref={chatContainerRef} 
                      className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-rounded"
                      style={{ 
                        overflowY: 'scroll',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
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

                    {/* Input - Fixed at bottom */}
                    <div className="flex-shrink-0 sticky bottom-0">
                      <ChatInput
                        onSend={handleSendMessage}
                        disabled={isLoading || showDiagramSelector}
                        isDarkMode={isDarkMode}
                        placeholder={!projectContext ? 'Describe your project...' : 'Ask for modifications...'}
                      />
                    </div>
                  </Card>
                </motion.div>
              ) : (
                // Full Screen Diagram View (No Split) - Step 4
                <motion.div
                  key="diagram-view"
                  className="flex-1 min-h-0 flex relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Full Width Diagram Viewer */}
                  <DiagramViewer
                    plantUMLCode={plantUMLCode}
                    isLoading={isLoading}
                    onCodeChange={setPlantUMLCode}
                    isDarkMode={isDarkMode}
                    onNewDiagram={() => {
                      setHasGenerated(false)
                      setIsChatCollapsed(false)
                    }}
                    fullScreen
                  />

                  {/* Floating Edit Button - Bottom Right */}
                  <motion.button
                    onClick={() => setShowEditDialog(true)}
                    className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl backdrop-blur-md z-40 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                    } text-white transition-all`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span className="font-semibold hidden sm:inline">Edit</span>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
