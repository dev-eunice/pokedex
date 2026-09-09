export interface BattleFighter {
  id: number
  name: string
  spriteUrl: string
  cardType: string
  maxHp: number
  attackName: string
  attackDamage: number
  attackType: string
  weakness: string | null
  resistance: string | null
  retreat: number
}

export interface BattleTurn {
  turn: number
  attackerId: number
  defenderId: number
  attackName: string
  baseDamage: number
  afterWeakness: number
  finalDamage: number
  weaknessApplied: boolean
  resistanceApplied: boolean
  damageCounters: number
  knockedOut: boolean
  attackerHpBefore: number
  attackerHpAfter: number
  defenderHpBefore: number
  defenderHpAfter: number
}

export interface BattleResult {
  fighter1: BattleFighter
  fighter2: BattleFighter
  coinFlipWinnerId: number
  firstPlayerId: number
  turns: BattleTurn[]
  winnerId: number | null
  totalTurns: number
}

export interface SimulateBattleOptions {
  maxTurns?: number
  firstPlayerId?: number
}
