import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import { useEvolutionChain } from '@/features/pokemon/hooks/useEvolutionChain'
import type { EvolutionPathInfo } from '@/features/pokemon/types/domain.types'
import type { getTcgTheme } from '@/features/pokemon/utils/tcgTheme'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPokedexNumber, formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface EvolutionChainPanelProps {
  pokemonId: number
  theme: ReturnType<typeof getTcgTheme>
  activeStageId?: number
}

function EvolutionPathRow({
  path,
  currentId,
  activeStageId,
  theme,
  compact = false,
}: {
  path: EvolutionPathInfo
  currentId: number
  activeStageId?: number
  theme: ReturnType<typeof getTcgTheme>
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        compact && 'rounded-md border px-2 py-2',
      )}
      style={
        compact
          ? { borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.15)' }
          : undefined
      }
    >
      {path.stages.map((stage, index) => {
        const isCurrent = stage.id === currentId
        const isAnimating = activeStageId === stage.id
        const trigger = path.triggers[index - 1]

        return (
          <div key={`${path.stages[0]?.id}-${stage.id}`} className="flex items-center gap-2">
            {index > 0 ? (
              <div className="flex flex-col items-center gap-0.5">
                <ChevronRight className="h-4 w-4 opacity-60" aria-hidden />
                {trigger ? (
                  <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">
                    {trigger.label}
                  </span>
                ) : null}
              </div>
            ) : null}

            <Link
              to={`/pokemon/${stage.id}`}
              className={cn(
                'group flex flex-col items-center gap-1 rounded-lg border px-2 py-1.5 transition-transform hover:-translate-y-0.5',
                (isCurrent || isAnimating) && 'border-2 shadow-sm',
                isAnimating && 'animate-evolution-glow',
              )}
              style={{
                borderColor: isCurrent || isAnimating ? theme.accent : theme.frame,
                backgroundColor:
                  isCurrent || isAnimating
                    ? 'rgba(255,255,255,0.35)'
                    : 'rgba(255,255,255,0.2)',
              }}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <div className="h-12 w-12 overflow-hidden rounded-md bg-white/80 p-1 sm:h-14 sm:w-14">
                <PokemonImage
                  pokemonId={stage.id}
                  src={stage.spriteUrl}
                  alt={formatPokemonName(stage.name)}
                  loading="eager"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="max-w-[72px] truncate text-[10px] font-black uppercase">
                {formatPokemonName(stage.name)}
              </span>
              <span className="text-[8px] font-semibold opacity-70">
                {formatPokedexNumber(stage.id)}
              </span>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export function EvolutionChainPanel({
  pokemonId,
  theme,
  activeStageId,
}: EvolutionChainPanelProps) {
  const { data, isLoading, error, refetch } = useEvolutionChain(pokemonId)

  if (isLoading) {
    return (
      <section
        className="overflow-hidden rounded-[14px] border-[3px] shadow-md"
        style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
      >
        <h2
          className="px-4 py-2 text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: theme.header }}
        >
          Evolution
        </h2>
        <div className="space-y-3 p-4">
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </section>
    )
  }

  if (error || !data) {
    return (
      <section
        className="overflow-hidden rounded-[14px] border-[3px] shadow-md"
        style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
      >
        <h2
          className="px-4 py-2 text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: theme.header }}
        >
          Evolution
        </h2>
        <div className="p-4">
          <ErrorState
            title="Unable to load evolution data"
            message="Evolution chain could not be fetched from PokéAPI."
            onRetry={() => void refetch()}
          />
        </div>
      </section>
    )
  }

  if (!data.hasEvolution || !data.primaryPath) {
    return (
      <section
        className="overflow-hidden rounded-[14px] border-[3px] shadow-md"
        style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
      >
        <h2
          className="px-4 py-2 text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: theme.header }}
        >
          Evolution
        </h2>
        <div className="p-4">
          <p
            className="rounded-md border px-4 py-3 text-sm font-semibold italic"
            style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            This Pokémon does not evolve within the Gen 1 Pokédex line.
          </p>
        </div>
      </section>
    )
  }

  const hasMultiplePaths = data.paths.length > 1
  const primaryPathKey = data.primaryPath.stages.map((stage) => stage.id).join('-')
  const otherPaths = data.paths.filter(
    (path) => path.stages.map((stage) => stage.id).join('-') !== primaryPathKey,
  )

  return (
    <section
      className="overflow-hidden rounded-[14px] border-[3px] shadow-md"
      style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
    >
      <h2
        className="px-4 py-2 text-xs font-black uppercase tracking-widest"
        style={{ backgroundColor: theme.header }}
      >
        Evolution
      </h2>
      <div className="space-y-4 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
          {hasMultiplePaths ? 'Primary evolution line' : 'Evolution chain'}
        </p>
        <EvolutionPathRow
          path={data.primaryPath}
          currentId={pokemonId}
          activeStageId={activeStageId}
          theme={theme}
        />

        {hasMultiplePaths && otherPaths.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
              Other Gen 1 branches
            </p>
            <div className="space-y-2">
              {otherPaths.map((path) => (
                <EvolutionPathRow
                  key={path.stages.map((stage) => stage.id).join('-')}
                  path={path}
                  currentId={pokemonId}
                  activeStageId={activeStageId}
                  theme={theme}
                  compact
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
