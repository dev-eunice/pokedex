import { describe, expect, it } from 'vitest'
import {
  formatEffectivenessLabel,
  getEffectivenessLabel,
  getTypeMultiplier,
} from '@/features/battle/utils/typeEffectiveness'

describe('getTypeMultiplier', () => {
  it('returns super effective multiplier for fire vs grass', () => {
    expect(getTypeMultiplier('fire', ['grass'])).toBe(2)
  })

  it('returns not very effective for water vs grass', () => {
    expect(getTypeMultiplier('water', ['grass'])).toBe(0.5)
  })

  it('returns zero for ground vs flying', () => {
    expect(getTypeMultiplier('ground', ['flying'])).toBe(0)
  })

  it('stacks multipliers for dual types', () => {
    expect(getTypeMultiplier('rock', ['fire', 'flying'])).toBe(4)
  })
})

describe('getEffectivenessLabel', () => {
  it('labels super effective hits', () => {
    expect(getEffectivenessLabel(2)).toBe('super')
    expect(formatEffectivenessLabel('super')).toContain('super effective')
  })

  it('labels immune hits', () => {
    expect(getEffectivenessLabel(0)).toBe('immune')
  })
})
