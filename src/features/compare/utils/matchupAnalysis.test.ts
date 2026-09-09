import { describe, expect, it } from 'vitest'
import type { CompareProfile } from '@/features/compare/types/compare.types'
import {
  analyzeHeadToHead,
  getPokemonMatchups,
} from '@/features/compare/utils/matchupAnalysis'

function createProfile(
  overrides: Partial<CompareProfile> & Pick<CompareProfile, 'id' | 'name'>,
): CompareProfile {
  return {
    id: overrides.id,
    name: overrides.name,
    spriteUrl: `/sprite/${overrides.id}.png`,
    types: overrides.types ?? ['fire'],
    cardType: overrides.cardType ?? 'fire',
    hp: overrides.hp ?? 78,
    attackName: overrides.attackName ?? 'Ember',
    attackDamage: overrides.attackDamage ?? 30,
    attackType: overrides.attackType ?? 'fire',
    weakness: overrides.weakness ?? 'water',
    resistance: overrides.resistance ?? null,
    retreat: overrides.retreat ?? 2,
    stats: overrides.stats ?? [],
  }
}

describe('analyzeHeadToHead', () => {
  it('favors blastoise over charizard due to water weakness', () => {
    const charizard = createProfile({
      id: 6,
      name: 'charizard',
      cardType: 'fire',
      attackType: 'fire',
      attackDamage: 30,
      hp: 78,
      weakness: 'water',
    })
    const blastoise = createProfile({
      id: 9,
      name: 'blastoise',
      cardType: 'water',
      attackType: 'water',
      attackDamage: 26,
      hp: 79,
      weakness: 'grass',
      resistance: 'fire',
    })

    const result = analyzeHeadToHead(blastoise, charizard)

    expect(result.favoredId).toBe(9)
    expect(result.summary).toContain('Blastoise favored')
    expect(result.summary.toLowerCase()).toContain('water')
    expect(result.pokemon1Attacks.weaknessApplied).toBe(true)
  })

  it('lists favorable and unfavorable opponents', () => {
    const pikachu = createProfile({
      id: 25,
      name: 'pikachu',
      cardType: 'electric',
      attackType: 'electric',
      attackDamage: 20,
      hp: 40,
      weakness: 'fighting',
    })
    const opponents = [
      pikachu,
      createProfile({
        id: 7,
        name: 'squirtle',
        cardType: 'water',
        attackType: 'water',
        attackDamage: 20,
        hp: 44,
        weakness: 'grass',
        resistance: 'fire',
      }),
      createProfile({
        id: 74,
        name: 'geodude',
        cardType: 'rock',
        attackType: 'rock',
        attackDamage: 20,
        hp: 50,
        weakness: 'grass',
        resistance: null,
      }),
    ]

    const lists = getPokemonMatchups(pikachu, opponents, 5)

    expect(lists.favorable.length + lists.unfavorable.length).toBeGreaterThan(0)
  })
})
