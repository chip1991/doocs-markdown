import { useAppStore, useStore } from '@/stores'

export function Footer() {
  const { isCountStatus } = useAppStore()
  const { readingTime } = useStore()

  if (!isCountStatus || !readingTime) return null

  return (
    <footer className="h-[30px] flex items-center justify-end px-5 bg-white dark:bg-[#191c20] text-xs text-muted-foreground">
      <div className="flex items-center space-x-4">
        <span>{readingTime.words} words</span>
        <span>{Math.ceil(readingTime.minutes)} min</span>
      </div>
    </footer>
  )
}
