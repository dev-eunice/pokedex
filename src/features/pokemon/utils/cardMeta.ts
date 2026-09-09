import gen1CardMeta from '@/features/pokemon/data/gen1CardMeta.json'

interface CardMetaEntry {
  type: string
  hp: number
}

const meta = gen1CardMeta as Record<string, CardMetaEntry>

export interface PokemonCardMeta {
  type: string
  hp: number
  attackName: string
  attackDamage: number
}

const ATTACK_NAMES: Record<string, string> = {
  normal: 'Tackle',
  fire: 'Ember',
  water: 'Water Gun',
  grass: 'Vine Whip',
  electric: 'Thunder Shock',
  ice: 'Powder Snow',
  fighting: 'Karate Chop',
  poison: 'Poison Sting',
  ground: 'Mud Slap',
  flying: 'Gust',
  psychic: 'Confusion',
  bug: 'Bug Bite',
  rock: 'Rock Throw',
  ghost: 'Lick',
  dragon: 'Dragon Rage',
  dark: 'Bite',
  steel: 'Metal Claw',
  fairy: 'Fairy Wind',
}

export function getPokemonCardMeta(id: number): PokemonCardMeta {
  const entry = meta[String(id)] ?? { type: 'normal', hp: 50 }
  const attackName = ATTACK_NAMES[entry.type] ?? 'Strike'
  const attackDamage = Math.max(10, Math.round(entry.hp / 3))

  return {
    type: entry.type,
    hp: entry.hp,
    attackName,
    attackDamage,
  }
}
