import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Generate UML diagram code using Gemini API
 * @param {string} apiKey - Gemini API key
 * @param {string} projectContext - Description of the project
 * @param {string} diagramType - Type of UML diagram to generate
 * @returns {Promise<string>} - PlantUML code for the diagram
 */
export async function generateUMLWithGemini(apiKey, projectContext, diagramType) {
  if (!apiKey || !projectContext || !diagramType) {
    throw new Error('Missing required parameters')
  }

  try {
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Craft the prompt for Gemini
    const prompt = `
You are an expert software architect. Generate a detailed PlantUML code for a ${diagramType} based on the following project description:

Project Context: ${projectContext}

Requirements:
1. Generate ONLY valid PlantUML code for ${diagramType}
2. Make the diagram detailed and realistic for the described project
3. Include all relevant entities, relationships, or interactions
4. Ensure the code is properly formatted and can be rendered
5. Do NOT include any explanations or text outside the code
6. Start directly with @startuml and end with @enduml

Generate the PlantUML code now:
`

    // Call Gemini API
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract PlantUML code from response
    const plantUMLCode = extractPlantUMLCode(text)

    if (!plantUMLCode || plantUMLCode.trim().length === 0) {
      throw new Error('Failed to generate valid PlantUML code')
    }

    return plantUMLCode
  } catch (error) {
    if (error.message.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check and try again.')
    }
    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error('API key authentication failed. Please verify your key.')
    }
    throw new Error(error.message || 'Failed to generate UML diagram with Gemini')
  }
}

/**
 * Extract PlantUML code from Gemini response
 * @param {string} text - Response text from Gemini
 * @returns {string} - Extracted PlantUML code
 */
function extractPlantUMLCode(text) {
  // Try to extract code between @startuml and @enduml
  const match = text.match(/@startuml[\s\S]*?@enduml/i)
  if (match) {
    return match[0]
  }

  // If no markers found, try to clean up the response
  let cleaned = text.trim()
  
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/```[\w]*\n?/g, '')
  
  // If text contains @startuml, extract from there
  if (cleaned.includes('@startuml')) {
    cleaned = cleaned.substring(cleaned.indexOf('@startuml'))
  }
  if (cleaned.includes('@enduml')) {
    cleaned = cleaned.substring(0, cleaned.indexOf('@enduml') + 8)
  }

  return cleaned.trim()
}
