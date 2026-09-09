import {
  GEN1_END,
  GEN1_START,
  OFFICIAL_ARTWORK_BASE,
  POKEMON_3D_MODEL_BASE,
  SPRITE_BASE,
} from '@/lib/constants'

export function extractPokemonIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)
  if (!match) {
    throw new Error(`Unable to extract Pokémon ID from URL: ${url}`)
  }
  return Number.parseInt(match[1], 10)
}

export function extractSpeciesIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon-species\/(\d+)\/?$/)
  if (!match) {
    throw new Error(`Unable to extract species ID from URL: ${url}`)
  }
  return Number.parseInt(match[1], 10)
}

export function getPokemonArtworkUrl(id: number): string {
  return `${OFFICIAL_ARTWORK_BASE}/${id}.png`
}

export function getPokemonPixelSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`
}

/** High-resolution official artwork, with pixel sprite available as fallback. */
export function getPokemonSpriteUrl(id: number): string {
  return getPokemonArtworkUrl(id)
}

export function prefetchPokemonImage(id: number, src?: string): void {
  const url = src ?? getPokemonArtworkUrl(id)
  const image = new Image()
  image.src = url
}

export function getPokemon3DModelUrl(id: number): string {
  return `${POKEMON_3D_MODEL_BASE}/${id}.glb`
}

export function isValidGen1Id(id: number): boolean {
  return Number.isInteger(id) && id >= GEN1_START && id <= GEN1_END
}

export function paginateArray<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}
