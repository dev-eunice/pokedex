import type { PokemonStat } from '@/features/pokemon/types/domain.types'
import { cn } from '@/lib/utils/cn'

interface PokemonStatsProps {
  stats: PokemonStat[]
  accentColor?: string
  trackColor?: string
  textColor?: string
  className?: string
}

export function PokemonStats({
  stats,
  accentColor,
  trackColor = 'rgba(0,0,0,0.1)',
  textColor,
  className,
}: PokemonStatsProps) {
  const maxStat = Math.max(...stats.map((stat) => stat.value), 1)

  return (
    <div className={cn('space-y-3', className)}>
      {stats.map((stat) => (
        <div key={stat.name}>
          <div
            className="mb-1 flex items-center justify-between text-[11px] font-bold"
            style={textColor ? { color: textColor } : undefined}
          >
            <span>{stat.label}</span>
            <span className="tabular-nums opacity-80">{stat.value}</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: trackColor }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(stat.value / maxStat) * 100}%`,
                background: accentColor
                  ? `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`
                  : undefined,
              }}
              role="progressbar"
              aria-valuenow={stat.value}
              aria-valuemin={0}
              aria-valuemax={maxStat}
              aria-label={`${stat.label}: ${stat.value}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
