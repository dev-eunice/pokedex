import { calculateTcgDamage } from '@/features/battle/utils/tcgDamage'
import { formatTcgTypeLabel } from '@/features/battle/utils/tcgBattleTraits'
import type {
  CompareProfile,
  DirectionalMatchup,
  HeadToHeadMatchup,
  MatchupVerdict,
  PokemonMatchupEntry,
  PokemonMatchupLists,
} from '@/features/compare/types/compare.types'
import { formatPokemonName } from '@/lib/utils/format'

function analyzeDirection(
  attacker: CompareProfile,
  defender: CompareProfile,
): DirectionalMatchup {
  const damage = calculateTcgDamage(
    attacker.attackDamage,
    attacker.attackType,
    defender.weakness,
    defender.resistance,
  )

  const notes: string[] = []

  if (damage.weaknessApplied && defender.weakness) {
    notes.push(`Hits ${formatTcgTypeLabel(defender.weakness)} weakness (×2)`)
  }

  if (damage.resistanceApplied && defender.resistance) {
    notes.push(`Reduced by ${formatTcgTypeLabel(defender.resistance)} resistance (−30)`)
  }

  const turnsToKnockOut =
    damage.finalDamage > 0 ? Math.ceil(defender.hp / damage.finalDamage) : Number.POSITIVE_INFINITY

  return {
    attackerId: attacker.id,
    defenderId: defender.id,
    baseDamage: damage.baseDamage,
    finalDamage: damage.finalDamage,
    turnsToKnockOut,
    weaknessApplied: damage.weaknessApplied,
    resistanceApplied: damage.resistanceApplied,
    notes,
  }
}

function getVerdict(margin: number): MatchupVerdict {
  if (margin >= 1) return 'favored'
  if (margin <= -1) return 'unfavorable'
  return 'even'
}

function buildSummary(
  pokemon1: CompareProfile,
  pokemon2: CompareProfile,
  pokemon1Attacks: DirectionalMatchup,
  pokemon2Attacks: DirectionalMatchup,
  favoredId: number | null,
): string {
  const name1 = formatPokemonName(pokemon1.name)
  const name2 = formatPokemonName(pokemon2.name)

  if (favoredId == null) {
    return `${name1} and ${name2} look evenly matched in TCG damage trades.`
  }

  const favored = favoredId === pokemon1.id ? pokemon1 : pokemon2
  const underdog = favoredId === pokemon1.id ? pokemon2 : pokemon1
  const favoredName = formatPokemonName(favored.name)
  const underdogName = formatPokemonName(underdog.name)
  const favoredAttack =
    favoredId === pokemon1.id ? pokemon1Attacks : pokemon2Attacks

  if (favoredAttack.weaknessApplied && underdog.weakness) {
    return `${favoredName} favored vs ${underdogName} due to ${formatTcgTypeLabel(underdog.weakness)} weakness.`
  }

  if (favoredAttack.resistanceApplied === false && favoredAttack.finalDamage > favored.attackDamage) {
    // weakness already handled
  }

  const underdogAttack =
    favoredId === pokemon1.id ? pokemon2Attacks : pokemon1Attacks

  if (underdogAttack.resistanceApplied && favored.attackType === underdog.resistance) {
    return `${favoredName} favored vs ${underdogName} — ${underdogName} struggles against ${favoredName}'s ${formatTcgTypeLabel(favored.attackType)} attacks while taking heavier hits.`
  }

  if (favored.hp > underdog.hp && favoredAttack.finalDamage >= underdogAttack.finalDamage) {
    return `${favoredName} favored vs ${underdogName} with higher TCG HP and stronger damage output.`
  }

  if (favoredAttack.finalDamage > underdogAttack.finalDamage) {
    return `${favoredName} favored vs ${underdogName} — deals ${favoredAttack.finalDamage} per attack vs ${underdogAttack.finalDamage}.`
  }

  return `${favoredName} favored vs ${underdogName} — knocks out in fewer turns (${favoredAttack.turnsToKnockOut} vs ${underdogAttack.turnsToKnockOut}).`
}

/** Positive margin means pokemon1 is favored (needs fewer turns to KO pokemon2). */
export function getMatchupMargin(
  pokemon1Attacks: DirectionalMatchup,
  pokemon2Attacks: DirectionalMatchup,
): number {
  if (
    !Number.isFinite(pokemon1Attacks.turnsToKnockOut) &&
    !Number.isFinite(pokemon2Attacks.turnsToKnockOut)
  ) {
    return 0
  }

  if (!Number.isFinite(pokemon1Attacks.turnsToKnockOut)) return -10
  if (!Number.isFinite(pokemon2Attacks.turnsToKnockOut)) return 10

  return pokemon2Attacks.turnsToKnockOut - pokemon1Attacks.turnsToKnockOut
}

export function analyzeHeadToHead(
  pokemon1: CompareProfile,
  pokemon2: CompareProfile,
): HeadToHeadMatchup {
  const pokemon1Attacks = analyzeDirection(pokemon1, pokemon2)
  const pokemon2Attacks = analyzeDirection(pokemon2, pokemon1)
  const margin = getMatchupMargin(pokemon1Attacks, pokemon2Attacks)
  const verdict = getVerdict(margin)

  let favoredId: number | null = null
  if (margin > 0) favoredId = pokemon1.id
  else if (margin < 0) favoredId = pokemon2.id

  const summary = buildSummary(
    pokemon1,
    pokemon2,
    pokemon1Attacks,
    pokemon2Attacks,
    favoredId,
  )

  return {
    pokemon1,
    pokemon2,
    pokemon1Attacks,
    pokemon2Attacks,
    verdict,
    favoredId,
    summary,
    margin,
  }
}

export function getPokemonMatchups(
  pokemon: CompareProfile,
  opponents: CompareProfile[],
  limit = 8,
): PokemonMatchupLists {
  const favorable: PokemonMatchupEntry[] = []
  const unfavorable: PokemonMatchupEntry[] = []

  for (const opponent of opponents) {
    if (opponent.id === pokemon.id) continue

    const matchup = analyzeHeadToHead(pokemon, opponent)
    const entry: PokemonMatchupEntry = {
      opponentId: opponent.id,
      opponentName: opponent.name,
      opponentSpriteUrl: opponent.spriteUrl,
      favoredId: matchup.favoredId ?? pokemon.id,
      summary: matchup.summary,
      margin: Math.abs(matchup.margin),
    }

    if (matchup.favoredId === pokemon.id) {
      favorable.push(entry)
    } else if (matchup.favoredId === opponent.id) {
      unfavorable.push(entry)
    }
  }

  favorable.sort((a, b) => b.margin - a.margin)
  unfavorable.sort((a, b) => b.margin - a.margin)

  return {
    favorable: favorable.slice(0, limit),
    unfavorable: unfavorable.slice(0, limit),
  }
}
