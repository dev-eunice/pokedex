import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { PokemonSkeleton } from '@/features/pokemon/components/PokemonSkeleton'
import { PokedexPage } from '@/features/pokemon/pages/PokedexPage'
import { BattlePage } from '@/features/battle/pages/BattlePage'
import { CapturedPage } from '@/features/captured/pages/CapturedPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const PokemonDetailsPage = lazy(() =>
  import('@/features/pokemon/pages/PokemonDetailsPage').then((module) => ({
    default: module.PokemonDetailsPage,
  })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <PokedexPage />,
      },
      {
        path: 'captured',
        element: <CapturedPage />,
      },
      {
        path: 'battle',
        element: <BattlePage />,
      },
      {
        path: 'pokemon/:id',
        element: (
          <Suspense fallback={<PokemonSkeleton viewMode="grid" count={1} />}>
            <PokemonDetailsPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
