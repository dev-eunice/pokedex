import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import { cn } from '@/lib/utils/cn'

/** Decorative Gen 1 artwork — borderless, transparent, secondary to page content. */
const FEATURED_POKEMON_ID = 151

interface AboutHeroVisualProps {
  className?: string
}

export function AboutHeroVisual({ className }: AboutHeroVisualProps) {
  return (
    <aside
      className={cn(
        'pointer-events-none mx-auto w-full max-w-[180px] shrink-0 select-none sm:max-w-[220px] lg:max-w-[260px]',
        className,
      )}
      aria-hidden
    >
      <PokemonImage
        pokemonId={FEATURED_POKEMON_ID}
        alt=""
        loading="eager"
        fetchPriority="low"
        className="mx-auto max-h-36 w-full object-contain opacity-90 drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] sm:max-h-44 lg:max-h-52 dark:drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
      />
    </aside>
  )
}
