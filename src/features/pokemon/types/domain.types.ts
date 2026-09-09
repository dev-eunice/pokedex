export interface PokemonSummary {
  id: number
  name: string
  spriteUrl: string
}

export interface PokemonAbility {
  name: string
  isHidden: boolean
}

export interface PokemonStat {
  name: string
  label: string
  value: number
}

export interface PokemonDetails extends PokemonSummary {
  height: number
  weight: number
  types: string[]
  abilities: PokemonAbility[]
  stats: PokemonStat[]
}

export interface PokemonListPage {
  items: PokemonSummary[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
