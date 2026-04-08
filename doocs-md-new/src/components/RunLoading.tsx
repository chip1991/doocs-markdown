import { useAppStore } from '@/stores'
import favicon from '@/assets/images/favicon.png'

export function RunLoading() {
  const { isCopying } = useAppStore()

  if (!isCopying) return null

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center w-screen h-screen text-lg bg-background">
      <img src={favicon} alt="logo" className="w-[100px] h-[100px] mb-[26px]" />
      <strong className="text-foreground">致力于让 Markdown 编辑更简单</strong>
      <div className="mt-4 flex items-center space-x-2">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-muted-foreground">正在生成</span>
      </div>
    </div>
  )
}
