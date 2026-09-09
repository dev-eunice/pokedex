import type { BattleFighter } from '@/features/battle/types/battle.types'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'
import { getPokemonCardMeta } from '@/features/pokemon/utils/cardMeta'

function buildFromCardMeta(summary: PokemonSummary): BattleFighter {
  const cardMeta = getPokemonCardMeta(summary.id)

  return {
    id: summary.id,
    name: summary.name,
    spriteUrl: summary.spriteUrl,
    cardType: cardMeta.type,
    maxHp: cardMeta.hp,
    attackName: cardMeta.attackName,
    attackDamage: cardMeta.attackDamage,
    attackType: cardMeta.type,
    weakness: cardMeta.weakness,
    resistance: cardMeta.resistance,
    retreat: cardMeta.retreat,
  }
}

export function buildPreviewFighter(summary: PokemonSummary): BattleFighter {
  return buildFromCardMeta(summary)
}

export function buildBattleFighter(summary: PokemonSummary): BattleFighter {
  return buildFromCardMeta(summary)
}
