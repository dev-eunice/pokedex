import type { BattleResult, BattleTurn } from '@/features/battle/types/battle.types'
import { formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface BattleLogProps {
  result: BattleResult
  activeTurn?: number
  className?: string
}

function getFighterName(result: BattleResult, id: number): string {
  if (result.fighter1.id === id) return formatPokemonName(result.fighter1.name)
  return formatPokemonName(result.fighter2.name)
}

function getFighterMaxHp(result: BattleResult, id: number): number {
  if (result.fighter1.id === id) return result.fighter1.maxHp
  return result.fighter2.maxHp
}

function formatDamageBreakdown(turn: BattleTurn): string {
  const parts = [`${turn.baseDamage} base`]

  if (turn.weaknessApplied) {
    parts.push(`${turn.afterWeakness} after Weakness ×2`)
  }

  if (turn.resistanceApplied) {
    parts.push(`${turn.finalDamage} after Resistance −30`)
  } else if (turn.weaknessApplied) {
    parts.push(`${turn.finalDamage} final`)
  }

  parts.push(`${turn.damageCounters} damage counter${turn.damageCounters === 1 ? '' : 's'}`)

  return parts.join(' → ')
}

function HpChangeLine({
  name,
  hpBefore,
  hpAfter,
  maxHp,
  variant,
}: {
  name: string
  hpBefore: number
  hpAfter: number
  maxHp: number
  variant: 'attacker' | 'defender'
}) {
  const changed = hpBefore !== hpAfter

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
      <span
        className={cn(
          'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
          variant === 'attacker'
            ? 'bg-primary/10 text-primary'
            : 'bg-destructive/10 text-destructive',
        )}
      >
        {variant === 'attacker' ? 'Attacker' : 'Defender'}
      </span>
      <span className="font-semibold">{name}</span>
      <span className="font-mono text-muted-foreground">
        {hpBefore}/{maxHp} HP
        <span className="mx-1.5 text-foreground">→</span>
        <span className={cn(changed && 'font-bold text-foreground')}>
          {hpAfter}/{maxHp} HP
        </span>
      </span>
    </div>
  )
}

function TurnEntry({
  turn,
  result,
  isActive,
}: {
  turn: BattleTurn
  result: BattleResult
  isActive: boolean
}) {
  const attacker = getFighterName(result, turn.attackerId)
  const defender = getFighterName(result, turn.defenderId)
  const attackerMaxHp = getFighterMaxHp(result, turn.attackerId)
  const defenderMaxHp = getFighterMaxHp(result, turn.defenderId)

  return (
    <li
      className={cn(
        'rounded-lg border px-3 py-2.5 transition-colors',
        isActive ? 'border-primary/40 bg-primary/5' : 'border-border bg-card/60',
      )}
    >
      <p className="text-sm font-medium">
        Turn {turn.turn}: <span className="font-bold">{attacker}</span> used{' '}
        <span className="font-bold">{turn.attackName}</span>
      </p>

      <div className="mt-2 space-y-1.5">
        <HpChangeLine
          name={attacker}
          hpBefore={turn.attackerHpBefore}
          hpAfter={turn.attackerHpAfter}
          maxHp={attackerMaxHp}
          variant="attacker"
        />
        <HpChangeLine
          name={defender}
          hpBefore={turn.defenderHpBefore}
          hpAfter={turn.defenderHpAfter}
          maxHp={defenderMaxHp}
          variant="defender"
        />
      </div>

      <p className="mt-2 font-mono text-xs text-muted-foreground sm:text-sm">
        {formatDamageBreakdown(turn)}
      </p>

      {turn.knockedOut ? (
        <p className="mt-1 text-xs font-bold uppercase text-destructive">
          {defender} was Knocked Out!
        </p>
      ) : null}
    </li>
  )
}

export function BattleLog({ result, activeTurn, className }: BattleLogProps) {
  const winnerName =
    result.winnerId != null ? getFighterName(result, result.winnerId) : null
  const firstPlayer = getFighterName(result, result.firstPlayerId)

  return (
    <section className={cn('space-y-3', className)} aria-live="polite">
      <div className="rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm sm:px-4">
        <p className="font-medium">
          Coin flip: <span className="font-bold">{firstPlayer}</span> goes first
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Pokémon TCG rules — alternating turns, Weakness ×2, Resistance −30
        </p>
      </div>

      {winnerName ? (
        <div className="rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
            {winnerName} wins!
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Battle ended in {result.totalTurns} turn{result.totalTurns === 1 ? '' : 's'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground">
          Battle reached the turn limit with no knockout.
        </div>
      )}

      <ol className="max-h-64 space-y-2 overflow-y-auto pr-1 sm:max-h-80">
        {result.turns.map((turn) => (
          <TurnEntry
            key={turn.turn}
            turn={turn}
            result={result}
            isActive={activeTurn === turn.turn}
          />
        ))}
      </ol>
    </section>
  )
}
