'use client'

import React, { useState } from 'react'
import { downloadShareCard, copyShareCard } from '@/lib/shareCard'

interface ShareButtonsProps {
  cardId: string
  filename: string
}

export function ShareButtons({ cardId, filename }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

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

  return (
    <div className="flex gap-3">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        {downloading ? 'Gerando...' : '⬇ Baixar imagem'}
      </button>
      <button
        onClick={handleCopy}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors text-sm"
      >
        {copied ? '✓ Copiado!' : '⎘ Copiar'}
      </button>
    </div>
  )
}
