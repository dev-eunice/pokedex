import { useCallback, useSyncExternalStore } from 'react'
import type {
  CapturedPokemon,
  CapturedPokemonMap,
} from '@/features/captured/types/captured.types'
import {
  capturePokemon,
  getCapturedPokemonList,
  getCapturedPokemonMap,
  uncapturePokemon,
} from '@/lib/storage/capturedStorage'

type Listener = () => void

const listeners = new Set<Listener>()

let cachedSnapshot: CapturedPokemonMap = getCapturedPokemonMap()

function refreshSnapshot(): void {
  cachedSnapshot = getCapturedPokemonMap()
}

function emitChange() {
  refreshSnapshot()
  listeners.forEach((listener) => listener())
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): CapturedPokemonMap {
  return cachedSnapshot
}

function getServerSnapshot(): CapturedPokemonMap {
  return {}
}

export function useCapturedPokemonMap() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useCapturedPokemonList(): CapturedPokemon[] {
  const map = useCapturedPokemonMap()
  return Object.values(map).sort(
    (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
  )
}

export function useIsCaptured(pokemonId: number): boolean {
  const map = useCapturedPokemonMap()
  return pokemonId in map
}

export function useCapturedPokemonActions() {
  const capture = useCallback((entry: CapturedPokemon) => {
    capturePokemon(entry)
    emitChange()
  }, [])

  const uncapture = useCallback((pokemonId: number) => {
    uncapturePokemon(pokemonId)
    emitChange()
  }, [])

  return { capture, uncapture }
}

export function getCapturedCountSnapshot(): number {
  return getCapturedPokemonList().length
}
