import { describe, expect, it } from 'vitest'
import type { EvolutionChainLinkApi } from '@/features/pokemon/types/api.types'
import {
  buildEvolutionPaths,
  formatEvolutionTrigger,
  getPokemonEvolutionData,
  selectPrimaryEvolutionPath,
} from '@/features/pokemon/utils/evolutionTransform'

function species(id: number, name: string) {
  return {
    name,
    url: `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
  }
}

function levelUp(minLevel: number) {
  return {
    trigger: { name: 'level-up' },
    min_level: minLevel,
    item: null,
  }
}

describe('formatEvolutionTrigger', () => {
  it('formats level-up triggers', () => {
    expect(formatEvolutionTrigger(levelUp(16)).label).toBe('Level 16')
  })

  it('formats item triggers', () => {
    expect(
      formatEvolutionTrigger({
        trigger: { name: 'use-item' },
        min_level: null,
        item: { name: 'fire-stone' },
      }).label,
    ).toBe('Fire Stone')
  })
})

describe('buildEvolutionPaths', () => {
  it('builds a linear Gen 1 evolution line', () => {
    const chain: EvolutionChainLinkApi = {
      species: species(4, 'charmander'),
      evolution_details: [],
      evolves_to: [
        {
          species: species(5, 'charmeleon'),
          evolution_details: [levelUp(16)],
          evolves_to: [
            {
              species: species(6, 'charizard'),
              evolution_details: [levelUp(36)],
              evolves_to: [],
            },
          ],
        },
      ],
    }

    const paths = buildEvolutionPaths(chain)
    expect(paths).toHaveLength(1)
    expect(paths[0]?.stages.map((stage) => stage.id)).toEqual([4, 5, 6])
    expect(paths[0]?.triggers.map((trigger) => trigger.label)).toEqual([
      'Level 16',
      'Level 36',
    ])
  })

  it('builds multiple Gen 1 branches for Eevee', () => {
    const chain: EvolutionChainLinkApi = {
      species: species(133, 'eevee'),
      evolution_details: [],
      evolves_to: [
        {
          species: species(134, 'vaporeon'),
          evolution_details: [
            {
              trigger: { name: 'use-item' },
              min_level: null,
              item: { name: 'water-stone' },
            },
          ],
          evolves_to: [],
        },
        {
          species: species(135, 'jolteon'),
          evolution_details: [
            {
              trigger: { name: 'use-item' },
              min_level: null,
              item: { name: 'thunder-stone' },
            },
          ],
          evolves_to: [],
        },
      ],
    }

    const paths = buildEvolutionPaths(chain)
    expect(paths).toHaveLength(2)
    expect(paths.map((path) => path.stages.at(-1)?.id).sort()).toEqual([134, 135])
  })
})

describe('getPokemonEvolutionData', () => {
  it('selects the longest matching path for the current Pokémon', () => {
    const chain: EvolutionChainLinkApi = {
      species: species(1, 'bulbasaur'),
      evolution_details: [],
      evolves_to: [
        {
          species: species(2, 'ivysaur'),
          evolution_details: [levelUp(16)],
          evolves_to: [
            {
              species: species(3, 'venusaur'),
              evolution_details: [levelUp(32)],
              evolves_to: [],
            },
          ],
        },
      ],
    }

    const data = getPokemonEvolutionData(chain, 2)
    expect(data.hasEvolution).toBe(true)
    expect(data.primaryPath?.stages.map((stage) => stage.id)).toEqual([1, 2, 3])
  })

  it('marks single-stage Pokémon as non-evolving', () => {
    const chain: EvolutionChainLinkApi = {
      species: species(151, 'mew'),
      evolution_details: [],
      evolves_to: [],
    }

    const data = getPokemonEvolutionData(chain, 151)
    expect(data.hasEvolution).toBe(false)
    expect(selectPrimaryEvolutionPath(data.paths, 151)?.stages).toHaveLength(1)
  })
})
