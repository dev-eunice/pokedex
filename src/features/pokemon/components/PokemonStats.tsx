import type { PokemonStat } from '@/features/pokemon/types/domain.types'

interface PokemonStatsProps {
  stats: PokemonStat[]
}

export function PokemonStats({ stats }: PokemonStatsProps) {
  const maxStat = Math.max(...stats.map((stat) => stat.value), 1)

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.name}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">{stat.label}</span>
            <span className="tabular-nums text-muted-foreground">{stat.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${(stat.value / maxStat) * 100}%` }}
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
