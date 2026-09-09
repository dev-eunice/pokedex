import { useState } from 'react'
import {
  getPokemonArtworkUrl,
  getPokemonPixelSpriteUrl,
} from '@/lib/utils/pokemon'
import { cn } from '@/lib/utils/cn'

interface PokemonImageProps {
  pokemonId: number
  src?: string
  alt?: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function PokemonImage({
  pokemonId,
  src,
  alt = '',
  className,
  width,
  height,
  loading = 'lazy',
  fetchPriority,
}: PokemonImageProps) {
  const artworkUrl = src ?? getPokemonArtworkUrl(pokemonId)
  const pixelSpriteUrl = getPokemonPixelSpriteUrl(pokemonId)
  const [imageSrc, setImageSrc] = useState(artworkUrl)

  function handleError() {
    setImageSrc((current) => (current === pixelSpriteUrl ? current : pixelSpriteUrl))
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={handleError}
      className={cn('h-auto w-full object-contain', className)}
    />
  )
}
