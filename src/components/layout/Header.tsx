import { ArrowLeftRight, CheckCircle2, Menu, Swords, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useCapturedPokemonList } from '@/hooks/useCapturedPokemon'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { to: '/', label: 'Pokédex', end: true },
  { to: '/captured', label: 'Captured', end: false },
  { to: '/compare', label: 'Compare', end: false },
  { to: '/battle', label: 'Battle', end: false },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const captured = useCapturedPokemonList()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="group flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <span className="font-display text-sm font-bold">G1</span>
          </span>
          <div>
            <p className="font-display text-base font-bold leading-none sm:text-lg">
              <span className="sm:hidden">Pokédex</span>
              <span className="hidden sm:inline">Gen 1 Pokédex</span>
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">Kanto Region</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-2.5 py-2 text-xs font-medium transition-colors lg:px-4 lg:text-sm',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )
              }
            >
              <span className="inline-flex items-center gap-2">
                {item.label}
                {item.to === '/captured' && captured.length > 0 ? (
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                    {captured.length}
                  </span>
                ) : null}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="border-t border-border bg-background px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-4 py-3 text-sm font-medium',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60',
                  )
                }
              >
                <span className="inline-flex items-center gap-2">
                  {item.to === '/compare' ? (
                    <ArrowLeftRight className="h-4 w-4" aria-hidden />
                  ) : null}
                  {item.to === '/battle' ? (
                    <Swords className="h-4 w-4" aria-hidden />
                  ) : null}
                  {item.to === '/captured' ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  ) : null}
                  {item.label}
                  {item.to === '/captured' && captured.length > 0 ? (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                      {captured.length}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
