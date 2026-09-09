import { Sparkles, Zap } from 'lucide-react'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { EvolutionPhase } from '@/features/pokemon/hooks/useEvolutionAnimation'
import type { EvolutionStageInfo } from '@/features/pokemon/types/domain.types'
import { formatPokedexNumber, formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

const PARTICLE_COUNT = 14

interface EvolutionArtCanvasProps {
  stage: EvolutionStageInfo
  phase: EvolutionPhase
  triggerLabel?: string | null
  accentColor: string
  frameColor: string
  displayName: string
}

export function EvolutionArtCanvas({
  stage,
  phase,
  triggerLabel,
  accentColor,
  frameColor,
  displayName,
}: EvolutionArtCanvasProps) {
  const isActive = phase !== 'idle' && phase !== 'complete'

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white/80">
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          phase === 'charge' || phase === 'flash' || phase === 'reveal'
            ? 'opacity-100'
            : 'opacity-0',
        )}
        style={{
          background: `radial-gradient(circle at center, ${accentColor}55 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-white transition-opacity duration-150',
          phase === 'flash' ? 'animate-evolution-flash opacity-95' : 'opacity-0',
        )}
        aria-hidden
      />

      {isActive ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
            <span
              key={index}
              className={cn(
                'absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full',
                (phase === 'reveal' || phase === 'charge') && 'animate-evolution-particle',
              )}
              style={{
                backgroundColor: index % 2 === 0 ? accentColor : '#ffd54f',
                animationDelay: `${index * 45}ms`,
                ['--particle-angle' as string]: `${index * (360 / PARTICLE_COUNT)}deg`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center',
          phase === 'reveal' && 'animate-evolution-ring',
        )}
        aria-hidden
      >
        <span
          className="h-28 w-28 rounded-full border-4 opacity-0"
          style={{ borderColor: accentColor }}
        />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-3 py-2">
        {(phase === 'announce' || phase === 'charge') && triggerLabel ? (
          <p
            className="absolute top-2 z-20 animate-evolution-banner rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            {triggerLabel}
          </p>
        ) : null}

        {phase === 'announce' ? (
          <p className="absolute top-10 z-20 animate-evolution-banner text-[10px] font-black uppercase tracking-wide text-foreground/80">
            What? {displayName} is evolving!
          </p>
        ) : null}

        {phase === 'reveal' ? (
          <p className="absolute top-2 z-20 animate-evolution-banner text-[10px] font-black uppercase tracking-wide text-foreground/90">
            Congratulations! Evolved into {formatPokemonName(stage.name)}!
          </p>
        ) : null}

        <div
          className={cn(
            'relative flex h-[72%] w-[72%] max-h-48 max-w-48 items-center justify-center',
            phase === 'charge' && 'animate-evolution-shake',
            phase === 'flash' && 'animate-evolution-shrink',
            phase === 'reveal' && 'animate-evolution-pop',
          )}
        >
          <div
            className={cn(
              'absolute inset-0 rounded-full blur-xl transition-opacity duration-300',
              phase === 'charge' && 'animate-evolution-glow opacity-80',
              phase === 'reveal' && 'opacity-70',
            )}
            style={{ backgroundColor: accentColor }}
            aria-hidden
          />

          <div
            className="relative h-full w-full overflow-hidden rounded-full border-2 bg-white/90 p-3 shadow-inner"
            style={{ borderColor: frameColor }}
          >
            <PokemonImage
              pokemonId={stage.id}
              src={stage.spriteUrl}
              alt={formatPokemonName(stage.name)}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-contain"
            />
          </div>

          {phase === 'charge' ? (
            <Zap
              className="absolute -right-1 -top-1 h-5 w-5 animate-pulse text-yellow-400 drop-shadow"
              aria-hidden
            />
          ) : null}

          {phase === 'reveal' ? (
            <Sparkles
              className="absolute -left-1 top-0 h-5 w-5 animate-spin text-yellow-400"
              style={{ animationDuration: '2s' }}
              aria-hidden
            />
          ) : null}
        </div>

        <div className="mt-2 text-center">
          <p className="text-[11px] font-black uppercase">{formatPokemonName(stage.name)}</p>
          <p className="text-[9px] font-semibold opacity-70">
            {formatPokedexNumber(stage.id)}
          </p>
        </div>
      </div>
    </div>
  )
}
