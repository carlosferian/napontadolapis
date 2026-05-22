export async function downloadShareCard(elementId: string, filename: string): Promise<void> {
  const html2canvas = (await import('html2canvas')).default
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  })

  const link = document.createElement('a')
  link.download = `napontadolapis-${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function copyShareCard(elementId: string): Promise<boolean> {
  try {
    const html2canvas = (await import('html2canvas')).default
    const element = document.getElementById(elementId)
    if (!element) return false

    const canvas = await html2canvas(element, { scale: 2, backgroundColor: null })
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve))
    if (!blob) return false

    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  } catch {
    return false
  }
}
