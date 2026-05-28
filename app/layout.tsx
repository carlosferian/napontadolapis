import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'
import { Nav } from '@/components/Nav'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: {
    default: 'A Ponta do Lápis — calculadoras financeiras para o brasileiro',
    template: '%s | A Ponta do Lápis',
  },
  description: 'Calculadoras financeiras gratuitas para o brasileiro: custo de apostas, cigarro, vape, viagens internacionais, dividir conta e comparativo de investimentos. Sem cadastro, sem julgamento.',
  metadataBase: new URL('https://apontadolapis.com.br'),
  keywords: ['calculadora financeira', 'custo de apostas', 'custo do cigarro', 'calculadora de viagem', 'dividir conta', 'comparativo de investimentos', 'selic', 'IOF câmbio', 'educação financeira'],
  openGraph: {
    siteName: 'A Ponta do Lápis',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen calm-bg overflow-x-hidden">
        <ThemeProvider>
          <Nav />
          <main className="calm-main max-w-7xl mx-auto px-4 py-8 sm:py-12">
            {children}
          </main>
          <footer className="calm-footer max-w-7xl mx-auto px-4 py-12 mt-12" style={{ borderTop: '1px solid var(--c-line)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src="/logo.png" alt="A Ponta do Lápis" width={32} height={32} className="object-cover" />
                </div>
                <div>
                  <p className="c-display font-semibold text-sm" style={{ color: 'var(--c-ink)' }}>a ponta do lápis</p>
                  <p className="c-eyebrow" style={{ fontSize: 10, marginTop: 2 }}>© 2026 · FEITO NO BRASIL</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <Link href="/apostas" className="c-eyebrow hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
                  APOSTAS
                </Link>
                <Link href="/fumo" className="c-eyebrow hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
                  CIGARRO
                </Link>
                <Link href="/investimentos" className="c-eyebrow hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
                  INVESTIMENTOS
                </Link>
                <Link href="/viagens" className="c-eyebrow hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
                  VIAGENS
                </Link>
              </div>
            </div>
            <p className="c-eyebrow mt-6" style={{ fontSize: 10, color: 'var(--c-muted-2)' }}>
              SEM CADASTRO · SEM CPF · SEM JULGAMENTO · OS CÁLCULOS RODAM NO SEU NAVEGADOR
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
