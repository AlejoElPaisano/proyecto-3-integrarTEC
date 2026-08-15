'use client'

import { useEffect } from 'react'

interface ShortcutHandlers {
  onGenerate: () => void
  onCopy: () => void
  onToggleHistory: () => void
}

function isEditableElement(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable
}

function hasSelection(): boolean {
  const selection = window.getSelection()
  return !!selection && selection.toString().length > 0
}

export function useKeyboardShortcuts({ onGenerate, onCopy, onToggleHistory }: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return

      const key = e.key.toLowerCase()
      if (key === 'g') {
        e.preventDefault()
        onGenerate()
        return
      }
      if (key === 'b') {
        e.preventDefault()
        onToggleHistory()
        return
      }
      if (key === 'c') {
        if (isEditableElement(document.activeElement) || hasSelection()) return
        e.preventDefault()
        onCopy()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onGenerate, onCopy, onToggleHistory])
}