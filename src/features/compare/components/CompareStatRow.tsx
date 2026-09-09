import { cn } from '@/lib/utils/cn'

interface CompareStatRowProps {
  label: string
  leftValue: string | number
  rightValue: string | number
  highlight?: 'left' | 'right' | 'none'
  className?: string
}

export function CompareStatRow({
  label,
  leftValue,
  rightValue,
  highlight = 'none',
  className,
}: CompareStatRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 border-b border-border/60 py-2.5 text-xs last:border-b-0 sm:gap-2 sm:text-sm',
        className,
      )}
    >
      <span
        className={cn(
          'min-w-0 truncate text-right font-semibold tabular-nums',
          highlight === 'left' && 'text-green-600 dark:text-green-400',
        )}
        title={String(leftValue)}
      >
        {leftValue}
      </span>
      <span className="shrink-0 px-1 text-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:min-w-[4.5rem] sm:text-xs">
        {label}
      </span>
      <span
        className={cn(
          'min-w-0 truncate font-semibold tabular-nums',
          highlight === 'right' && 'text-green-600 dark:text-green-400',
        )}
        title={String(rightValue)}
      >
        {rightValue}
      </span>
    </div>
  )
}
