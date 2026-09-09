import { describe, expect, it } from 'vitest'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'
import { filterPokemonByQuery } from '@/features/pokemon/utils/search'

const samplePokemon: PokemonSummary[] = [
  { id: 25, name: 'pikachu', spriteUrl: '/25.png' },
  { id: 4, name: 'charmander', spriteUrl: '/4.png' },
  { id: 5, name: 'charmeleon', spriteUrl: '/5.png' },
  { id: 6, name: 'charizard', spriteUrl: '/6.png' },
]

describe('filterPokemonByQuery', () => {
  it('matches pokemon names case-insensitively', () => {
    const results = filterPokemonByQuery(samplePokemon, 'pik')
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('pikachu')
  })

  it('matches pokemon numbers', () => {
    const results = filterPokemonByQuery(samplePokemon, '25')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe(25)
  })

  it('matches partial name queries across multiple pokemon', () => {
    const results = filterPokemonByQuery(samplePokemon, 'char')
    expect(results.map((item) => item.name)).toEqual([
      'charmander',
      'charmeleon',
      'charizard',
    ])
  })

  it('returns all pokemon when query is empty', () => {
    expect(filterPokemonByQuery(samplePokemon, '')).toHaveLength(samplePokemon.length)
  })
})
