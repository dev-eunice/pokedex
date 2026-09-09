import { Grid3X3, List } from 'lucide-react'
import type { ViewMode } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn('inline-flex shrink-0 rounded-lg border border-border bg-card p-1', className)}
      role="group"
      aria-label="View mode"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-3',
          value === 'grid' && 'bg-muted text-foreground shadow-sm',
        )}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-3',
          value === 'list' && 'bg-muted text-foreground shadow-sm',
        )}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  )
}
