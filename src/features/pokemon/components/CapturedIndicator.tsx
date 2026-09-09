import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CapturedIndicatorProps {
  className?: string
  size?: 'sm' | 'md'
}

export function CapturedIndicator({ className, size = 'md' }: CapturedIndicatorProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-success/15 text-success',
        size === 'sm' ? 'h-6 w-6' : 'h-7 w-7',
        className,
      )}
      aria-label="Captured"
      title="Captured"
    >
      <CheckCircle2 className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />
    </span>
  )
}
