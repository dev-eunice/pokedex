import { cn } from '@/lib/utils/cn'
import { formatPokemonName } from '@/lib/utils/format'

const TYPE_STYLES: Record<string, string> = {
  normal: 'bg-stone-500/15 text-stone-700 dark:text-stone-200',
  fire: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  water: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  electric: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-200',
  grass: 'bg-green-500/15 text-green-700 dark:text-green-300',
  ice: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  fighting: 'bg-red-500/15 text-red-700 dark:text-red-300',
  poison: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  ground: 'bg-amber-600/15 text-amber-800 dark:text-amber-200',
  flying: 'bg-indigo-400/15 text-indigo-700 dark:text-indigo-300',
  psychic: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
  bug: 'bg-lime-600/15 text-lime-800 dark:text-lime-200',
  rock: 'bg-yellow-700/15 text-yellow-900 dark:text-yellow-200',
  ghost: 'bg-violet-600/15 text-violet-700 dark:text-violet-300',
  dragon: 'bg-indigo-600/15 text-indigo-700 dark:text-indigo-300',
  dark: 'bg-neutral-700/15 text-neutral-800 dark:text-neutral-200',
  steel: 'bg-slate-500/15 text-slate-700 dark:text-slate-200',
  fairy: 'bg-rose-400/15 text-rose-700 dark:text-rose-300',
}

interface PokemonTypeBadgeProps {
  type: string
}

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
        TYPE_STYLES[type] ?? 'bg-muted text-foreground',
      )}
    >
      {formatPokemonName(type)}
    </span>
  )
}
