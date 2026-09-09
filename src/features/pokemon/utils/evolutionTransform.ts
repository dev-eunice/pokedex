import type {
  EvolutionChainLinkApi,
  EvolutionDetailApi,
} from '@/features/pokemon/types/api.types'
import type {
  EvolutionPathInfo,
  EvolutionStageInfo,
  EvolutionTriggerInfo,
  PokemonEvolutionData,
} from '@/features/pokemon/types/domain.types'
import { formatPokemonName } from '@/lib/utils/format'
import {
  extractSpeciesIdFromUrl,
  getPokemonSpriteUrl,
  isValidGen1Id,
} from '@/lib/utils/pokemon'

function toStage(link: EvolutionChainLinkApi): EvolutionStageInfo {
  const id = extractSpeciesIdFromUrl(link.species.url)
  return {
    id,
    name: link.species.name,
    spriteUrl: getPokemonSpriteUrl(id),
  }
}

export function formatEvolutionTrigger(
  detail: EvolutionDetailApi | undefined,
): EvolutionTriggerInfo {
  if (!detail) {
    return { label: 'Evolve' }
  }

  const trigger = detail.trigger.name

  if (trigger === 'level-up' && detail.min_level != null) {
    return { label: `Level ${detail.min_level}` }
  }

  if (trigger === 'use-item' && detail.item) {
    return { label: formatPokemonName(detail.item.name) }
  }

  if (trigger === 'trade') {
    return { label: 'Trade' }
  }

  return { label: formatPokemonName(trigger) }
}

function walkChain(
  node: EvolutionChainLinkApi,
  stages: EvolutionStageInfo[],
  triggers: EvolutionTriggerInfo[],
  paths: EvolutionPathInfo[],
): void {
  const stage = toStage(node)
  if (!isValidGen1Id(stage.id)) {
    return
  }

  const nextStages = [...stages, stage]

  if (node.evolves_to.length === 0) {
    paths.push({ stages: nextStages, triggers })
    return
  }

  for (const evolution of node.evolves_to) {
    const childStage = toStage(evolution)
    if (!isValidGen1Id(childStage.id)) {
      continue
    }

    walkChain(
      evolution,
      nextStages,
      [...triggers, formatEvolutionTrigger(evolution.evolution_details[0])],
      paths,
    )
  }
}

export function buildEvolutionPaths(chain: EvolutionChainLinkApi): EvolutionPathInfo[] {
  const paths: EvolutionPathInfo[] = []
  walkChain(chain, [], [], paths)
  return paths
}

export function selectPrimaryEvolutionPath(
  paths: EvolutionPathInfo[],
  currentId: number,
): EvolutionPathInfo | null {
  if (paths.length === 0) {
    return null
  }

  const matchingPaths = paths.filter((path) =>
    path.stages.some((stage) => stage.id === currentId),
  )

  if (matchingPaths.length === 0) {
    return paths[0] ?? null
  }

  return matchingPaths.reduce((longest, path) =>
    path.stages.length > longest.stages.length ? path : longest,
  )
}

export function getPokemonEvolutionData(
  chain: EvolutionChainLinkApi,
  currentId: number,
): PokemonEvolutionData {
  const paths = buildEvolutionPaths(chain)
  const primaryPath = selectPrimaryEvolutionPath(paths, currentId)
  const hasEvolution = paths.some((path) => path.stages.length > 1)

  return {
    paths,
    primaryPath,
    hasEvolution,
  }
}
