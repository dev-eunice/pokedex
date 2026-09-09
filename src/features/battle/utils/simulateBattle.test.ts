import { describe, expect, it } from 'vitest'
import type { BattleFighter } from '@/features/battle/types/battle.types'
import { simulateBattle } from '@/features/battle/utils/simulateBattle'

function createFighter(overrides: Partial<BattleFighter> & Pick<BattleFighter, 'id'>): BattleFighter {
  return {
    id: overrides.id,
    name: overrides.name ?? `pokemon-${overrides.id}`,
    spriteUrl: `/sprite/${overrides.id}.png`,
    cardType: overrides.cardType ?? 'normal',
    maxHp: overrides.maxHp ?? 50,
    attackName: overrides.attackName ?? 'Tackle',
    attackDamage: overrides.attackDamage ?? 20,
    attackType: overrides.attackType ?? 'normal',
    weakness: overrides.weakness ?? 'fighting',
    resistance: overrides.resistance ?? null,
    retreat: overrides.retreat ?? 1,
  }
}

describe('simulateBattle', () => {
  it('produces a winner when one pokemon is knocked out', () => {
    const fighter1 = createFighter({ id: 1, maxHp: 10, attackDamage: 50 })
    const fighter2 = createFighter({ id: 2, maxHp: 200, attackDamage: 1 })

    const result = simulateBattle(fighter1, fighter2, { firstPlayerId: 1 })

    expect(result.winnerId).toBe(1)
    expect(result.turns.length).toBeGreaterThan(0)
    expect(result.firstPlayerId).toBe(1)
  })

  it('alternates attackers after the coin-flip winner goes first', () => {
    const fighter1 = createFighter({ id: 1, attackDamage: 5, maxHp: 200 })
    const fighter2 = createFighter({ id: 2, attackDamage: 5, maxHp: 200 })

    const result = simulateBattle(fighter1, fighter2, { firstPlayerId: 1 })

    expect(result.turns[0]?.attackerId).toBe(1)
    expect(result.turns[1]?.attackerId).toBe(2)
    expect(result.turns[2]?.attackerId).toBe(1)
  })

  it('records tcg hp before and after each turn', () => {
    const fighter1 = createFighter({ id: 1, maxHp: 30, attackDamage: 15 })
    const fighter2 = createFighter({ id: 2, maxHp: 30, attackDamage: 15 })

    const result = simulateBattle(fighter1, fighter2, { firstPlayerId: 1 })

    for (const turn of result.turns) {
      expect(turn.attackerHpBefore).toBe(turn.attackerHpAfter)
      expect(turn.defenderHpAfter).toBe(
        Math.max(0, turn.defenderHpBefore - turn.finalDamage),
      )
      expect(turn.damageCounters).toBe(Math.floor(turn.finalDamage / 10))
    }
  })

  it('applies tcg weakness when attack type matches', () => {
    const charizard = createFighter({
      id: 6,
      cardType: 'fire',
      attackType: 'fire',
      attackDamage: 30,
      maxHp: 78,
      weakness: 'water',
      resistance: null,
      retreat: 3,
    })
    const blastoise = createFighter({
      id: 9,
      cardType: 'water',
      attackType: 'water',
      attackDamage: 20,
      maxHp: 79,
      weakness: 'grass',
      resistance: 'fire',
      retreat: 3,
    })

    const result = simulateBattle(blastoise, charizard, { firstPlayerId: 9, maxTurns: 1 })

    expect(result.turns[0]?.baseDamage).toBe(20)
    expect(result.turns[0]?.weaknessApplied).toBe(true)
    expect(result.turns[0]?.finalDamage).toBe(40)
  })
})
