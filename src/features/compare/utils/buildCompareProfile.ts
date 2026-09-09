import type { CompareProfile } from '@/features/compare/types/compare.types'
import type { PokemonDetails, PokemonSummary } from '@/features/pokemon/types/domain.types'
import { getPokemonCardMeta } from '@/features/pokemon/utils/cardMeta'

function buildFromSummary(summary: PokemonSummary, details?: PokemonDetails): CompareProfile {
  const cardMeta = getPokemonCardMeta(summary.id)

  return {
    id: summary.id,
    name: summary.name,
    spriteUrl: summary.spriteUrl,
    types: details?.types.length ? details.types : [cardMeta.type],
    cardType: cardMeta.type,
    hp: cardMeta.hp,
    attackName: cardMeta.attackName,
    attackDamage: cardMeta.attackDamage,
    attackType: cardMeta.type,
    weakness: cardMeta.weakness,
    resistance: cardMeta.resistance,
    retreat: cardMeta.retreat,
    stats: details?.stats ?? [],
    height: details?.height,
    weight: details?.weight,
  }
}

export function buildCompareProfileFromSummary(summary: PokemonSummary): CompareProfile {
  return buildFromSummary(summary)
}

export function buildCompareProfileFromDetails(details: PokemonDetails): CompareProfile {
  return buildFromSummary(
    { id: details.id, name: details.name, spriteUrl: details.spriteUrl },
    details,
  )
}
