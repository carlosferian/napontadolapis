import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: {
    default: 'Na Ponta do Lápis — calculadoras financeiras para o brasileiro',
    template: '%s | Na Ponta do Lápis',
  },
  description: 'Calculadoras financeiras que mostram o custo real das suas decisões. Sem julgamento, só os números.',
  metadataBase: new URL('https://napontadolapis.com.br'),
  openGraph: {
    siteName: 'Na Ponta do Lápis',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-stone-50">
        <Nav />
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="max-w-2xl mx-auto px-4 py-8 border-t border-stone-100 mt-8">
          <p className="text-xs text-stone-400 text-center">
            <span className="text-amber-500">·</span> na ponta do lápis — os números não mentem. a gente só mostra eles.
          </p>
        </footer>
      </body>
    </html>
  )
}
