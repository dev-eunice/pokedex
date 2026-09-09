import {
  Accessibility,
  Gauge,
  Layers,
  Shield,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutHeroVisual } from '@/features/about/components/AboutHeroVisual'
import { AboutPanel } from '@/features/about/components/AboutPanel'
import { getTcgTheme } from '@/features/pokemon/utils/tcgTheme'
import { GEN1_TOTAL } from '@/lib/constants'

const theme = getTcgTheme('psychic')

const techStack = [
  { name: 'React 19', role: 'UI components & interactivity' },
  { name: 'TypeScript', role: 'End-to-end type safety' },
  { name: 'Vite', role: 'Fast dev server & production builds' },
  { name: 'Tailwind CSS v4', role: 'Utility-first styling & theming' },
  { name: 'React Router', role: 'Client-side routing & URL state' },
  { name: 'TanStack Query', role: 'Server state, caching & prefetch' },
  { name: 'Radix UI', role: 'Accessible dialog primitives' },
  { name: 'Lucide Icons', role: 'Consistent iconography' },
  { name: 'Vitest', role: 'Unit & integration tests' },
  { name: '@google/model-viewer', role: 'Lazy-loaded 3D Pokémon models' },
]

const stackReasons = [
  {
    tech: 'React + TypeScript',
    why: 'Component-driven UI with strict typing catches bugs early and keeps features like battle, compare, and capture consistent.',
  },
  {
    tech: 'Vite',
    why: 'Near-instant HMR and optimized bundles — important when detail pages lazy-load heavy 3D assets.',
  },
  {
    tech: 'TanStack Query',
    why: 'PokéAPI data is cached, deduplicated, and prefetched so pagination, search, and detail views feel instant.',
  },
  {
    tech: 'React Router',
    why: 'Shareable URLs for search, pagination, compare pairs, and battle matchups without full page reloads.',
  },
  {
    tech: 'Tailwind CSS',
    why: 'Responsive layouts, dark mode, and TCG card styling stay co-located with components and ship minimal CSS.',
  },
]

const engineeringPractices = [
  'Reusable UI primitives — buttons, dialogs, panels, skeletons, and layout shells',
  'Feature-based folders — pokemon, captured, battle, compare, about',
  'Typed domain models — API responses transformed into clean app types',
  'Separated state — TanStack Query for server data, localStorage for capture prefs',
  'Responsive design — mobile-first grids, stacked nav, touch-friendly controls',
  'Loading & error UX — skeletons, empty states, retry actions, and toasts',
  'Lazy loading — code-split details page and 3D viewer chunk',
  'Tests — search utils, storage, TCG damage, and battle simulation',
]

const focusAreas = [
  {
    icon: Layers,
    title: 'Maintainability',
    description: 'Clear module boundaries, shared utilities, and conventions that make new features easy to add.',
  },
  {
    icon: Workflow,
    title: 'Scalability',
    description: 'Query caching, pagination, and client-side search patterns that scale to full Gen 1 without choking the UI.',
  },
  {
    icon: Gauge,
    title: 'Performance',
    description: 'Prefetching, image preloading, keepPreviousData pagination, and lazy routes for heavy assets.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    description: 'Semantic HTML, ARIA labels, keyboard-friendly dialogs, and readable contrast in light & dark mode.',
  },
  {
    icon: Sparkles,
    title: 'UX',
    description: 'TCG-inspired visuals, instant feedback, capture flow, matchup insights, and animated battle logs.',
  },
]

const appFeatures = [
  { label: 'Pokédex', to: '/', detail: `Browse all ${GEN1_TOTAL} Gen 1 Pokémon with search & pagination` },
  { label: 'Captured', to: '/captured', detail: 'Track your team with nicknames and capture dates' },
  { label: 'Compare', to: '/compare', detail: 'Side-by-side stats and TCG matchup predictions' },
  { label: 'Battle', to: '/battle', detail: 'Turn-based TCG duel simulator with coin flip & damage log' },
]

export function AboutPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative grid items-center gap-4 sm:gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
        <div className="relative z-10 space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            About
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Gen 1 Pokédex — a project built with modern React patterns,
            TCG-inspired design, and production-minded engineering.
          </p>
        </div>
        <AboutHeroVisual className="lg:-mr-2 lg:opacity-95" />
      </section>

      <AboutPanel theme={theme} title="Project Overview">
        <p className="text-sm leading-relaxed sm:text-base">
          This application is an interactive Kanto-region Pokédex for the original{' '}
          <span className="font-semibold">{GEN1_TOTAL} Pokémon</span>. Browse official artwork,
          inspect stats and abilities, tag captures to your personal collection, compare TCG
          matchups, and simulate battles — all powered by{' '}
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2 hover:opacity-80"
          >
            PokéAPI
          </a>
          .
        </p>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {appFeatures.map((feature) => (
            <li key={feature.to}>
              <Link
                to={feature.to}
                className="block rounded-lg border px-3 py-2.5 transition-colors hover:bg-white/25"
                style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <span className="text-sm font-bold">{feature.label}</span>
                <p className="mt-0.5 text-xs opacity-80">{feature.detail}</p>
              </Link>
            </li>
          ))}
        </ul>
      </AboutPanel>

      <AboutPanel theme={theme} title="Tech Stack">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border px-3 py-2.5"
              style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <p className="text-sm font-black">{item.name}</p>
              <p className="mt-0.5 text-xs opacity-80">{item.role}</p>
            </div>
          ))}
        </div>
      </AboutPanel>

      <AboutPanel theme={theme} title="Why This Stack">
        <ul className="space-y-3">
          {stackReasons.map((item) => (
            <li
              key={item.tech}
              className="rounded-lg border px-3 py-3"
              style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <p className="text-sm font-black">{item.tech}</p>
              <p className="mt-1 text-sm leading-relaxed opacity-90">{item.why}</p>
            </li>
          ))}
        </ul>
      </AboutPanel>

      <AboutPanel theme={theme} title="Engineering Practices">
        <ul className="grid gap-2 sm:grid-cols-2">
          {engineeringPractices.map((practice) => (
            <li
              key={practice}
              className="flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
              style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <Shield className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden />
              <span>{practice}</span>
            </li>
          ))}
        </ul>
      </AboutPanel>

      <AboutPanel theme={theme} title="Our Focus">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <article
              key={area.title}
              className="rounded-lg border p-4"
              style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <area.icon className="mb-2 h-5 w-5 opacity-80" aria-hidden />
              <h3 className="text-sm font-black">{area.title}</h3>
              <p className="mt-1 text-xs leading-relaxed opacity-90 sm:text-sm">
                {area.description}
              </p>
            </article>
          ))}
        </div>

        <p
          className="mt-4 rounded-lg border px-4 py-3 text-xs sm:text-sm"
          style={{ borderColor: theme.frame, backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          Built as a portfolio-grade SPA — deployable to Netlify with SPA routing, tested
          utilities, and a cohesive TCG visual language across every tab.
        </p>
      </AboutPanel>
    </div>
  )
}
