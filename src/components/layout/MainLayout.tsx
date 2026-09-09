import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-border/80 py-6 text-center text-xs text-muted-foreground">
        Data provided by{' '}
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          PokéAPI
        </a>
      </footer>
    </div>
  )
}
