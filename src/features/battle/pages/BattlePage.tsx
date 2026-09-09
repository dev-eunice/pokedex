import { RefreshCw, Shuffle, Swords, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { BattleFighterPanel } from '@/features/battle/components/BattleFighterPanel'
import { BattleLog } from '@/features/battle/components/BattleLog'
import { SearchablePokemonSelect } from '@/features/battle/components/SearchablePokemonSelect'
import type { BattleResult } from '@/features/battle/types/battle.types'
import { buildBattleFighter } from '@/features/battle/utils/buildFighter'
import { simulateBattle } from '@/features/battle/utils/simulateBattle'
import { useAllGen1Pokemon } from '@/features/pokemon/hooks/usePokemonList'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPokemonName } from '@/lib/utils/format'
import { prefetchPokemonImage } from '@/lib/utils/pokemon'

const QUICK_MATCHUPS = [
  { label: 'Charizard vs Blastoise', shortLabel: 'Charizard · Blastoise', fighter1Id: 6, fighter2Id: 9 },
  { label: 'Pikachu vs Onix', shortLabel: 'Pikachu · Onix', fighter1Id: 25, fighter2Id: 95 },
  { label: 'Mewtwo vs Alakazam', shortLabel: 'Mewtwo · Alakazam', fighter1Id: 150, fighter2Id: 65 },
] as const

function parseFighterId(value: string | null): number | null {
  if (!value) return null
  const id = Number.parseInt(value, 10)
  return Number.isFinite(id) && id > 0 ? id : null
}

