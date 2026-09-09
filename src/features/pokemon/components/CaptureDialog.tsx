import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PokemonImage } from '@/features/pokemon/components/PokemonImage'
import type { PokemonSummary } from '@/features/pokemon/types/domain.types'
import { useCapturedPokemonActions } from '@/hooks/useCapturedPokemon'
import { useToast } from '@/components/ui/toast'
import { NICKNAME_MAX_LENGTH } from '@/lib/constants'
import {
  formatPokemonName,
  getTodayDateString,
  isValidCaptureDate,
} from '@/lib/utils/format'

interface CaptureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pokemon: PokemonSummary
}

interface FormErrors {
  nickname?: string
  capturedAt?: string
}

export function CaptureDialog({ open, onOpenChange, pokemon }: CaptureDialogProps) {
  const { capture } = useCapturedPokemonActions()
  const { toast } = useToast()
  const [nickname, setNickname] = useState('')
  const [capturedAt, setCapturedAt] = useState(getTodayDateString())
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setNickname('')
      setCapturedAt(getTodayDateString())
      setErrors({})
      setIsSubmitting(false)
    }
  }, [open, pokemon.id])

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    const trimmedNickname = nickname.trim()

    if (!trimmedNickname) {
      nextErrors.nickname = 'Nickname is required.'
    } else if (trimmedNickname.length > NICKNAME_MAX_LENGTH) {
      nextErrors.nickname = `Nickname must be ${NICKNAME_MAX_LENGTH} characters or fewer.`
    }

    if (!isValidCaptureDate(capturedAt)) {
      nextErrors.capturedAt = 'Enter a valid capture date.'
    }

    return nextErrors
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)

    try {
      capture({
        pokemonId: pokemon.id,
        name: pokemon.name,
        nickname: nickname.trim(),
        capturedAt,
      })

      toast({
        variant: 'success',
        title: 'Pokémon captured!',
        description: `${formatPokemonName(pokemon.name)} was added to your collection.`,
      })

      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="capture-dialog-description">
        <DialogHeader>
          <DialogTitle>Tag as Captured</DialogTitle>
          <DialogDescription id="capture-dialog-description">
            Add {formatPokemonName(pokemon.name)} to your captured collection.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 rounded-xl bg-surface p-4">
          <PokemonImage
            pokemonId={pokemon.id}
            src={pokemon.spriteUrl}
            width={80}
            height={80}
            className="h-20 w-20"
          />
          <div>
            <p className="font-display text-lg font-semibold capitalize">
              {formatPokemonName(pokemon.name)}
            </p>
            <p className="text-sm text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="capture-nickname" className="text-sm font-medium">
              Nickname
            </label>
            <Input
              id="capture-nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={NICKNAME_MAX_LENGTH}
              placeholder="Give your Pokémon a nickname"
              aria-invalid={Boolean(errors.nickname)}
              aria-describedby={errors.nickname ? 'nickname-error' : undefined}
            />
            {errors.nickname ? (
              <p id="nickname-error" className="text-sm text-destructive" role="alert">
                {errors.nickname}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="capture-date" className="text-sm font-medium">
              Capture date
            </label>
            <Input
              id="capture-date"
              type="date"
              value={capturedAt}
              onChange={(event) => setCapturedAt(event.target.value)}
              aria-invalid={Boolean(errors.capturedAt)}
              aria-describedby={errors.capturedAt ? 'date-error' : undefined}
            />
            {errors.capturedAt ? (
              <p id="date-error" className="text-sm text-destructive" role="alert">
                {errors.capturedAt}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                'Tag as Captured'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
