'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function EmbedDetector() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isEmbed = searchParams.get('embed') === 'true'
      if (isEmbed) {
        document.documentElement.classList.add('is-embedded')
      } else {
        document.documentElement.classList.remove('is-embedded')
      }
    }
  }, [searchParams])

  return null
}

export function EmbedHandler() {
  return (
    <Suspense fallback={null}>
      <EmbedDetector />
    </Suspense>
  )
}
