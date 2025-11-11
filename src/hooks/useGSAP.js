import { useEffect, useRef } from 'react'

export function useGSAPFadeIn(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('gsap-fade-in')
    }
  }, deps)

  return ref
}

export function useGSAPSlideIn(direction = 'left', deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      const className = direction === 'left' ? 'gsap-slide-in-left' : 'gsap-slide-in-right'
      ref.current.classList.add(className)
    }
  }, deps)

  return ref
}

export function useGSAPScaleIn(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('gsap-scale-in')
    }
  }, deps)

  return ref
}

export function useGSAPStagger(selector, delay = 0.1, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      const elements = ref.current.querySelectorAll(selector)
      elements.forEach((element, index) => {
        element.style.animationDelay = `${index * delay}s`
        element.classList.add('gsap-fade-in')
      })
    }
  }, deps)

  return ref
}

export function useGSAPHover(ref) {
  const handleMouseEnter = () => {
    if (ref.current) {
      ref.current.style.transform = 'scale(1.05)'
      ref.current.style.transition = 'transform 0.3s ease'
    }
  }

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'scale(1)'
    }
  }

  return { handleMouseEnter, handleMouseLeave }
}
