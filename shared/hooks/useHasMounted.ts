'use client'

import { useSyncExternalStore } from 'react'

function subscribe(onStoreChange: () => void) {
  const timeout = window.setTimeout(onStoreChange, 0)
  return () => window.clearTimeout(timeout)
}

export function useHasMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
