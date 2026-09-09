import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { CaptureDialog } from '@/features/pokemon/components/CaptureDialog'
import { CapturedIndicator } from '@/features/pokemon/components/CapturedIndicator'
import { ConfirmDialog } from '@/features/pokemon/components/ConfirmDialog'
import {
  PokemonArtViewer,
  type ArtViewMode,
} from '@/features/pokemon/components/PokemonArtViewer'
import { PokemonStats } from '@/features/pokemon/components/PokemonStats'
import { PokemonTypeIcon } from '@/features/pokemon/components/PokemonTypeIcon'
import { PokemonMatchupsPanel } from '@/features/compare/components/PokemonMatchupsPanel'
import {
  buildCompareProfileFromDetails,
  buildCompareProfileFromSummary,
} from '@/features/compare/utils/buildCompareProfile'
import { getPokemonMatchups } from '@/features/compare/utils/matchupAnalysis'
import { useAllGen1Pokemon } from '@/features/pokemon/hooks/usePokemonList'
import { usePokemon } from '@/features/pokemon/hooks/usePokemon'
import { getPokemonCardMeta } from '@/features/pokemon/utils/cardMeta'
import { getTcgTheme } from '@/features/pokemon/utils/tcgTheme'
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
import { cn } from '@/lib/utils/cn'

function TcgPanel({
  theme,
  title,
  children,
  className,
}: {
  theme: ReturnType<typeof getTcgTheme>
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn('overflow-hidden rounded-[14px] border-[3px] shadow-md', className)}
      style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
    >
      <h2
        className="px-4 py-2 text-xs font-black uppercase tracking-widest"
        style={{ backgroundColor: theme.header }}
      >
        {title}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  )
}

function PokemonDetailsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8" aria-busy="true" aria-label="Loading Pokémon details">
      <Skeleton className="h-8 w-32" />
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_1fr] lg:gap-8">
        <Skeleton className="mx-auto aspect-[5/7] w-full max-w-[340px] rounded-[14px] sm:max-w-[320px]" />
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-[14px]" />
          <Skeleton className="h-48 rounded-[14px]" />
          <Skeleton className="h-64 rounded-[14px]" />
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
  const allGen1Query = useAllGen1Pokemon()
  const isCaptured = useIsCaptured(id)
  const capturedMap = useCapturedPokemonMap()
  const capturedEntry = capturedMap[id]
  const { uncapture } = useCapturedPokemonActions()
  const { toast } = useToast()

  const [captureOpen, setCaptureOpen] = useState(false)
  const [uncaptureOpen, setUncaptureOpen] = useState(false)
  const [artViewMode, setArtViewMode] = useState<ArtViewMode>('2d')
  const [autoRotate, setAutoRotate] = useState(false)

  const matchupLists = useMemo(() => {
    if (!data) {
      return { favorable: [], unfavorable: [] }
    }

    const currentProfile = buildCompareProfileFromDetails(data)
    const opponents = (allGen1Query.data ?? []).map(buildCompareProfileFromSummary)
    return getPokemonMatchups(currentProfile, opponents, 6)
  }, [allGen1Query.data, data])

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

  const cardMeta = getPokemonCardMeta(data.id)
  const theme = getTcgTheme(cardMeta.type)
  const primaryType = data.types[0] ?? cardMeta.type

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
    <div className="space-y-6 sm:space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Pokédex
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_1fr] lg:gap-8">
        {/* Large TCG showcase card */}
        <div
          className={cn(
            'mx-auto w-full max-w-[340px] sm:max-w-[320px]',
            isCaptured && 'drop-shadow-[0_0_16px_rgba(255,215,0,0.5)]',
          )}
        >
          <article
            className="relative flex min-h-0 flex-col overflow-hidden rounded-[14px] border-[3px] p-2 shadow-xl sm:aspect-[5/7]"
            style={{
              borderColor: theme.border,
              background: theme.background,
              color: theme.text,
            }}
          >
            {isCaptured ? (
              <CapturedIndicator className="absolute right-3 top-3 z-10" />
            ) : null}

            <header
              className="mb-1.5 flex flex-col gap-1.5 rounded-md px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
              style={{ backgroundColor: theme.header }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: isCaptured ? '#2ecc71' : theme.frame,
                    color: isCaptured ? '#fff' : theme.text,
                  }}
                >
                  {isCaptured ? 'Captured' : 'Basic'}
                </span>
                <h1 className="truncate text-base font-black uppercase tracking-tight">
                  {formatPokemonName(data.name)}
                </h1>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-xs font-black">
                  HP <span className="text-base">{cardMeta.hp}</span>
                </span>
                <PokemonTypeIcon type={primaryType} size="md" />
              </div>
            </header>

            <PokemonArtViewer
              className="mb-1.5"
              pokemonId={data.id}
              pokemonName={data.name}
              spriteUrl={data.spriteUrl}
              viewMode={artViewMode}
              onViewModeChange={setArtViewMode}
              autoRotate={autoRotate}
              onAutoRotateChange={setAutoRotate}
              frameColor={theme.frame}
            />

            <p
              className="mb-1.5 truncate rounded px-1.5 py-0.5 text-center text-[9px] font-semibold italic"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              {formatPokedexNumber(data.id)} · HT: {formatHeight(data.height)} · WT:{' '}
              {formatWeight(data.weight)}
            </p>

            {data.abilities.slice(0, 2).map((ability) => (
              <div
                key={ability.name}
                className="mb-1 hidden items-start justify-between gap-2 rounded-md border px-2 py-1 sm:flex"
                style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase tracking-wide opacity-70">
                    {ability.isHidden ? 'Hidden Ability' : 'Ability'}
                  </p>
                  <p className="truncate text-[11px] font-black">{ability.name}</p>
                </div>
                {ability.isHidden ? (
                  <span
                    className="shrink-0 rounded px-1 py-0.5 text-[7px] font-bold uppercase"
                    style={{ backgroundColor: theme.frame }}
                  >
                    ★
                  </span>
                ) : null}
              </div>
            ))}

            <footer className="mt-auto space-y-1">
              <div
                className="hidden items-center justify-between rounded px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide sm:flex"
                style={{ backgroundColor: theme.header }}
              >
                <span>Weakness</span>
                <span>Resistance</span>
                <span>Retreat</span>
              </div>
              {isCaptured && capturedEntry ? (
                <div
                  className="rounded px-2 py-1 text-center"
                  style={{ backgroundColor: 'rgba(46,204,113,0.2)' }}
                >
                  <p className="text-[9px] font-bold uppercase text-green-800 dark:text-green-200">
                    {capturedEntry.nickname}
                  </p>
                  <p className="text-[8px] opacity-80">
                    Captured {formatCaptureDate(capturedEntry.capturedAt)}
                  </p>
                </div>
              ) : (
                <p
                  className="line-clamp-2 rounded px-2 py-1 text-[8px] leading-tight italic"
                  style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                >
                  A classic Kanto species. Tag it as captured to add it to your trainer
                  collection.
                </p>
              )}
              <p className="text-center text-[7px] font-semibold uppercase tracking-widest opacity-70">
                Official Pokédex Card
              </p>
            </footer>
          </article>

          <div className="mt-4">
            {isCaptured ? (
              <Button
                variant="outline"
                className="w-full border-2 font-bold"
                style={{ borderColor: theme.border }}
                onClick={() => setUncaptureOpen(true)}
              >
                Remove from captured
              </Button>
            ) : (
              <Button
                className="w-full font-bold"
                style={{ backgroundColor: theme.accent, color: '#fff' }}
                onClick={() => setCaptureOpen(true)}
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Tag as Captured
              </Button>
            )}
          </div>
        </div>

        {/* Detail panels */}
        <div className="space-y-4">
          <TcgPanel theme={theme} title="Type & Classification">
            <div className="flex flex-wrap items-center gap-3">
              {data.types.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <PokemonTypeIcon type={type} size="lg" />
                  <span className="text-sm font-black uppercase">{type}</span>
                </div>
              ))}
            </div>
            {isCaptured && capturedEntry ? (
              <div
                className="mt-4 flex items-center gap-2 rounded-md px-3 py-2"
                style={{ backgroundColor: 'rgba(46,204,113,0.15)' }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden />
                <div>
                  <p className="text-xs font-bold uppercase">In your collection</p>
                  <p className="text-sm font-black">{capturedEntry.nickname}</p>
                </div>
              </div>
            ) : null}
          </TcgPanel>

          <TcgPanel theme={theme} title="Abilities">
            <ul className="space-y-2">
              {data.abilities.map((ability) => (
                <li
                  key={ability.name}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                  style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <span className="text-sm font-black">{ability.name}</span>
                  {ability.isHidden ? (
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{ backgroundColor: theme.frame }}
                    >
                      Hidden
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase opacity-60">Standard</span>
                  )}
                </li>
              ))}
            </ul>
          </TcgPanel>

          <TcgPanel theme={theme} title="Base Stats">
            <PokemonStats
              stats={data.stats}
              accentColor={theme.accent}
              trackColor="rgba(0,0,0,0.12)"
              textColor={theme.text}
            />
          </TcgPanel>

          <TcgPanel theme={theme} title="Physical Data">
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className="rounded-md border px-4 py-3 text-center"
                style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                  Height
                </p>
                <p className="mt-1 text-xl font-black">{formatHeight(data.height)}</p>
              </div>
              <div
                className="rounded-md border px-4 py-3 text-center"
                style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                  Weight
                </p>
                <p className="mt-1 text-xl font-black">{formatWeight(data.weight)}</p>
              </div>
            </div>
          </TcgPanel>

          <PokemonMatchupsPanel
            pokemonId={data.id}
            matchups={matchupLists}
            theme={theme}
          />
        </div>
      </div>

      <CaptureDialog open={captureOpen} onOpenChange={setCaptureOpen} pokemon={data} />

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
