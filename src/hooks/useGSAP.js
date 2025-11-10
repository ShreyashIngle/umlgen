import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export function useGSAPFadeIn(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, deps)

  return ref
}

export function useGSAPSlideIn(direction = 'left', deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      const x = direction === 'left' ? -30 : 30
      gsap.fromTo(
        ref.current,
        { opacity: 0, x },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, deps)

  return ref
}

export function useGSAPScaleIn(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out' }
      )
    }
  }, deps)

  return ref
}

export function useGSAPStagger(selector, delay = 0.1, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      const elements = ref.current.querySelectorAll(selector)
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: delay,
          ease: 'power2.out'
        }
      )
    }
  }, deps)

  return ref
}

export function useGSAPHover(ref) {
  const handleMouseEnter = () => {
    gsap.to(ref.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  return { handleMouseEnter, handleMouseLeave }
}
