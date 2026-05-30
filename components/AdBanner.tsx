'use client'

import React, { useEffect } from 'react'

interface AdBannerProps {
  slot: string // Código do bloco de anúncio fornecido pelo AdSense
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal'
  responsive?: 'true' | 'false'
  className?: string
}

export function AdBanner({
  slot,
  format = 'auto',
  responsive = 'true',
  className = '',
}: AdBannerProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    // Apenas executa no cliente se o AdSense estiver ativo e configurado
    if (typeof window !== 'undefined' && client) {
      try {
        // Inicializa o bloco de anúncios do AdSense
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (err) {
        console.error('Erro ao carregar o bloco AdSense:', err)
      }
    }
  }, [client])

  // Se a ID do AdSense não estiver configurada no Netlify, exibe um placeholder discreto apenas em desenvolvimento
  if (!client) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div 
          className={`my-6 rounded-2xl border border-dashed p-6 flex flex-col items-center justify-center text-center bg-stone-500/5 ${className}`}
          style={{ borderColor: 'var(--c-line)', minHeight: 100 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Espaço Publicitário (AdSense)
          </span>
          <p className="text-[11px] text-stone-400 mt-1 leading-normal max-w-xs">
            Este bloco modular exibirá anúncios discretos em produção assim que a variável <strong>NEXT_PUBLIC_ADSENSE_CLIENT_ID</strong> for configurada.
          </p>
        </div>
      )
    }
    return null // Em produção, se não configurado, não renderiza nada na tela
  }

  return (
    <div 
      className={`my-6 overflow-hidden rounded-2xl border flex items-center justify-center bg-stone-500/5 ${className}`}
      style={{ borderColor: 'var(--c-line)', minHeight: 90 }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}
