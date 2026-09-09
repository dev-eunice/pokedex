import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight, TrendingDown, TrendingUp } from 'lucide-react'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { PokemonMatchupLists } from '@/features/compare/types/compare.types'
import { formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface PokemonMatchupsPanelProps {
  pokemonId: number
  matchups: PokemonMatchupLists
  theme: {
    border: string
    background: string
    header: string
    text: string
    frame: string
  }
  className?: string
}

function MatchupList({
  title,
  icon,
  entries,
  pokemonId,
  variant,
}: {
  title: string
  icon: ReactNode
  entries: PokemonMatchupLists['favorable']
  pokemonId: number
  variant: 'favorable' | 'unfavorable'
}) {
  if (entries.length === 0) {
    return (
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          {icon}
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">No clear matchups in this category.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
        {icon}
        {title}
      </h3>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.opponentId}>
            <Link
              to={`/compare?left=${pokemonId}&right=${entry.opponentId}`}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors hover:bg-white/20',
                variant === 'favorable'
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-red-500/30 bg-red-500/5',
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/80 p-1">
                <PokemonImage
                  pokemonId={entry.opponentId}
                  src={entry.opponentSpriteUrl}
                  loading="lazy"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">
                  {formatPokemonName(entry.opponentName)}
                </span>
                <span className="line-clamp-2 text-xs opacity-80">{entry.summary}</span>
              </span>
              <ArrowLeftRight className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PokemonMatchupsPanel({
  pokemonId,
  matchups,
  theme,
  className,
}: PokemonMatchupsPanelProps) {
  return (
    <section
      className={cn('overflow-hidden rounded-[14px] border-[3px] shadow-md', className)}
      style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
    >
      <h2
        className="px-4 py-2 text-xs font-black uppercase tracking-widest"
        style={{ backgroundColor: theme.header }}
      >
        TCG Matchups
      </h2>
      <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-2">
        <MatchupList
          title="Favorable"
          icon={<TrendingUp className="h-4 w-4 text-green-600" aria-hidden />}
          entries={matchups.favorable}
          pokemonId={pokemonId}
          variant="favorable"
        />
        <MatchupList
          title="Unfavorable"
          icon={<TrendingDown className="h-4 w-4 text-red-600" aria-hidden />}
          entries={matchups.unfavorable}
          pokemonId={pokemonId}
          variant="unfavorable"
        />
      </div>
      <div
        className="border-t px-4 py-2 text-center text-[10px] font-medium opacity-70"
        style={{ borderColor: theme.frame }}
      >
        Based on TCG HP, attack damage, weakness ×2, and resistance −30
      </div>
    </section>
  )
}
