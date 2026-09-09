import type {
  CapturedPokemon,
  CapturedPokemonMap,
} from '@/features/captured/types/captured.types'
import { STORAGE_KEYS } from '@/lib/constants'
import { readJsonFromStorage, writeJsonToStorage } from '@/lib/storage/storage'

function isCapturedPokemon(value: unknown): value is CapturedPokemon {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.pokemonId === 'number' &&
    typeof record.name === 'string' &&
    typeof record.nickname === 'string' &&
    typeof record.capturedAt === 'string'
  )
}

function isCapturedPokemonMap(value: unknown): value is CapturedPokemonMap {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every(isCapturedPokemon)
}

export function getCapturedPokemonMap(): CapturedPokemonMap {
  return readJsonFromStorage(STORAGE_KEYS.captured, {}, isCapturedPokemonMap)
}

export function saveCapturedPokemonMap(map: CapturedPokemonMap): void {
  writeJsonToStorage(STORAGE_KEYS.captured, map)
}

export function capturePokemon(entry: CapturedPokemon): CapturedPokemonMap {
  const next = { ...getCapturedPokemonMap(), [entry.pokemonId]: entry }
  saveCapturedPokemonMap(next)
  return next
}

export function uncapturePokemon(pokemonId: number): CapturedPokemonMap {
  const current = getCapturedPokemonMap()
  const next = { ...current }
  delete next[pokemonId]
  saveCapturedPokemonMap(next)
  return next
}

export function getCapturedPokemonList(): CapturedPokemon[] {
  return Object.values(getCapturedPokemonMap()).sort(
    (a, b) =>
      new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
  )
}
