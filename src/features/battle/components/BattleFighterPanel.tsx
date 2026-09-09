import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import { PokemonTypeIcon } from '@/features/pokemon/components/PokemonTypeIcon'
import type { BattleFighter } from '@/features/battle/types/battle.types'
import { formatTcgTypeLabel } from '@/features/battle/utils/tcgBattleTraits'
import { getTcgTheme } from '@/features/pokemon/utils/tcgTheme'
import { formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface BattleFighterPanelProps {
  fighter: BattleFighter
  currentHp?: number
  side: 'left' | 'right'
  isWinner?: boolean
  className?: string
}

export function BattleFighterPanel({
  fighter,
  currentHp,
  side,
  isWinner = false,
  className,
}: BattleFighterPanelProps) {
  const theme = getTcgTheme(fighter.cardType)
  const hp = currentHp ?? fighter.maxHp
  const hpPercent = Math.max(0, Math.min(100, (hp / fighter.maxHp) * 100))
  const damageTaken = fighter.maxHp - hp
  const damageCounters = Math.floor(damageTaken / 10)

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[14px] border-[3px] shadow-md transition-shadow',
        isWinner && 'ring-2 ring-yellow-400/70',
        className,
      )}
      style={{
        borderColor: theme.border,
        background: theme.background,
        color: theme.text,
      }}
    >
      <header
        className="flex items-center justify-between gap-2 px-3 py-2"
        style={{ backgroundColor: theme.header }}
      >
        <h3 className="truncate text-sm font-black uppercase tracking-tight">
          {formatPokemonName(fighter.name)}
        </h3>
        <PokemonTypeIcon type={fighter.cardType} size="sm" />
      </header>

      <div className="p-3">
        <div
          className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-xl border-2 bg-white/80 p-1.5 sm:h-28 sm:w-28 sm:p-2"
          style={{ borderColor: theme.frame }}
        >
          <PokemonImage
            pokemonId={fighter.id}
            src={fighter.spriteUrl}
            loading="eager"
            fetchPriority="high"
            className={cn(
              'object-contain transition-transform',
              side === 'right' && 'scale-x-[-1]',
            )}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase">
            <span>HP</span>
            <span>
              {hp}/{fighter.maxHp}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/15">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${hpPercent}%`,
                backgroundColor:
                  hpPercent > 50 ? '#22c55e' : hpPercent > 20 ? '#eab308' : '#ef4444',
              }}
            />
          </div>
          {damageCounters > 0 ? (
            <p className="text-center text-[10px] font-semibold uppercase tracking-wide opacity-80">
              {damageCounters} damage counter{damageCounters === 1 ? '' : 's'} placed
            </p>
          ) : null}
        </div>

        <div
          className="mt-3 rounded-md border px-2 py-1.5 text-center text-[10px] font-semibold sm:text-[11px]"
          style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.25)' }}
        >
          <span className="block truncate sm:inline">{fighter.attackName}</span>
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">{fighter.attackDamage} damage</span>
        </div>

        <div
          className="mt-2 grid grid-cols-3 gap-1 text-center text-[9px] font-bold uppercase tracking-wide sm:text-[10px]"
          style={{ backgroundColor: theme.header }}
        >
          <div className="rounded px-1 py-1">
            <p className="opacity-70">Weakness</p>
            <p>{fighter.weakness ? `${formatTcgTypeLabel(fighter.weakness)} ×2` : '—'}</p>
          </div>
          <div className="rounded px-1 py-1">
            <p className="opacity-70">Resistance</p>
            <p>{fighter.resistance ? `${formatTcgTypeLabel(fighter.resistance)} −30` : '—'}</p>
          </div>
          <div className="rounded px-1 py-1">
            <p className="opacity-70">Retreat</p>
            <p>{fighter.retreat}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
