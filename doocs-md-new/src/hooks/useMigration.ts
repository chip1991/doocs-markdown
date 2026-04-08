import { useEffect } from 'react'
import { useAppStore } from '@/stores'

export function useMigration() {
  useEffect(() => {
    let hasMigration = false
    const migratedState: Record<string, unknown> = {}
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('doocs-md-') && key !== 'doocs-md-storage') {
        const stateKey = key.replace('doocs-md-', '')
        const rawValue = localStorage.getItem(key)
        
        if (rawValue !== null) {
          try {
            migratedState[stateKey] = JSON.parse(rawValue)
          } catch {
            migratedState[stateKey] = rawValue
          }
          keysToRemove.push(key)
          hasMigration = true
        }
      }
    }

    if (hasMigration) {
      useAppStore.setState(migratedState)
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
  }, [])
}
