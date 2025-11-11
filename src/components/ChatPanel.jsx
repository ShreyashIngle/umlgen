import { AlertCircle, ChevronDown, Send, Zap } from 'lucide-react'
import { useState } from 'react'
import { useGSAPStagger } from '../hooks/useGSAP'
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
  const staggerRef = useGSAPStagger('.stagger-item', 0.1)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const steps = [apiKey.trim() ? 1 : 0, projectContext.trim() ? 2 : 1, diagramType || diagramPrompt ? 3 : 2]
  const currentStep = Math.max(...steps)

  if (isCompact) {
    return (
      <Card isDarkMode={isDarkMode} className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4 stagger-item">
          <Zap size={20} className="text-blue-500" />
          <h2 className="text-lg font-bold">Regenerate</h2>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto" ref={staggerRef}>
          <div className="space-y-2 stagger-item">
            <button
              onClick={() => toggleSection('context')}
              className={`w-full text-left p-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-sm">Project Context</span>
              <ChevronDown size={16} className={`transition-transform ${expandedSection === 'context' ? 'rotate-180' : ''}`} />
            </button>
            {expandedSection === 'context' && (
              <div className="animate-in">
                <Textarea
                  value={projectContext}
                  onChange={(e) => setProjectContext(e.target.value)}
                  placeholder="Describe your project..."
                  isDarkMode={isDarkMode}
                  rows="3"
                />
              </div>
            )}
          </div>
        </div>

        <Button onClick={onGenerate} disabled={isLoading} className="w-full text-sm stagger-item">
          <Send size={16} />
          Regenerate
        </Button>
      </Card>
    )
  }

  return (
    <Card isDarkMode={isDarkMode} className="p-6 h-full flex flex-col">
      <div ref={staggerRef} className="space-y-6 flex-1 overflow-y-auto pb-4">
        {/* Header */}
        <div className="space-y-2 stagger-item">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-blue-500" />
            <h2 className="text-2xl font-bold gradient-text">
              UML Generator
            </h2>
          </div>
          <StepIndicator step={currentStep} totalSteps={3} isDarkMode={isDarkMode} />
        </div>

        {/* Step 1: API Key */}
        <div className="space-y-2 stagger-item">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
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
          <p className="text-xs text-gray-500">
            Get it from{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-semibold">
              Google AI Studio
            </a>
          </p>
        </div>

        {/* Step 2: Project Context */}
        <div className="space-y-2 stagger-item">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
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
        </div>

        {/* Step 3: Diagram Type Selection */}
        <div className="space-y-3 stagger-item">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <label className="text-sm font-semibold">Choose Diagram Type</label>
          </div>

          <ToggleSwitch checked={useCustomPrompt} onChange={setUseCustomPrompt} isDarkMode={isDarkMode} label="Use Custom Prompt" />

          {useCustomPrompt ? (
            <div className="animate-in">
              <Textarea
                value={diagramPrompt}
                onChange={(e) => setDiagramPrompt(e.target.value)}
                placeholder="e.g., Create a use case diagram showing interactions between farmers, AI system, and weather API..."
                isDarkMode={isDarkMode}
                rows="4"
              />
            </div>
          ) : (
            <div className="animate-in relative">
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 appearance-none cursor-pointer pr-10 ${
                  isDarkMode
                    ? 'border-gray-700 bg-gray-900/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                    : 'border-gray-200 bg-white/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                } focus:outline-none`}
              >
                <option value="">-- Select a diagram type --</option>
                {diagramTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" size={18} />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 border-2 animate-in ${
          isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertCircle size={20} className="flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Generate Button */}
      <Button onClick={onGenerate} disabled={isLoading} className="w-full stagger-item">
        <Send size={20} />
        {isLoading ? 'Generating...' : 'Generate UML Diagram'}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        💡 Be descriptive about your project for better diagrams
      </p>
    </Card>
  )
}
