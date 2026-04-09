import { useEffect } from 'react'
import { useAppStore } from '@/stores'
import { useMigration } from '@/hooks/useMigration'
import { EditorHeader } from '@/components/EditorHeader'
import { CodemirrorEditor } from '@/components/CodemirrorEditor'
import { PreviewArea } from '@/components/PreviewArea'
import { CssEditor } from '@/components/CssEditor'
import { Toaster } from '@/components/ui/sonner'
import { PostSlider } from '@/components/PostSlider'
import { RightSlider } from '@/components/RightSlider'
import { AlertDialog } from '@/components/AlertDialog'
import { InsertFormDialog } from '@/components/InsertFormDialog'
import { AboutDialog } from '@/components/AboutDialog'
import { RunLoading } from '@/components/RunLoading'
import { Footer } from '@/components/Footer'

function App() {
  useMigration()
  const { isDark } = useAppStore()

  // Apply dark mode to html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 overflow-hidden">
      <EditorHeader />

      <main className="container-main flex flex-1 flex-col overflow-hidden relative">
        <div className="container-main-section border-radius-10 relative flex flex-1 overflow-hidden border">
          <PostSlider />

          {/* Editor and Preview Area container */}
          <div className="flex flex-1 overflow-hidden">
            <CodemirrorEditor />
            <PreviewArea />
          </div>

          <RightSlider />
          {/* CSS Editor (shown conditionally inside component) */}
          <CssEditor />
        </div>
      </main>

      <Footer />

      <Toaster richColors position="top-center" />
      <AlertDialog />
      <InsertFormDialog />
      <RunLoading />
      <AboutDialog />
    </div>
  )
}

export default App
