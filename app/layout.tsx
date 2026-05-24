import type { Metadata } from 'next'
import Image from 'next/image'
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
      <body className="min-h-screen bg-brand-paper overflow-x-hidden">
        <Nav />
        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          {children}
        </main>
        <footer className="max-w-4xl mx-auto px-4 py-12 border-t border-brand-border mt-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden">
              <Image src="/logo.png" alt="Na Ponta do Lápis" width={36} height={36} className="object-cover" />
            </div>
            <p className="text-sm font-serif font-semibold text-brand-ink tracking-tight">na ponta do lápis</p>
            <p className="text-xs text-brand-muted text-center max-w-xs leading-relaxed">
              Calculadoras honestas que mostram a realidade dos números.<br />
              Sem julgamento, só a conta.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
