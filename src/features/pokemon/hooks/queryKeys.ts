export const pokemonQueryKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonQueryKeys.all, 'list'] as const,
  list: (limit: number, offset: number) =>
    [...pokemonQueryKeys.lists(), { limit, offset }] as const,
  gen1All: () => [...pokemonQueryKeys.all, 'gen1-all'] as const,
  details: () => [...pokemonQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...pokemonQueryKeys.details(), id] as const,
  evolutions: () => [...pokemonQueryKeys.all, 'evolution'] as const,
  evolution: (id: number) => [...pokemonQueryKeys.evolutions(), id] as const,
}
