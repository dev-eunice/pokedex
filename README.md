# Gen 1 Pokédex

A frontend assessment project for exploring, searching, and tracking captured Gen 1 Pokémon (#001–#151).

## Features

- Browse all 151 Gen 1 Pokémon with API-backed pagination
- Grid and list views with persisted preference
- Instant client-side search by name or Pokédex number
- Detailed Pokémon pages with types, stats, abilities, height, and weight
- Capture flow with nickname and capture date validation
- Captured collection stored in `localStorage`
- Uncapture with confirmation dialog
- Dark/light theme with system preference support
- Responsive layout for mobile, tablet, and desktop
- Loading skeletons, empty states, and user-friendly error handling
- Accessible dialogs, keyboard navigation, and semantic HTML

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- TanStack Query
- Radix UI Dialog primitives
- Lucide icons
- Vitest + Testing Library

## Architecture

```
src/
  api/                 # fetch client + Pokémon API functions
  components/          # shared UI, layout, search, pagination
  features/
    pokemon/           # list, details, capture UI, hooks, utils
    captured/          # captured page + cards
  hooks/               # theme, debounce, captured state
  lib/
    constants.ts
    storage/           # localStorage abstractions
    utils/
  routes/              # React Router config
  pages/               # global pages (404)
```

### Data Flow

```
Component → custom hook → TanStack Query → API function → fetch → PokéAPI
```

### State Separation

- **Server state**: Pokémon list/details via TanStack Query
- **Persisted client state**: captured Pokémon + theme/view preferences via storage helpers
- **UI state**: dialogs, form inputs, mobile nav

### Search + Pagination Strategy

- Normal browsing uses PokéAPI pagination (`limit=24`, `offset=n`) with `keepPreviousData`
- Search prefetches the full Gen 1 list once and filters client-side
- When search is active, pagination applies to filtered results instead of API pages

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

### Test

```bash
npm test
```

## Environment Variables

No environment variables are required. The app uses public PokéAPI endpoints.

## API

- List: `https://pokeapi.co/api/v2/pokemon/?limit={limit}&offset={offset}`
- Detail: `https://pokeapi.co/api/v2/pokemon/{id}/`
- Sprites: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`

Documentation: [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)

## Important Decisions

- **No global state library**: captured Pokémon uses `useSyncExternalStore` over a storage abstraction for instant cross-page updates without Redux/Zustand.
- **Search dataset prefetch**: Gen 1 list is prefetched in the background so search feels instant after the first load.
- **URL-driven list state**: `search`, `page`, and `view` live in query params for shareable/bookmarkable browsing.
- **Strict TypeScript**: API and domain types are separated; `any` is avoided.
- **Route-level code splitting**: Pokémon details are lazy-loaded.

## Trade-offs

- Search loads the full Gen 1 list (151 items) once. This is acceptable for a fixed dataset and enables instant filtering.
- PokéAPI returns all Pokémon globally; the app caps display to Gen 1 via API limits and ID validation.
- Toast notifications are lightweight and custom rather than adding another dependency.

## Bonus Features

- Dark/light theme toggle with flash prevention script
- URL query params for search/page/view
- Route-level code splitting
- Netlify SPA redirect configuration
- Unit tests for search filtering and captured storage

## Deployment (Netlify)

1. Connect the repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. SPA routing is configured in `netlify.toml`

Direct routes like `/pokemon/25` and `/captured` work after refresh.

## Deployment URL

- **GitHub Repository:** [https://github.com/dev-eunice/pokedex](https://github.com/dev-eunice/pokedex)
- https://app.netlify.com/projects/eu-pokedex-sandbox/overview
