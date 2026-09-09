export type EffectivenessLabel = 'super' | 'neutral' | 'weak' | 'immune'

/** Simplified Gen 1–aligned type chart (attack type → defending type multipliers). */
const TYPE_CHART: Record<string, Partial<Record<string, number>>> = {
  normal: { rock: 0.5, ghost: 0 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
  },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
  },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, bug: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2 },
  ghost: { normal: 0, psychic: 0, ghost: 2 },
  dragon: { dragon: 2 },
}

export function getTypeMultiplier(attackType: string, defenderTypes: string[]): number {
  if (defenderTypes.length === 0) return 1

  return defenderTypes.reduce((total, defenderType) => {
    const match = TYPE_CHART[attackType]?.[defenderType]
    return total * (match ?? 1)
  }, 1)
}

export function getEffectivenessLabel(multiplier: number): EffectivenessLabel {
  if (multiplier === 0) return 'immune'
  if (multiplier >= 2) return 'super'
  if (multiplier <= 0.5) return 'weak'
  return 'neutral'
}

export function formatEffectivenessLabel(label: EffectivenessLabel): string {
  switch (label) {
    case 'super':
      return "It's super effective!"
    case 'weak':
      return "It's not very effective…"
    case 'immune':
      return "It doesn't affect the target…"
    default:
      return ''
  }
}
