import { MapPinOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <EmptyState
      icon={<MapPinOff className="h-8 w-8" />}
      title="Page not found"
      description="The page you're looking for doesn't exist in this Pokédex."
      action={
        <Button asChild>
          <Link to="/">Return to Pokédex</Link>
        </Button>
      }
    />
  )
}
