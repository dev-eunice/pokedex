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
