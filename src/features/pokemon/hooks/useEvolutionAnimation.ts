import { useCallback, useEffect, useRef, useState } from 'react'
import type { EvolutionPathInfo } from '@/features/pokemon/types/domain.types'
import { prefetchPokemonImage } from '@/lib/utils/pokemon'

export type EvolutionPhase =
  | 'idle'
  | 'announce'
  | 'charge'
  | 'flash'
  | 'reveal'
  | 'complete'

const ANNOUNCE_MS = 700
const CHARGE_MS = 900
const FLASH_MS = 480
const REVEAL_MS = 720
const STAGE_HOLD_MS = 1100

interface UseEvolutionAnimationOptions {
  path: EvolutionPathInfo | null
  currentId: number
}

export function useEvolutionAnimation({ path, currentId }: UseEvolutionAnimationOptions) {
  const initialIndex = Math.max(
    0,
    path?.stages.findIndex((stage) => stage.id === currentId) ?? 0,
  )

  const [displayIndex, setDisplayIndex] = useState(initialIndex)
  const [phase, setPhase] = useState<EvolutionPhase>('idle')
  const [isPlaying, setIsPlaying] = useState(false)
  const [triggerLabel, setTriggerLabel] = useState<string | null>(null)
  const timersRef = useRef<number[]>([])

  const canEvolve = (path?.stages.length ?? 0) > 1
  const currentStage = path?.stages[displayIndex] ?? path?.stages[0] ?? null

  useEffect(() => {
    if (!path) return
    for (const stage of path.stages) {
      prefetchPokemonImage(stage.id, stage.spriteUrl)
    }
  }, [path])

  useEffect(() => {
    setDisplayIndex(initialIndex)
    setPhase('idle')
    setIsPlaying(false)
    setTriggerLabel(null)
  }, [initialIndex, path])

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current) {
        window.clearTimeout(timer)
      }
      timersRef.current = []
    }
  }, [])

  const queueTimeout = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay)
    timersRef.current.push(timer)
  }, [])

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer)
    }
    timersRef.current = []
  }, [])

  const runTransition = useCallback(
    (fromIndex: number) => {
      if (!path) return

      const nextIndex = fromIndex + 1
      if (nextIndex >= path.stages.length) {
        queueTimeout(() => {
          setPhase('complete')
          setTriggerLabel(null)
        }, STAGE_HOLD_MS)

        queueTimeout(() => {
          setIsPlaying(false)
          setPhase('idle')
        }, STAGE_HOLD_MS + 600)
        return
      }

      setTriggerLabel(path.triggers[fromIndex]?.label ?? 'Evolve')
      setPhase('announce')

      queueTimeout(() => setPhase('charge'), ANNOUNCE_MS)
      queueTimeout(() => setPhase('flash'), ANNOUNCE_MS + CHARGE_MS)
      queueTimeout(() => {
        setDisplayIndex(nextIndex)
        setPhase('reveal')
      }, ANNOUNCE_MS + CHARGE_MS + FLASH_MS)
      queueTimeout(() => {
        setPhase('idle')
        setTriggerLabel(null)
      }, ANNOUNCE_MS + CHARGE_MS + FLASH_MS + REVEAL_MS)

      queueTimeout(() => {
        runTransition(nextIndex)
      }, ANNOUNCE_MS + CHARGE_MS + FLASH_MS + REVEAL_MS + STAGE_HOLD_MS)
    },
    [path, queueTimeout],
  )

  const play = useCallback(() => {
    if (!path || !canEvolve || isPlaying) return

    clearTimers()
    setIsPlaying(true)
    setDisplayIndex(0)
    setPhase('idle')
    setTriggerLabel(null)

    queueTimeout(() => runTransition(0), 500)
  }, [canEvolve, clearTimers, isPlaying, path, queueTimeout, runTransition])

  const stop = useCallback(() => {
    clearTimers()
    setIsPlaying(false)
    setPhase('idle')
    setTriggerLabel(null)
    setDisplayIndex(initialIndex)
  }, [clearTimers, initialIndex])

  return {
    canEvolve,
    isPlaying,
    phase,
    triggerLabel,
    displayIndex,
    currentStage,
    stageCount: path?.stages.length ?? 0,
    play,
    stop,
  }
}
