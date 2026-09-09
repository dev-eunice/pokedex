import '@google/model-viewer'
import { Box, GitBranch, ImageIcon, Pause, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { EvolutionArtCanvas } from '@/features/pokemon/components/EvolutionArtCanvas'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { EvolutionPhase } from '@/features/pokemon/hooks/useEvolutionAnimation'
import type { EvolutionStageInfo } from '@/features/pokemon/types/domain.types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPokemonName } from '@/lib/utils/format'
import { getPokemon3DModelUrl } from '@/lib/utils/pokemon'
import { cn } from '@/lib/utils/cn'

export type ArtViewMode = '2d' | '3d'

interface EvolutionViewerState {
  canEvolve: boolean
  isPlaying: boolean
  phase: EvolutionPhase
  triggerLabel: string | null
  currentStage: EvolutionStageInfo | null
  displayIndex: number
  stageCount: number
  onPlay: () => void
  onStop: () => void
}

interface PokemonArtViewerProps {
  pokemonId: number
  pokemonName: string
  spriteUrl: string
  viewMode: ArtViewMode
  onViewModeChange: (mode: ArtViewMode) => void
  autoRotate: boolean
  onAutoRotateChange: (enabled: boolean) => void
  frameColor: string
  accentColor?: string
  evolution?: EvolutionViewerState
  className?: string
}

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

export function PokemonArtViewer({
  pokemonId,
  pokemonName,
  spriteUrl,
  viewMode,
  onViewModeChange,
  autoRotate,
  onAutoRotateChange,
  frameColor,
  accentColor = '#ef5350',
  evolution,
  className,
}: PokemonArtViewerProps) {
  const modelRef = useRef<HTMLElement>(null)
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle')

  const displayName = formatPokemonName(pokemonName)
  const modelUrl = getPokemon3DModelUrl(pokemonId)
  const showEvolutionCanvas =
    evolution?.isPlaying === true && evolution.currentStage != null

  useEffect(() => {
    if (viewMode !== '3d') {
      setModelStatus('idle')
      return
    }

    setModelStatus('loading')
    const element = modelRef.current
    if (!element) return

    function handleLoad() {
      setModelStatus('ready')
    }

    function handleError() {
      setModelStatus('error')
    }

    element.addEventListener('load', handleLoad)
    element.addEventListener('error', handleError)

    if ('loaded' in element && (element as HTMLElement & { loaded?: boolean }).loaded) {
      handleLoad()
    }

    return () => {
      element.removeEventListener('load', handleLoad)
      element.removeEventListener('error', handleError)
    }
  }, [viewMode, pokemonId, modelUrl])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <div
          className="inline-flex rounded-md border p-0.5"
          role="group"
          aria-label="Art view mode"
          style={{ borderColor: frameColor }}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 gap-1 px-2 text-[10px] font-bold uppercase',
              viewMode === '2d' && !showEvolutionCanvas && 'bg-white/60 shadow-sm',
            )}
            onClick={() => onViewModeChange('2d')}
            aria-pressed={viewMode === '2d' && !showEvolutionCanvas}
            disabled={showEvolutionCanvas}
          >
            <ImageIcon className="h-3 w-3" aria-hidden />
            2D
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 gap-1 px-2 text-[10px] font-bold uppercase',
              viewMode === '3d' && !showEvolutionCanvas && 'bg-white/60 shadow-sm',
            )}
            onClick={() => onViewModeChange('3d')}
            aria-pressed={viewMode === '3d' && !showEvolutionCanvas}
            disabled={showEvolutionCanvas}
          >
            <Box className="h-3 w-3" aria-hidden />
            3D
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {viewMode === '3d' && modelStatus !== 'error' && !showEvolutionCanvas ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 gap-1 px-2 text-[10px] font-bold uppercase',
                autoRotate && 'bg-white/60 shadow-sm',
              )}
              onClick={() => onAutoRotateChange(!autoRotate)}
              aria-pressed={autoRotate}
              aria-label={autoRotate ? 'Disable auto-rotate' : 'Enable auto-rotate'}
            >
              <RotateCw className={cn('h-3 w-3', autoRotate && 'animate-spin')} aria-hidden />
              Spin
            </Button>
          ) : null}

          {evolution?.canEvolve ? (
            evolution.isPlaying ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-[10px] font-bold uppercase bg-white/60 shadow-sm"
                onClick={evolution.onStop}
              >
                <Pause className="h-3 w-3" aria-hidden />
                Stop
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-[10px] font-bold uppercase"
                style={{ backgroundColor: `${accentColor}22` }}
                onClick={evolution.onPlay}
              >
                <GitBranch className="h-3 w-3" aria-hidden />
                Evolve
              </Button>
            )
          ) : null}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-md border-2 p-2"
        style={{ borderColor: frameColor, backgroundColor: 'rgba(255,255,255,0.35)' }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white/80">
          {showEvolutionCanvas && evolution.currentStage ? (
            <EvolutionArtCanvas
              stage={evolution.currentStage}
              phase={evolution.phase}
              triggerLabel={evolution.triggerLabel}
              accentColor={accentColor}
              frameColor={frameColor}
              displayName={displayName}
            />
          ) : viewMode === '2d' ? (
            <PokemonImage
              pokemonId={pokemonId}
              src={spriteUrl}
              alt={`${displayName} artwork`}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full scale-110 object-contain"
            />
          ) : modelStatus === 'error' ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
              <PokemonImage
                pokemonId={pokemonId}
                src={spriteUrl}
                alt={`${displayName} artwork fallback`}
                className="h-24 w-24 object-contain opacity-80"
              />
              <p className="text-[10px] font-semibold text-muted-foreground">
                3D model unavailable. Showing 2D artwork.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() => onViewModeChange('2d')}
              >
                Back to 2D
              </Button>
            </div>
          ) : (
            <>
              {modelStatus === 'loading' ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    Loading 3D model…
                  </p>
                </div>
              ) : null}

              <model-viewer
                ref={modelRef}
                src={modelUrl}
                alt={`${displayName} 3D model`}
                camera-controls=""
                auto-rotate={autoRotate ? '' : undefined}
                rotation-per-second="30deg"
                shadow-intensity="1"
                exposure="1"
                interaction-prompt="auto"
                touch-action="none"
                loading="eager"
                className="h-full w-full"
                style={{ minHeight: '100%', backgroundColor: 'transparent' }}
              />
            </>
          )}
        </div>
      </div>

      {showEvolutionCanvas ? (
        <p className="text-center text-[9px] font-bold uppercase tracking-wide opacity-80">
          Stage {evolution.displayIndex + 1} of {evolution.stageCount}
        </p>
      ) : viewMode === '3d' && modelStatus === 'ready' ? (
        <p className="text-center text-[9px] font-medium italic opacity-70">
          <span className="sm:hidden">Drag to rotate · Pinch to zoom</span>
          <span className="hidden sm:inline">Drag to rotate · Scroll to zoom</span>
        </p>
      ) : null}
    </div>
  )
}
