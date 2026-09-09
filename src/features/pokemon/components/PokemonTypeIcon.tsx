import { cn } from '@/lib/utils/cn'

const TYPE_SYMBOLS: Record<string, string> = {
  normal: '◉',
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
  ice: '❄',
  fighting: '👊',
  poison: '☠',
  ground: '⛰',
  flying: '🪽',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌑',
  steel: '⚙',
  fairy: '✦',
}

const TYPE_COLORS: Record<string, string> = {
  normal: '#a8a878',
  fire: '#f08030',
  water: '#6890f0',
  grass: '#78c850',
  electric: '#f8d030',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
}

interface PokemonTypeIconProps {
  type: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PokemonTypeIcon({ type, size = 'md', className }: PokemonTypeIconProps) {
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.normal
  const symbol = TYPE_SYMBOLS[type] ?? '◉'

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border-2 border-black/20 font-bold shadow-sm',
        size === 'sm' && 'h-5 w-5 text-[10px]',
        size === 'md' && 'h-7 w-7 text-xs',
        size === 'lg' && 'h-9 w-9 text-sm',
        className,
      )}
      style={{ backgroundColor: color }}
      aria-label={type}
      title={type}
    >
      <span aria-hidden>{symbol}</span>
    </span>
  )
}
