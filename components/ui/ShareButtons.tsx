'use client'

import React, { useState, useEffect } from 'react'
import { downloadShareCard, copyShareCard } from '@/lib/shareCard'

interface ShareButtonsProps {
  cardId: string
  filename: string
}

export function ShareButtons({ cardId, filename }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIframeUrl(`${window.location.origin}${window.location.pathname}?embed=true`)
    }
  }, [])

  async function handleDownload() {
    setDownloading(true)
    await downloadShareCard(cardId, filename)
    setDownloading(false)
  }

  async function handleCopy() {
    const ok = await copyShareCard(cardId)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleCopyEmbed() {
    const iframeCode = `<iframe src="${iframeUrl}" width="100%" height="800" style="border:none;background:transparent;" allow="clipboard-write"></iframe>`
    try {
      await navigator.clipboard.writeText(iframeCode)
      setEmbedCopied(true)
      setTimeout(() => setEmbedCopied(false), 2000)
    } catch (err) {
      console.error('Falha ao copiar código', err)
    }
  }

  return (
    <div className="space-y-3">
      {/* Botões principais de compartilhamento de imagem */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-xs sm:text-sm cursor-pointer"
        >
          {downloading ? 'Gerando...' : '⬇ Baixar imagem'}
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors text-xs sm:text-sm cursor-pointer border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          {copied ? '✓ Copiado!' : '⎘ Copiar imagem'}
        </button>
      </div>

      {/* Botão de Incorporação (Embed) */}
      <button
        onClick={() => setShowEmbed(!showEmbed)}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold rounded-xl transition-all text-xs sm:text-sm cursor-pointer ${
          showEmbed 
            ? 'bg-emerald-600 text-white' 
            : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10'
        }`}
      >
        {showEmbed ? '✕ Fechar código' : '</> Incorporar no seu site (Widget)'}
      </button>

      {/* Accordion / Painel retrátil do Embed */}
      {showEmbed && iframeUrl && (
        <div 
          className="p-3.5 rounded-xl border bg-stone-500/5 space-y-2.5 text-xs select-none"
          style={{ borderColor: 'var(--c-line)' }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--c-muted)' }}>
              Código HTML do Widget
            </span>
            <button
              onClick={handleCopyEmbed}
              className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700 transition-colors text-[10px] cursor-pointer"
            >
              {embedCopied ? '✓ Copiado!' : 'Copiar Código'}
            </button>
          </div>
          <textarea
            readOnly
            value={`<iframe src="${iframeUrl}" width="100%" height="800" style="border:none;background:transparent;" allow="clipboard-write"></iframe>`}
            className="w-full h-16 p-2 border rounded-lg font-mono text-[10px] resize-none focus:outline-none cursor-pointer tabular-nums"
            style={{
              backgroundColor: 'var(--c-bg)',
              color: 'var(--c-ink)',
              borderColor: 'var(--c-line)'
            }}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
          <p className="text-[10px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Insira o código acima no editor HTML do seu blog ou site (WordPress, Webflow, Blogger, etc.). O widget é 100% responsivo e herda a cor de fundo do seu portal.
          </p>
        </div>
      )}
    </div>
  )
}
