import { ArrowLeft, CheckCircle2, Ruler, Scale, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { CaptureDialog } from '@/features/pokemon/components/CaptureDialog'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import { ConfirmDialog } from '@/features/pokemon/components/ConfirmDialog'
import { PokemonStats } from '@/features/pokemon/components/PokemonStats'
import { PokemonTypeBadge } from '@/features/pokemon/components/PokemonTypeBadge'
import { usePokemon } from '@/features/pokemon/hooks/usePokemon'
import {
  useCapturedPokemonActions,
  useCapturedPokemonMap,
  useIsCaptured,
} from '@/hooks/useCapturedPokemon'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  formatCaptureDate,
  formatHeight,
  formatPokedexNumber,
  formatPokemonName,
  formatWeight,
} from '@/lib/utils/format'
import { isValidGen1Id } from '@/lib/utils/pokemon'

function PokemonDetailsSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading Pokémon details">
      <Skeleton className="h-10 w-32" />
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function PokemonDetailsPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const id = Number.parseInt(idParam ?? '', 10)
  const isValidId = isValidGen1Id(id)

  const { data, isLoading, error, refetch } = usePokemon(id)
  const isCaptured = useIsCaptured(id)
  const capturedMap = useCapturedPokemonMap()
  const capturedEntry = capturedMap[id]
  const { uncapture } = useCapturedPokemonActions()
  const { toast } = useToast()

  const [captureOpen, setCaptureOpen] = useState(false)
  const [uncaptureOpen, setUncaptureOpen] = useState(false)

  if (!isValidId) {
    return (
      <ErrorState
        title="Invalid Pokémon"
        message="This Pokédex only includes Gen 1 Pokémon (#001–#151)."
        onRetry={() => navigate('/')}
      />
    )
  }

  if (isLoading) {
    return <PokemonDetailsSkeleton />
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Unable to load Pokémon"
        message={
          error instanceof Error
            ? error.message
            : 'Something went wrong while contacting PokéAPI.'
        }
        onRetry={() => void refetch()}
      />
    )
  }

  function handleUncapture() {
    if (!data) return

    uncapture(id)
    toast({
      variant: 'success',
      title: 'Pokémon removed',
      description: `${formatPokemonName(data.name)} was removed from your collection.`,
    })
    setUncaptureOpen(false)
  }

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Pokédex
      </Link>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="relative mx-auto flex aspect-square max-w-[280px] items-center justify-center rounded-2xl bg-gradient-to-br from-surface to-muted p-6">
            <PokemonImage
              pokemonId={data.id}
              src={data.spriteUrl}
              alt={`${formatPokemonName(data.name)} artwork`}
              width={240}
              height={240}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full drop-shadow-lg"
            />
          </div>

          <div className="mt-6 space-y-4">
            {isCaptured && capturedEntry ? (
              <div className="rounded-xl border border-success/30 bg-success/10 p-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                  <span className="font-semibold">Captured</span>
                </div>
                <p className="mt-2 text-sm">
                  Nickname:{' '}
                  <span className="font-medium">{capturedEntry.nickname}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCaptureDate(capturedEntry.capturedAt)}
                </p>
              </div>
            ) : null}

            {isCaptured ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setUncaptureOpen(true)}
              >
                Remove from captured
              </Button>
            ) : (
              <Button className="w-full" onClick={() => setCaptureOpen(true)}>
                <Sparkles className="h-4 w-4" aria-hidden />
                Tag as Captured
              </Button>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {formatPokedexNumber(data.id)}
            </p>
            <h1 className="font-display text-4xl font-bold capitalize tracking-tight sm:text-5xl">
              {formatPokemonName(data.name)}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.types.map((type) => (
                <PokemonTypeBadge key={type} type={type} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4" aria-hidden />
                <span className="text-sm font-medium">Height</span>
              </div>
              <p className="mt-2 text-2xl font-semibold">{formatHeight(data.height)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-4 w-4" aria-hidden />
                <span className="text-sm font-medium">Weight</span>
              </div>
              <p className="mt-2 text-2xl font-semibold">{formatWeight(data.weight)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Abilities</h2>
            <ul className="mt-4 space-y-2">
              {data.abilities.map((ability) => (
                <li
                  key={ability.name}
                  className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm"
                >
                  <span className="font-medium">{ability.name}</span>
                  {ability.isHidden ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Hidden
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Base Stats</h2>
            <div className="mt-5">
              <PokemonStats stats={data.stats} />
            </div>
          </div>
        </section>
      </div>

      <CaptureDialog
        open={captureOpen}
        onOpenChange={setCaptureOpen}
        pokemon={data}
      />

      <ConfirmDialog
        open={uncaptureOpen}
        onOpenChange={setUncaptureOpen}
        title="Remove captured Pokémon?"
        description={`Remove ${formatPokemonName(data.name)} from your captured collection?`}
        confirmLabel="Remove"
        onConfirm={handleUncapture}
      />
    </div>
  )
}
