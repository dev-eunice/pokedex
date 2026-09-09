import { describe, expect, it } from 'vitest'
import { calculateTcgDamage } from '@/features/battle/utils/tcgDamage'

describe('calculateTcgDamage', () => {
  it('returns base damage when no weakness or resistance applies', () => {
    const result = calculateTcgDamage(30, 'fire', 'water', null)

    expect(result.finalDamage).toBe(30)
    expect(result.damageCounters).toBe(3)
    expect(result.weaknessApplied).toBe(false)
    expect(result.resistanceApplied).toBe(false)
  })

  it('doubles damage when weakness applies', () => {
    const result = calculateTcgDamage(30, 'water', 'water', null)

    expect(result.afterWeakness).toBe(60)
    expect(result.finalDamage).toBe(60)
    expect(result.weaknessApplied).toBe(true)
    expect(result.damageCounters).toBe(6)
  })

  it('applies weakness before resistance', () => {
    const result = calculateTcgDamage(20, 'fire', null, 'fire')

    expect(result.finalDamage).toBe(0)
    expect(result.resistanceApplied).toBe(true)
  })

  it('reduces damage by 30 when resistance applies', () => {
    const result = calculateTcgDamage(50, 'fire', null, 'fire')

    expect(result.finalDamage).toBe(20)
    expect(result.damageCounters).toBe(2)
  })
})
