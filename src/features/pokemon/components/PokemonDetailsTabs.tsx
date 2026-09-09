import { GitBranch, LayoutGrid, Swords } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { getTcgTheme } from '@/features/pokemon/utils/tcgTheme'
import { cn } from '@/lib/utils/cn'

export type PokemonDetailsTab = 'overview' | 'evolution' | 'matchups'

const TAB_ITEMS: {
  id: PokemonDetailsTab
  label: string
  icon: typeof LayoutGrid
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'evolution', label: 'Evolution', icon: GitBranch },
  { id: 'matchups', label: 'Matchups', icon: Swords },
]

interface PokemonDetailsTabsProps {
  theme: ReturnType<typeof getTcgTheme>
  overview: ReactNode
  evolution: ReactNode
  matchups: ReactNode
  defaultTab?: PokemonDetailsTab
}

export function PokemonDetailsTabs({
  theme,
  overview,
  evolution,
  matchups,
  defaultTab = 'overview',
}: PokemonDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<PokemonDetailsTab>(defaultTab)

  const panels: Record<PokemonDetailsTab, ReactNode> = {
    overview,
    evolution,
    matchups,
  }

  return (
    <section
      className="overflow-hidden rounded-[14px] border-[3px] shadow-md"
      style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
    >
      <div
        className="flex gap-1 overflow-x-auto p-2"
        style={{ backgroundColor: theme.header }}
        role="tablist"
        aria-label="Pokémon data sections"
      >
        {TAB_ITEMS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`pokemon-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`pokemon-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide transition-all sm:px-4 sm:text-sm',
                isActive
                  ? 'shadow-sm'
                  : 'opacity-75 hover:opacity-100',
              )}
              style={
                isActive
                  ? { backgroundColor: theme.background, color: theme.text }
                  : { color: theme.text }
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`pokemon-panel-${activeTab}`}
        aria-labelledby={`pokemon-tab-${activeTab}`}
        className="p-4 sm:p-5"
      >
        {panels[activeTab]}
      </div>
    </section>
  )
}
