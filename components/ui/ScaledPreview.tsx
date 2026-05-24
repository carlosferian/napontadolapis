'use client'

import { useRef, useState, useLayoutEffect } from 'react'

interface ScaledPreviewProps {
  children: React.ReactNode
  naturalWidth?: number
  className?: string
}

export function ScaledPreview({ children, naturalWidth = 600, className = '' }: ScaledPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number | undefined>()

  useLayoutEffect(() => {
    function update() {
      if (!containerRef.current || !innerRef.current) return
      const cw = containerRef.current.clientWidth
      const newScale = cw >= naturalWidth ? 1 : cw / naturalWidth
      setScale(newScale)
      setHeight(innerRef.current.scrollHeight * newScale)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [naturalWidth])

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden rounded-2xl ${className}`}
      style={{ height: height !== undefined && height > 0 ? height : undefined }}
    >
      <div
        ref={innerRef}
        style={{
          transformOrigin: 'top left',
          transform: scale < 1 ? `scale(${scale})` : undefined,
          width: naturalWidth,
        }}
      >
        {children}
      </div>
    </div>
  )
}
