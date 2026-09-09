import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '@/features/pokemon/components/ConfirmDialog'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { CapturedPokemon } from '@/features/captured/types/captured.types'
import { useCapturedPokemonActions } from '@/hooks/useCapturedPokemon'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import {
  formatCaptureDate,
  formatPokedexNumber,
  formatPokemonName,
} from '@/lib/utils/format'

interface CapturedPokemonCardProps {
  entry: CapturedPokemon
}

export function CapturedPokemonCard({ entry }: CapturedPokemonCardProps) {
  const { uncapture } = useCapturedPokemonActions()
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  function handleUncapture() {
    setIsRemoving(true)
    uncapture(entry.pokemonId)
    toast({
      variant: 'success',
      title: 'Pokémon removed',
      description: `${formatPokemonName(entry.name)} was removed from your collection.`,
    })
    setConfirmOpen(false)
    setIsRemoving(false)
  }

  return (
    <>
      <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md sm:flex-row">
        <Link
          to={`/pokemon/${entry.pokemonId}`}
          className="flex flex-1 items-center gap-4 p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-surface p-2">
            <PokemonImage
              pokemonId={entry.pokemonId}
              width={80}
              height={80}
              className="h-full w-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              {formatPokedexNumber(entry.pokemonId)}
            </p>
            <h3 className="truncate font-display text-lg font-semibold capitalize">
              {formatPokemonName(entry.name)}
            </h3>
            <p className="mt-1 text-sm">
              Nickname:{' '}
              <span className="font-medium text-foreground">{entry.nickname}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Captured {formatCaptureDate(entry.capturedAt)}
            </p>
          </div>
        </Link>

        <div className="flex items-center border-t border-border p-3 sm:border-l sm:border-t-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            aria-label={`Remove ${formatPokemonName(entry.name)} from captured list`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remove captured Pokémon?"
        description={`This will remove ${formatPokemonName(entry.name)} (${entry.nickname}) from your captured collection.`}
        confirmLabel="Remove"
        onConfirm={handleUncapture}
        isLoading={isRemoving}
      />
    </>
  )
}
