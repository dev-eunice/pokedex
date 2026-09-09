export interface CapturedPokemon {
  pokemonId: number
  name: string
  nickname: string
  capturedAt: string
}

export type CapturedPokemonMap = Record<number, CapturedPokemon>
