import { CheckCircle2, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { CapturedPokemonCard } from '@/features/captured/components/CapturedPokemonCard'
import { useCapturedPokemonList } from '@/hooks/useCapturedPokemon'
import { Button } from '@/components/ui/button'
import { GEN1_TOTAL } from '@/lib/constants'

export function CapturedPage() {
  const captured = useCapturedPokemonList()

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Captured
        </h1>
        <p className="text-muted-foreground">
          {captured.length} of {GEN1_TOTAL} Gen 1 Pokémon captured
        </p>
      </section>

      {captured.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-8 w-8" />}
          title="No Pokémon captured yet"
          description="Start exploring the Pokédex and build your team."
          action={
            <Button asChild>
              <Link to="/">
                <Compass className="h-4 w-4" aria-hidden />
                Explore Pokédex
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {captured.map((entry) => (
            <CapturedPokemonCard key={entry.pokemonId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
