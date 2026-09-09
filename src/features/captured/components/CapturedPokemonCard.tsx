import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '@/features/pokemon/components/ConfirmDialog'
import { CapturedIndicator } from '@/features/pokemon/components/CapturedIndicator'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import { PokemonTypeIcon } from '@/features/pokemon/components/PokemonTypeIcon'
import type { CapturedPokemon } from '@/features/captured/types/captured.types'
import { getPokemonCardMeta } from '@/features/pokemon/utils/cardMeta'
import { getTcgTheme } from '@/features/pokemon/utils/tcgTheme'
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

  const cardMeta = getPokemonCardMeta(entry.pokemonId)
  const theme = getTcgTheme(cardMeta.type)

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
      <div className="group relative aspect-[5/7] w-full max-w-[280px] justify-self-center drop-shadow-[0_0_12px_rgba(255,215,0,0.45)] sm:max-w-[240px]">
        <Link
          to={`/pokemon/${entry.pokemonId}`}
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`${entry.nickname}, ${formatPokemonName(entry.name)}, captured ${formatCaptureDate(entry.capturedAt)}`}
        >
          <article
            className="relative flex h-full flex-col overflow-hidden rounded-[14px] border-[3px] p-1.5 shadow-lg transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-xl"
            style={{
              borderColor: theme.border,
              background: theme.background,
              color: theme.text,
            }}
          >
            <CapturedIndicator className="absolute right-2 top-2 z-10" size="sm" />

            {/* Header */}
            <header
              className="mb-1 flex items-center justify-between gap-1 rounded-md px-1.5 py-1"
              style={{ backgroundColor: theme.header }}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className="shrink-0 rounded px-1 py-0.5 text-[8px] font-black uppercase tracking-wider"
                  style={{ backgroundColor: '#2ecc71', color: '#fff' }}
                >
                  Captured
                </span>
                <h3 className="truncate text-sm font-black uppercase tracking-tight">
                  {formatPokemonName(entry.name)}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-[10px] font-black">
                  HP <span className="text-sm">{cardMeta.hp}</span>
                </span>
                <PokemonTypeIcon type={cardMeta.type} size="sm" />
              </div>
            </header>

            {/* Art frame */}
            <div
              className="relative mb-1 overflow-hidden rounded-md border-2 p-1.5"
              style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.35)' }}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-white/80">
                <PokemonImage
                  pokemonId={entry.pokemonId}
                  className="h-full w-full scale-110 object-contain transition-transform duration-300 group-hover:scale-[1.15]"
                />
              </div>
            </div>

            {/* Info strip */}
            <p
              className="mb-1 truncate rounded px-1 py-0.5 text-center text-[8px] font-semibold italic"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              {formatPokedexNumber(entry.pokemonId)} · Gen 1 Pokémon
            </p>

            {/* Nickname row (replaces attack row) */}
            <div
              className="mb-1 rounded-md border px-1.5 py-1"
              style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <p className="text-[7px] font-bold uppercase tracking-wide opacity-70">
                Nickname
              </p>
              <p className="truncate text-[11px] font-black">{entry.nickname}</p>
            </div>

            {/* Footer — simplified on small screens */}
            <footer className="mt-auto space-y-1">
              <div
                className="hidden items-center justify-between rounded px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide sm:flex"
                style={{ backgroundColor: theme.header }}
              >
                <span>Captured</span>
                <span>Type</span>
                <span>Status</span>
              </div>
              <p
                className="rounded px-1 py-0.5 text-center text-[8px] font-semibold leading-tight"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                {formatCaptureDate(entry.capturedAt)}
              </p>
              <p
                className="hidden line-clamp-2 rounded px-1 py-0.5 text-[7px] leading-tight italic sm:block"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                Added to your personal collection. This Pokémon is ready for battle.
              </p>
              <p className="text-center text-[6px] font-semibold uppercase tracking-widest opacity-70">
                Trainer Card
              </p>
            </footer>
          </article>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-2 top-2 z-20 h-7 w-7 rounded-full border border-black/10 bg-white/90 text-destructive shadow-sm hover:bg-white hover:text-destructive"
          onClick={() => setConfirmOpen(true)}
          aria-label={`Remove ${formatPokemonName(entry.name)} from captured list`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

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
