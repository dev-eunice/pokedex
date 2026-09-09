import type { PokemonStat } from '@/features/pokemon/types/domain.types'

export interface CompareProfile {
  id: number
  name: string
  spriteUrl: string
  types: string[]
  cardType: string
  hp: number
  attackName: string
  attackDamage: number
  attackType: string
  weakness: string | null
  resistance: string | null
  retreat: number
  stats: PokemonStat[]
  height?: number
  weight?: number
}

export type MatchupVerdict = 'favored' | 'unfavorable' | 'even'

export interface DirectionalMatchup {
  attackerId: number
  defenderId: number
  baseDamage: number
  finalDamage: number
  turnsToKnockOut: number
  weaknessApplied: boolean
  resistanceApplied: boolean
  notes: string[]
}

export interface HeadToHeadMatchup {
  pokemon1: CompareProfile
  pokemon2: CompareProfile
  pokemon1Attacks: DirectionalMatchup
  pokemon2Attacks: DirectionalMatchup
  verdict: MatchupVerdict
  favoredId: number | null
  summary: string
  margin: number
}

export interface PokemonMatchupEntry {
  opponentId: number
  opponentName: string
  opponentSpriteUrl: string
  favoredId: number
  summary: string
  margin: number
}

export interface PokemonMatchupLists {
  favorable: PokemonMatchupEntry[]
  unfavorable: PokemonMatchupEntry[]
}
