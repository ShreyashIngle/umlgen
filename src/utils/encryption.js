// Simple encryption/decryption utilities for local storage
const ENCRYPTION_KEY = 'umlgen-secure-key-2024'

function simpleEncrypt(text) {
  if (!text) return ''
  
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    result += String.fromCharCode(char ^ keyChar)
  }
  
  return btoa(result)
}

function simpleDecrypt(encryptedText) {
  if (!encryptedText) return ''
  
  try {
    const decoded = atob(encryptedText)
    let result = ''
    
    for (let i = 0; i < decoded.length; i++) {
      const char = decoded.charCodeAt(i)
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      result += String.fromCharCode(char ^ keyChar)
    }
    
    return result
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}

export function saveApiKey(apiKey) {
  if (!apiKey) {
    localStorage.removeItem('umlgen_api_key')
    return
  }
  
  const encrypted = simpleEncrypt(apiKey)
  localStorage.setItem('umlgen_api_key', encrypted)
}

export function loadApiKey() {
  const encrypted = localStorage.getItem('umlgen_api_key')
  if (!encrypted) return ''
  
  return simpleDecrypt(encrypted)
}

export function clearApiKey() {
  localStorage.removeItem('umlgen_api_key')
}