export function BattlePage() {
  const [searchParams] = useSearchParams()
  const [fighter1Id, setFighter1Id] = useState<number | null>(
    () => parseFighterId(searchParams.get('fighter1')) ?? 6,
  )
  const [fighter2Id, setFighter2Id] = useState<number | null>(
    () => parseFighterId(searchParams.get('fighter2')) ?? 9,
  )
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
  const [activeTurn, setActiveTurn] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const allGen1Query = useAllGen1Pokemon()
  const pokemonList = allGen1Query.data ?? []
  const bothSelected = fighter1Id != null && fighter2Id != null && fighter1Id !== fighter2Id

  const fighter1Summary = pokemonList.find((entry) => entry.id === fighter1Id) ?? null
  const fighter2Summary = pokemonList.find((entry) => entry.id === fighter2Id) ?? null

  const fighter1 = fighter1Summary ? buildBattleFighter(fighter1Summary) : null
  const fighter2 = fighter2Summary ? buildBattleFighter(fighter2Summary) : null
  const fightersReady = bothSelected && fighter1 != null && fighter2 != null

  useEffect(() => {
    for (const id of [fighter1Id, fighter2Id]) {
      if (id == null) continue
      const summary = pokemonList.find((entry) => entry.id === id)
      prefetchPokemonImage(id, summary?.spriteUrl)
    }
  }, [fighter1Id, fighter2Id, pokemonList])

  const displayedHp = useMemo(() => {
    if (!fighter1 || !fighter2) {
      return { fighter1Hp: 0, fighter2Hp: 0 }
    }

    if (!battleResult || activeTurn === 0) {
      return { fighter1Hp: fighter1.maxHp, fighter2Hp: fighter2.maxHp }
    }

    const turn = battleResult.turns[activeTurn - 1]
    if (!turn) {
      return { fighter1Hp: fighter1.maxHp, fighter2Hp: fighter2.maxHp }
    }

    return {
      fighter1Hp: turn.attackerId === fighter1.id ? turn.attackerHpAfter : turn.defenderHpAfter,
      fighter2Hp: turn.attackerId === fighter2.id ? turn.attackerHpAfter : turn.defenderHpAfter,
    }
  }, [activeTurn, battleResult, fighter1, fighter2])

  useEffect(() => {
    if (!battleResult || !isAnimating) return

    if (activeTurn >= battleResult.turns.length) {
      setIsAnimating(false)
      return
    }

    const timer = window.setTimeout(() => {
      setActiveTurn((current) => current + 1)
    }, 650)

    return () => window.clearTimeout(timer)
  }, [activeTurn, battleResult, isAnimating])

  function handleSimulate() {
    if (!fighter1 || !fighter2) return

    const result = simulateBattle(fighter1, fighter2)
    setBattleResult(result)
    setActiveTurn(0)
    setIsAnimating(true)
  }

  function handleReset() {
    setBattleResult(null)
    setActiveTurn(0)
    setIsAnimating(false)
  }

  function handleSelectFighter(slot: 1 | 2, id: number) {
    if (slot === 1) setFighter1Id(id)
    else setFighter2Id(id)
    handleReset()
  }

  function handleRandomMatchup() {
    if (pokemonList.length < 2) return

    let first = pokemonList[Math.floor(Math.random() * pokemonList.length)]!.id
    let second = pokemonList[Math.floor(Math.random() * pokemonList.length)]!.id

    while (second === first) {
      second = pokemonList[Math.floor(Math.random() * pokemonList.length)]!.id
    }

    setFighter1Id(first)
    setFighter2Id(second)
    handleReset()
  }

  function handleQuickMatchup(fighterA: number, fighterB: number) {
    setFighter1Id(fighterA)
    setFighter2Id(fighterB)
    handleReset()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Swords className="h-6 w-6 shrink-0 text-primary sm:h-7 sm:w-7" aria-hidden />
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Battle Simulator
          </h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Simulate a Pokémon TCG duel — coin flip for first turn, alternating attacks,
          Weakness ×2, Resistance −30, and damage counters (10 damage each).
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
          <section className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-sm sm:p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SearchablePokemonSelect
                label="Fighter 1"
                pokemon={pokemonList}
                value={fighter1Id}
                onChange={(id) => handleSelectFighter(1, id)}
                disabledIds={fighter2Id != null ? [fighter2Id] : []}
              />
              <SearchablePokemonSelect
                label="Fighter 2"
                pokemon={pokemonList}
                value={fighter2Id}
                onChange={(id) => handleSelectFighter(2, id)}
                disabledIds={fighter1Id != null ? [fighter1Id] : []}
              />
            </div>

            {fighter1Id === fighter2Id && fighter1Id != null ? (
              <p className="mt-3 text-sm text-destructive">
                Choose two different Pokémon to battle.
              </p>
            ) : null}

            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
              {QUICK_MATCHUPS.map((matchup) => (
                <Button
                  key={matchup.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto min-h-9 w-full justify-center whitespace-normal px-3 py-2 text-xs sm:w-auto sm:text-sm"
                  onClick={() => handleQuickMatchup(matchup.fighter1Id, matchup.fighter2Id)}
                >
                  <span className="sm:hidden">{matchup.shortLabel}</span>
                  <span className="hidden sm:inline">{matchup.label}</span>
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={handleRandomMatchup}
              >
                <Shuffle className="h-4 w-4" aria-hidden />
                Random matchup
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                className="w-full font-bold sm:w-auto"
                disabled={!fightersReady || isAnimating}
                onClick={handleSimulate}
              >
                <Zap className="h-4 w-4" aria-hidden />
                {isAnimating ? 'Battle in progress…' : 'Start battle'}
              </Button>
              {battleResult ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleReset}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden />
                  Reset
                </Button>
              ) : null}
            </div>
          </section>

          {fightersReady && fighter1 && fighter2 ? (
            <section className="space-y-4 sm:space-y-6">
              <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-4">
                <BattleFighterPanel
                  fighter={fighter1}
                  currentHp={displayedHp.fighter1Hp}
                  side="left"
                  isWinner={!isAnimating && battleResult?.winnerId === fighter1.id}
                />

                <div className="flex items-center justify-center sm:py-16">
                  <span className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-black uppercase tracking-widest sm:px-4 sm:py-2 sm:text-sm">
                    VS
                  </span>
                </div>

                <BattleFighterPanel
                  fighter={fighter2}
                  currentHp={displayedHp.fighter2Hp}
                  side="right"
                  isWinner={!isAnimating && battleResult?.winnerId === fighter2.id}
                />
              </div>

              {battleResult ? (
                <div className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm sm:p-4">
                  <h2 className="mb-3 font-display text-base font-bold sm:text-lg">Battle log</h2>
                  <BattleLog
                    result={battleResult}
                    activeTurn={isAnimating ? activeTurn : undefined}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground sm:px-4 sm:py-8">
                  Ready for{' '}
                  <span className="font-semibold text-foreground">
                    {formatPokemonName(fighter1.name)}
                  </span>{' '}
                  vs{' '}
                  <span className="font-semibold text-foreground">
                    {formatPokemonName(fighter2.name)}
                  </span>
                  . Press Start battle to flip a coin and begin.
                </div>
              )}
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
