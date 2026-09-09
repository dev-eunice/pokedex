export const TCG_WEAKNESS_MULTIPLIER = 2
export const TCG_RESISTANCE_REDUCTION = 30

export interface TcgDamageResult {
  baseDamage: number
  afterWeakness: number
  finalDamage: number
  weaknessApplied: boolean
  resistanceApplied: boolean
  damageCounters: number
}

/** Official TCG order: base damage → weakness (×2) → resistance (−30). */
export function calculateTcgDamage(
  baseDamage: number,
  attackType: string,
  defenderWeakness: string | null,
  defenderResistance: string | null,
): TcgDamageResult {
  let damage = baseDamage
  let weaknessApplied = false
  let resistanceApplied = false

  if (defenderWeakness && attackType === defenderWeakness) {
    damage *= TCG_WEAKNESS_MULTIPLIER
    weaknessApplied = true
  }

  const afterWeakness = damage

  if (defenderResistance && attackType === defenderResistance) {
    damage = Math.max(0, damage - TCG_RESISTANCE_REDUCTION)
    resistanceApplied = true
  }

  const finalDamage = damage

  return {
    baseDamage,
    afterWeakness,
    finalDamage,
    weaknessApplied,
    resistanceApplied,
    damageCounters: Math.floor(finalDamage / 10),
  }
}
