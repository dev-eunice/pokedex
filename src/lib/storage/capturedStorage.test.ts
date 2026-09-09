import { beforeEach, describe, expect, it } from 'vitest'
import {
  capturePokemon,
  getCapturedPokemonList,
  getCapturedPokemonMap,
  uncapturePokemon,
} from '@/lib/storage/capturedStorage'
import { STORAGE_KEYS } from '@/lib/constants'

describe('capturedStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('captures and retrieves pokemon', () => {
    capturePokemon({
      pokemonId: 25,
      name: 'pikachu',
      nickname: 'Sparky',
      capturedAt: '2026-09-09',
    })

    const map = getCapturedPokemonMap()
    expect(map[25]).toEqual({
      pokemonId: 25,
      name: 'pikachu',
      nickname: 'Sparky',
      capturedAt: '2026-09-09',
    })
  })

  it('uncaptures pokemon', () => {
    capturePokemon({
      pokemonId: 25,
      name: 'pikachu',
      nickname: 'Sparky',
      capturedAt: '2026-09-09',
    })

    uncapturePokemon(25)
    expect(getCapturedPokemonMap()[25]).toBeUndefined()
  })

  it('handles malformed localStorage data gracefully', () => {
    window.localStorage.setItem(STORAGE_KEYS.captured, '{ invalid json')
    expect(getCapturedPokemonMap()).toEqual({})
  })

  it('sorts captured list by most recent capture date', () => {
    capturePokemon({
      pokemonId: 1,
      name: 'bulbasaur',
      nickname: 'Bulby',
      capturedAt: '2026-01-01',
    })
    capturePokemon({
      pokemonId: 25,
      name: 'pikachu',
      nickname: 'Sparky',
      capturedAt: '2026-09-09',
    })

    const list = getCapturedPokemonList()
    expect(list[0].pokemonId).toBe(25)
  })
})
