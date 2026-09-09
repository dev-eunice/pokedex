import { ChevronDown, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'
import { filterPokemonByQuery } from '@/features/pokemon/utils/search'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatPokedexNumber, formatPokemonName } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface SearchablePokemonSelectProps {
  label: string
  pokemon: PokemonSummary[]
  value: number | null
  onChange: (id: number) => void
  disabledIds?: number[]
  className?: string
}

export function SearchablePokemonSelect({
  label,
  pokemon,
  value,
  onChange,
  disabledIds = [],
  className,
}: SearchablePokemonSelectProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const selected = pokemon.find((entry) => entry.id === value) ?? null

  const filtered = useMemo(() => {
    const results = filterPokemonByQuery(pokemon, query)
    return results.slice(0, 12)
  }, [pokemon, query])

  function handleSelect(id: number) {
    onChange(id)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className={cn('relative space-y-2', className)}>
      <p className="text-sm font-semibold">{label}</p>

      <Button
        type="button"
        variant="outline"
        className="h-auto w-full justify-between gap-3 px-3 py-2.5"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted p-1">
              <PokemonImage
                pokemonId={selected.id}
                src={selected.spriteUrl}
                loading="eager"
                fetchPriority="high"
              />
            </span>
            <span className="min-w-0 text-left">
              <span className="block truncate font-bold">
                {formatPokemonName(selected.name)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatPokedexNumber(selected.id)}
              </span>
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">Choose a Pokémon…</span>
        )}
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} />
      </Button>

      {open ? (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-card p-2 shadow-xl">
          <div className="relative mb-2">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or number…"
              className="pl-9"
              autoFocus
            />
          </div>

          <ul className="max-h-56 space-y-1 overflow-y-auto" role="listbox" aria-label={label}>
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No matches found.</li>
            ) : (
              filtered.map((entry) => {
                const isDisabled = disabledIds.includes(entry.id)
                const isSelected = entry.id === value

                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={isDisabled}
                      onClick={() => handleSelect(entry.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors',
                        isSelected && 'bg-muted',
                        isDisabled
                          ? 'cursor-not-allowed opacity-40'
                          : 'hover:bg-muted/70',
                      )}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted p-1">
                        <PokemonImage
                          pokemonId={entry.id}
                          src={entry.spriteUrl}
                          loading="eager"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {formatPokemonName(entry.name)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatPokedexNumber(entry.id)}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
