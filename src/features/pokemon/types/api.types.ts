export interface PokemonListResultApi {
  name: string
  url: string
}

export interface PokemonListResponseApi {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListResultApi[]
}

export interface PokemonTypeSlotApi {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonAbilitySlotApi {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokemonStatSlotApi {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonDetailResponseApi {
  id: number
  name: string
  height: number
  weight: number
  types: PokemonTypeSlotApi[]
  abilities: PokemonAbilitySlotApi[]
  stats: PokemonStatSlotApi[]
}

export interface PokemonSpeciesResponseApi {
  evolution_chain: {
    url: string
  }
}

export interface EvolutionDetailApi {
  trigger: {
    name: string
  }
  min_level: number | null
  item: {
    name: string
  } | null
}

export interface EvolutionChainLinkApi {
  species: {
    name: string
    url: string
  }
  evolution_details: EvolutionDetailApi[]
  evolves_to: EvolutionChainLinkApi[]
}

export interface EvolutionChainResponseApi {
  id: number
  chain: EvolutionChainLinkApi
}
