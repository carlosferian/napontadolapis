'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="c-theme-toggle"
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      <span className={`c-theme-btn ${theme === 'light' ? 'is-active' : ''}`} aria-hidden="true">
        ☀
      </span>
      <span className={`c-theme-btn ${theme === 'dark' ? 'is-active' : ''}`} aria-hidden="true">
        ◑
      </span>
    </button>
  )
}
