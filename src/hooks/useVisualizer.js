import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useVisualizer — shared playback engine for all 100 problem visualizers.
 *
 * @param {Array}  steps  - array of step objects produced by generateSteps()
 * @param {number} speed  - playback speed 1–10 (default 5)
 *
 * Returned API:
 *   currentStep  — index of currently displayed step (-1 = not started)
 *   step         — steps[currentStep] or null
 *   isPlaying    — boolean
 *   progress     — 0–100 percentage
 *   totalSteps   — steps.length
 *   prev()       — go back one step
 *   next()       — advance one step
 *   togglePlay() — play / pause / restart
 *   reset()      — back to -1
 */
export function useVisualizer(steps = []) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const intervalRef = useRef(null)

  // ms delay from speed 1–10 (1 = 2000ms, 10 = 200ms)
  const delay = Math.round(2200 - speed * 200)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Stop playing if steps array changes (new test case or algo selected)
  useEffect(() => {
    clearTimer()
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [steps, clearTimer])

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearTimer()
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, delay)
    return clearTimer
  }, [isPlaying, delay, steps.length, clearTimer])

  const next = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const prev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [clearTimer])

  const togglePlay = useCallback(() => {
    if (steps.length === 0) return
    // If at end, restart from beginning
    if (currentStep >= steps.length - 1) {
      clearTimer()
      setCurrentStep(0)
      setIsPlaying(true)
      return
    }
    // If not started yet, start from step 0
    if (currentStep === -1) {
      setCurrentStep(0)
      setIsPlaying(true)
      return
    }
    setIsPlaying(p => !p)
  }, [currentStep, steps.length, clearTimer])

  const progress = steps.length === 0
    ? 0
    : Math.round(((currentStep + 1) / steps.length) * 100)

  return {
    currentStep,
    step: currentStep >= 0 ? steps[currentStep] : null,
    isPlaying,
    progress,
    totalSteps: steps.length,
    speed,
    setSpeed,
    prev,
    next,
    togglePlay,
    reset,
  }
}
