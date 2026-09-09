import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface AboutPanelProps {
  title: string
  children: ReactNode
  className?: string
  theme: {
    border: string
    background: string
    header: string
    text: string
    frame: string
  }
}

export function AboutPanel({ title, children, className, theme }: AboutPanelProps) {
  return (
    <section
      className={cn('overflow-hidden rounded-[14px] border-[3px] shadow-md', className)}
      style={{ borderColor: theme.border, background: theme.background, color: theme.text }}
    >
      <h2
        className="px-4 py-2 text-xs font-black uppercase tracking-widest"
        style={{ backgroundColor: theme.header }}
      >
        {title}
      </h2>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}
