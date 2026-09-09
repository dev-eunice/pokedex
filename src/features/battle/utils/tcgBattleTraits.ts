/** Gen 1–style TCG weakness/resistance defaults by card type (×2 / −30). */
export interface TcgBattleTraits {
  weakness: string | null
  resistance: string | null
  retreat: number
}

const TYPE_TRAITS: Record<string, { weakness: string | null; resistance: string | null }> = {
  fire: { weakness: 'water', resistance: null },
  water: { weakness: 'grass', resistance: 'fire' },
  grass: { weakness: 'fire', resistance: null },
  electric: { weakness: 'fighting', resistance: null },
  normal: { weakness: 'fighting', resistance: null },
  fighting: { weakness: 'psychic', resistance: null },
  psychic: { weakness: 'psychic', resistance: null },
  poison: { weakness: 'psychic', resistance: null },
  ground: { weakness: 'grass', resistance: 'electric' },
  flying: { weakness: 'electric', resistance: 'fighting' },
  rock: { weakness: 'grass', resistance: null },
  bug: { weakness: 'fire', resistance: null },
  ghost: { weakness: 'psychic', resistance: null },
  ice: { weakness: 'fighting', resistance: null },
  dragon: { weakness: null, resistance: null },
  dark: { weakness: 'fighting', resistance: null },
  steel: { weakness: 'fire', resistance: null },
  fairy: { weakness: 'fighting', resistance: null },
}

const RETREAT_BY_TYPE: Record<string, number> = {
  normal: 1,
  bug: 1,
  electric: 1,
  fairy: 1,
  fire: 2,
  water: 2,
  grass: 2,
  poison: 2,
  psychic: 2,
  fighting: 2,
  flying: 2,
  ghost: 2,
  ice: 2,
  dark: 2,
  steel: 2,
  ground: 3,
  rock: 3,
  dragon: 3,
}

export function getTcgBattleTraits(cardType: string): TcgBattleTraits {
  const traits = TYPE_TRAITS[cardType] ?? { weakness: null, resistance: null }

  return {
    weakness: traits.weakness,
    resistance: traits.resistance,
    retreat: RETREAT_BY_TYPE[cardType] ?? 2,
  }
}

export function formatTcgTypeLabel(type: string): string {
  if (type === 'electric') return 'Lightning'
  if (type === 'normal') return 'Colorless'
  return type.charAt(0).toUpperCase() + type.slice(1)
}
