import { ArrowLeftRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { SearchablePokemonSelect } from '@/features/battle/components/SearchablePokemonSelect'
import { CompareStatRow } from '@/features/compare/components/CompareStatRow'
import { MatchupSummary } from '@/features/compare/components/MatchupSummary'
import type { CompareProfile } from '@/features/compare/types/compare.types'
import {
  buildCompareProfileFromDetails,
  buildCompareProfileFromSummary,
} from '@/features/compare/utils/buildCompareProfile'
import { analyzeHeadToHead } from '@/features/compare/utils/matchupAnalysis'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import { PokemonTypeIcon } from '@/features/pokemon/components/PokemonTypeIcon'
import { useAllGen1Pokemon } from '@/features/pokemon/hooks/usePokemonList'
import { usePokemon } from '@/features/pokemon/hooks/usePokemon'
import { formatTcgTypeLabel } from '@/features/battle/utils/tcgBattleTraits'
import { Skeleton } from '@/components/ui/skeleton'
import { formatHeight, formatPokemonName, formatPokedexNumber, formatWeight } from '@/lib/utils/format'
import { prefetchPokemonImage } from '@/lib/utils/pokemon'
import { cn } from '@/lib/utils/cn'

function parseId(value: string | null): number | null {
  if (!value) return null
  const id = Number.parseInt(value, 10)
  return Number.isFinite(id) && id > 0 ? id : null
}

function CompareHero({
  profile,
  label,
  className,
}: {
  profile: CompareProfile
  label: string
  className?: string
}) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-border bg-card/70 p-3 text-center shadow-sm sm:p-4',
        className,
      )}
    >
      <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-xl bg-muted p-2 sm:h-28 sm:w-28">
        <PokemonImage
          pokemonId={profile.id}
          src={profile.spriteUrl}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <h2 className="font-display text-lg font-bold">{formatPokemonName(profile.name)}</h2>
      <p className="text-sm text-muted-foreground">{formatPokedexNumber(profile.id)}</p>
      <div className="mt-2 flex justify-center gap-1">
        {profile.types.map((type) => (
          <PokemonTypeIcon key={type} type={type} size="sm" />
        ))}
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </article>
  )
}

