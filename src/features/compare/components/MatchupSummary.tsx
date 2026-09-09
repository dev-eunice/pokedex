import { Link } from 'react-router-dom'
import { Swords } from 'lucide-react'
import type { HeadToHeadMatchup } from '@/features/compare/types/compare.types'
import { formatTcgTypeLabel } from '@/features/battle/utils/tcgBattleTraits'
import { formatPokemonName } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface MatchupSummaryProps {
  matchup: HeadToHeadMatchup
  className?: string
}

export function MatchupSummary({ matchup, className }: MatchupSummaryProps) {
  const name1 = formatPokemonName(matchup.pokemon1.name)
  const name2 = formatPokemonName(matchup.pokemon2.name)

  return (
    <section
      className={cn(
        'rounded-2xl border border-border bg-card/70 p-4 shadow-sm sm:p-5',
        className,
      )}
    >
      <h2 className="mb-3 font-display text-base font-bold sm:text-lg">Matchup prediction</h2>

      <div
        className={cn(
          'rounded-xl px-4 py-3 text-sm',
          matchup.verdict === 'even'
            ? 'border border-border bg-muted/40'
            : 'border border-primary/30 bg-primary/5',
        )}
      >
        <p className="font-medium">{matchup.summary}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[matchup.pokemon1Attacks, matchup.pokemon2Attacks].map((attack) => {
          const attacker =
            attack.attackerId === matchup.pokemon1.id ? matchup.pokemon1 : matchup.pokemon2
          const defender =
            attack.defenderId === matchup.pokemon1.id ? matchup.pokemon1 : matchup.pokemon2

          return (
            <div
              key={`${attack.attackerId}-${attack.defenderId}`}
              className="rounded-xl border border-border bg-muted/20 p-3"
            >
              <p className="truncate text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {formatPokemonName(attacker.name)} → {formatPokemonName(defender.name)}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {attack.baseDamage} base → {attack.finalDamage} damage
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                ~{Number.isFinite(attack.turnsToKnockOut) ? attack.turnsToKnockOut : '∞'} turn
                {attack.turnsToKnockOut === 1 ? '' : 's'} to KO
              </p>
              {attack.notes.length > 0 ? (
                <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                  {attack.notes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-center text-xs sm:grid-cols-2 sm:text-sm">
        <div className="rounded-lg border border-border p-2">
          <p className="font-bold uppercase opacity-70">Weakness</p>
          <p className="truncate">{name1}: {matchup.pokemon1.weakness ? `${formatTcgTypeLabel(matchup.pokemon1.weakness)} ×2` : '—'}</p>
          <p className="truncate">{name2}: {matchup.pokemon2.weakness ? `${formatTcgTypeLabel(matchup.pokemon2.weakness)} ×2` : '—'}</p>
        </div>
        <div className="rounded-lg border border-border p-2">
          <p className="font-bold uppercase opacity-70">Resistance</p>
          <p className="truncate">{name1}: {matchup.pokemon1.resistance ? `${formatTcgTypeLabel(matchup.pokemon1.resistance)} −30` : '—'}</p>
          <p className="truncate">{name2}: {matchup.pokemon2.resistance ? `${formatTcgTypeLabel(matchup.pokemon2.resistance)} −30` : '—'}</p>
        </div>
      </div>

      <Button asChild className="mt-4 w-full sm:w-auto" variant="outline">
        <Link to={`/battle?fighter1=${matchup.pokemon1.id}&fighter2=${matchup.pokemon2.id}`}>
          <Swords className="h-4 w-4" aria-hidden />
          Run full battle simulation
        </Link>
      </Button>
    </section>
  )
}
