import gsap from 'gsap'
import { ArrowLeft, Code2, Copy, Download, Eye } from 'lucide-react'
import { encode } from 'plantuml-encoder'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useGSAPSlideIn } from '../hooks/useGSAP'
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
  const containerRef = useGSAPSlideIn('right')
  const diagramRef = useRef(null)

  // Encode PlantUML code to generate diagram URL
  const diagramUrl = plantUMLCode.trim()
    ? `https://www.plantuml.com/plantuml/png/${encode(plantUMLCode)}`
    : null

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
      toast.error('Failed to download SVG')
    }
  }

  const handleTabChange = (tab) => {
    gsap.to(containerRef.current, {
      opacity: 0.5,
      duration: 0.2,
      onComplete: () => {
        setShowCode(tab === 'code')
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 0.2
        })
      }
    })
  }

  return (
    <Card isDarkMode={isDarkMode} className="shadow-2xl h-full flex flex-col overflow-hidden p-0">
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
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
            <div className="flex gap-2">
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
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div className={`flex gap-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => handleTabChange('preview')}
            className={`px-4 py-2 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              !showCode
                ? 'border-blue-500 text-blue-500'
                : isDarkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-600'
            }`}
          >
            <Eye size={18} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => handleTabChange('code')}
            className={`px-4 py-2 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              showCode
                ? 'border-purple-500 text-purple-500'
                : isDarkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-600'
            }`}
          >
            <Code2 size={18} />
            <span className="hidden sm:inline">Code</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {!showCode ? (
          <>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 spin-smooth">⚡</div>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Drawing your diagram...
                  </p>
                </div>
              </div>
            ) : diagramUrl ? (
              <div
                ref={diagramRef}
                className={`flex-1 rounded-xl border-2 ${isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-100/50'} p-4 flex items-center justify-center overflow-auto diagram-fade`}
              >
                <img
                  src={diagramUrl}
                  alt="Generated UML Diagram"
                  className="max-w-full max-h-full rounded-lg shadow-lg transition-transform hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Generate a diagram to see the preview
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3 flex-1">
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
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none`}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