function getHighlight(
  left: number,
  right: number,
  higherIsBetter = true,
): 'left' | 'right' | 'none' {
  if (left === right) return 'none'
  if (higherIsBetter) return left > right ? 'left' : 'right'
  return left < right ? 'left' : 'right'
}

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [leftId, setLeftId] = useState<number | null>(() => parseId(searchParams.get('left')) ?? 6)
  const [rightId, setRightId] = useState<number | null>(() => parseId(searchParams.get('right')) ?? 9)

  const allGen1Query = useAllGen1Pokemon()
  const leftQuery = usePokemon(leftId ?? 0)
  const rightQuery = usePokemon(rightId ?? 0)

  const pokemonList = allGen1Query.data ?? []

  const leftSummary = pokemonList.find((entry) => entry.id === leftId) ?? null
  const rightSummary = pokemonList.find((entry) => entry.id === rightId) ?? null

  const leftProfile = leftQuery.data
    ? buildCompareProfileFromDetails(leftQuery.data)
    : leftSummary
      ? buildCompareProfileFromSummary(leftSummary)
      : null

  const rightProfile = rightQuery.data
    ? buildCompareProfileFromDetails(rightQuery.data)
    : rightSummary
      ? buildCompareProfileFromSummary(rightSummary)
      : null

  const bothSelected = leftId != null && rightId != null && leftId !== rightId
  const statsLoading = bothSelected && (leftQuery.isLoading || rightQuery.isLoading)

  const matchup = useMemo(() => {
    if (!leftProfile || !rightProfile || leftId === rightId) return null
    return analyzeHeadToHead(leftProfile, rightProfile)
  }, [leftProfile, rightProfile, leftId, rightId])

  useEffect(() => {
    const params = new URLSearchParams()
    if (leftId != null) params.set('left', String(leftId))
    if (rightId != null) params.set('right', String(rightId))
    setSearchParams(params, { replace: true })
  }, [leftId, rightId, setSearchParams])

  useEffect(() => {
    for (const summary of [leftSummary, rightSummary]) {
      if (summary) prefetchPokemonImage(summary.id, summary.spriteUrl)
    }
  }, [leftSummary, rightSummary])

  function handleSelect(side: 'left' | 'right', id: number) {
    if (side === 'left') setLeftId(id)
    else setRightId(id)
  }

  const statNames = useMemo(() => {
    const names = new Set<string>()
    for (const stat of leftProfile?.stats ?? []) names.add(stat.name)
    for (const stat of rightProfile?.stats ?? []) names.add(stat.name)
    return Array.from(names)
  }, [leftProfile?.stats, rightProfile?.stats])

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-6 w-6 shrink-0 text-primary sm:h-7 sm:w-7" aria-hidden />
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Compare
          </h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Side-by-side stats, TCG card data, and a predicted matchup summary using official
          weakness ×2 and resistance −30 rules.
        </p>
      </section>

      {allGen1Query.error ? (
        <ErrorState onRetry={() => void allGen1Query.refetch()} />
      ) : allGen1Query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm sm:p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SearchablePokemonSelect
                label="Pokémon A"
                pokemon={pokemonList}
                value={leftId}
                onChange={(id) => handleSelect('left', id)}
                disabledIds={rightId != null ? [rightId] : []}
              />
              <SearchablePokemonSelect
                label="Pokémon B"
                pokemon={pokemonList}
                value={rightId}
                onChange={(id) => handleSelect('right', id)}
                disabledIds={leftId != null ? [leftId] : []}
              />
            </div>

            {leftId === rightId && leftId != null ? (
              <p className="mt-3 text-sm text-destructive">
                Choose two different Pokémon to compare.
              </p>
            ) : null}
          </section>

          {bothSelected && leftProfile && rightProfile ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
                <CompareHero profile={leftProfile} label="Pokémon A" />
                <CompareHero profile={rightProfile} label="Pokémon B" className="sm:order-3" />
                <div className="col-span-2 flex items-center justify-center sm:order-2 sm:col-span-1 sm:py-12">
                  <span className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-black uppercase tracking-widest">
                    VS
                  </span>
                </div>
              </div>

              <section className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm sm:p-5">
                <h2 className="mb-1 font-display text-base font-bold sm:text-lg">TCG card stats</h2>
                <CompareStatRow
                  label="HP"
                  leftValue={leftProfile.hp}
                  rightValue={rightProfile.hp}
                  highlight={getHighlight(leftProfile.hp, rightProfile.hp)}
                />
                <CompareStatRow
                  label="Attack"
                  leftValue={leftProfile.attackDamage}
                  rightValue={rightProfile.attackDamage}
                  highlight={getHighlight(leftProfile.attackDamage, rightProfile.attackDamage)}
                />
                <CompareStatRow
                  label="Move"
                  leftValue={leftProfile.attackName}
                  rightValue={rightProfile.attackName}
                />
                <CompareStatRow
                  label="Type"
                  leftValue={formatTcgTypeLabel(leftProfile.cardType)}
                  rightValue={formatTcgTypeLabel(rightProfile.cardType)}
                />
                <CompareStatRow
                  label="Weakness"
                  leftValue={
                    leftProfile.weakness
                      ? `${formatTcgTypeLabel(leftProfile.weakness)} ×2`
                      : '—'
                  }
                  rightValue={
                    rightProfile.weakness
                      ? `${formatTcgTypeLabel(rightProfile.weakness)} ×2`
                      : '—'
                  }
                />
                <CompareStatRow
                  label="Resistance"
                  leftValue={
                    leftProfile.resistance
                      ? `${formatTcgTypeLabel(leftProfile.resistance)} −30`
                      : '—'
                  }
                  rightValue={
                    rightProfile.resistance
                      ? `${formatTcgTypeLabel(rightProfile.resistance)} −30`
                      : '—'
                  }
                />
                <CompareStatRow
                  label="Retreat"
                  leftValue={leftProfile.retreat}
                  rightValue={rightProfile.retreat}
                  highlight={getHighlight(leftProfile.retreat, rightProfile.retreat, false)}
                />
              </section>

              {statsLoading ? (
                <Skeleton className="h-64 rounded-2xl" />
              ) : statNames.length > 0 ? (
                <section className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm sm:p-5">
                  <h2 className="mb-1 font-display text-base font-bold sm:text-lg">Base stats</h2>
                  {statNames.map((statName) => {
                    const leftStat = leftProfile.stats.find((stat) => stat.name === statName)
                    const rightStat = rightProfile.stats.find((stat) => stat.name === statName)
                    const label = leftStat?.label ?? rightStat?.label ?? statName
                    const leftValue = leftStat?.value ?? '—'
                    const rightValue = rightStat?.value ?? '—'

                    return (
                      <CompareStatRow
                        key={statName}
                        label={label}
                        leftValue={leftValue}
                        rightValue={rightValue}
                        highlight={
                          typeof leftValue === 'number' && typeof rightValue === 'number'
                            ? getHighlight(leftValue, rightValue)
                            : 'none'
                        }
                      />
                    )
                  })}
                </section>
              ) : null}

              {(leftProfile.height != null || rightProfile.height != null) && (
                <section className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm sm:p-5">
                  <h2 className="mb-1 font-display text-base font-bold sm:text-lg">Physical</h2>
                  {leftProfile.height != null && rightProfile.height != null ? (
                    <CompareStatRow
                      label="Height"
                      leftValue={formatHeight(leftProfile.height)}
                      rightValue={formatHeight(rightProfile.height)}
                      highlight={getHighlight(leftProfile.height, rightProfile.height)}
                    />
                  ) : null}
                  {leftProfile.weight != null && rightProfile.weight != null ? (
                    <CompareStatRow
                      label="Weight"
                      leftValue={formatWeight(leftProfile.weight)}
                      rightValue={formatWeight(rightProfile.weight)}
                      highlight={getHighlight(leftProfile.weight, rightProfile.weight)}
                    />
                  ) : null}
                </section>
              )}

              {matchup ? <MatchupSummary matchup={matchup} /> : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
