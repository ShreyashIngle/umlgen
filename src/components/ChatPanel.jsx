import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ChevronDown, Send, Zap } from 'lucide-react'
import { useState } from 'react'
import Badge from './Badge'
import Button from './Button'
import Card from './Card'
import Input from './Input'
import StepIndicator from './StepIndicator'
import Textarea from './Textarea'
import ToggleSwitch from './ToggleSwitch'

export default function ChatPanel({
  apiKey,
  setApiKey,
  projectContext,
  setProjectContext,
  diagramPrompt,
  setDiagramPrompt,
  diagramType,
  setDiagramType,
  useCustomPrompt,
  setUseCustomPrompt,
  diagramTypes,
  onGenerate,
  isLoading,
  error,
  isDarkMode,
  isCompact = false
}) {
  const [expandedSection, setExpandedSection] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const steps = [apiKey.trim() ? 1 : 0, projectContext.trim() ? 2 : 1, diagramType || diagramPrompt ? 3 : 2]
  const currentStep = Math.max(...steps)

  if (isCompact) {
    return (
      <Card isDarkMode={isDarkMode} className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-blue-500" />
          <h2 className="text-lg font-bold">Regenerate</h2>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          <motion.div className="space-y-2">
            <button
              onClick={() => toggleSection('context')}
              className={`w-full text-left p-3 rounded-lg font-medium flex items-center justify-between ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-sm">Project Context</span>
              <ChevronDown size={16} className={`transition-transform ${expandedSection === 'context' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedSection === 'context' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Textarea
                    value={projectContext}
                    onChange={(e) => setProjectContext(e.target.value)}
                    placeholder="Describe your project..."
                    isDarkMode={isDarkMode}
                    rows="3"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <Button onClick={onGenerate} loading={isLoading} className="w-full text-sm">
          <Send size={16} />
          Regenerate
        </Button>
      </Card>
    )
  }

  return (
    <Card isDarkMode={isDarkMode} className="p-6 h-full flex flex-col">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 flex-1 overflow-y-auto pb-4">
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-blue-500" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UML Generator
            </h2>
          </div>
          <StepIndicator step={currentStep} totalSteps={3} isDarkMode={isDarkMode} />
        </motion.div>

        {/* Step 1: API Key */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <motion.div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </motion.div>
            <label className="text-sm font-semibold">Gemini API Key</label>
            {apiKey && <Badge variant="success">✓ Set</Badge>}
          </div>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key..."
            isDarkMode={isDarkMode}
          />
          <motion.p className="text-xs text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Get it from{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-semibold">
              Google AI Studio
            </a>
          </motion.p>
        </motion.div>

        {/* Step 2: Project Context */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <motion.div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
              2
            </motion.div>
            <label className="text-sm font-semibold">Project Context</label>
            {projectContext && <Badge variant="purple">✓ Filled</Badge>}
          </div>
          <Textarea
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
            placeholder="e.g., AI-powered crop yield prediction system using ML and IoT sensors..."
            isDarkMode={isDarkMode}
            rows="4"
          />
        </motion.div>

        {/* Step 3: Diagram Type Selection */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <motion.div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </motion.div>
            <label className="text-sm font-semibold">Choose Diagram Type</label>
          </div>

          {/* Toggle for Custom Prompt */}
          <ToggleSwitch checked={useCustomPrompt} onChange={setUseCustomPrompt} isDarkMode={isDarkMode} label="Use Custom Prompt" />

          {/* Conditional rendering */}
          <AnimatePresence mode="wait">
            {useCustomPrompt ? (
              <motion.div key="custom" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Textarea
                  value={diagramPrompt}
                  onChange={(e) => setDiagramPrompt(e.target.value)}
                  placeholder="e.g., Create a use case diagram showing interactions between farmers, AI system, and weather API..."
                  isDarkMode={isDarkMode}
                  rows="4"
                />
              </motion.div>
            ) : (
              <motion.div key="select" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <motion.div className="relative">
                  <select
                    value={diagramType}
                    onChange={(e) => setDiagramType(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 appearance-none cursor-pointer pr-10 ${
                      isDarkMode
                        ? 'border-gray-700 bg-gray-900/50 focus:border-green-500'
                        : 'border-gray-200 bg-white/50 focus:border-green-500'
                    } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                  >
                    <option value="">-- Select a diagram type --</option>
                    {diagramTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" size={18} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 border-2 ${
              isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <AlertCircle size={20} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      <Button onClick={onGenerate} disabled={isLoading} className="w-full">
        <Send size={20} />
        {isLoading ? 'Generating...' : 'Generate UML Diagram'}
      </Button>

      {/* Helper Text */}
      <motion.p className="text-xs text-gray-500 text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        💡 Be descriptive about your project for better diagrams
      </motion.p>
    </Card>
  )
}
