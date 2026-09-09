export const GEN1_START = 1
export const GEN1_END = 151
export const GEN1_TOTAL = GEN1_END - GEN1_START + 1

export const PAGE_SIZE = 24

export const POKEAPI_BASE = 'https://pokeapi.co/api/v2'
export const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export const OFFICIAL_ARTWORK_BASE = `${SPRITE_BASE}/other/official-artwork`

export const NICKNAME_MAX_LENGTH = 20

export const STORAGE_KEYS = {
  captured: 'pokedex-captured',
  theme: 'pokedex-theme',
  viewMode: 'pokedex-view-mode',
} as const

export type ViewMode = 'grid' | 'list'
export type Theme = 'light' | 'dark'
