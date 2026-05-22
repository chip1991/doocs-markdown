import { useDisplayStore } from '@/stores'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function AboutDialog() {
  const { isShowAboutDialog, toggleShowAboutDialog } = useDisplayStore()

  return (
    <Dialog open={isShowAboutDialog} onOpenChange={toggleShowAboutDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>关于 Doocs MD</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">
            一款高度简洁的微信建文排版工具，支持 Markdown 语法。
          </p>
          <p className="text-sm">
            <a
              href="https://github.com/doocs/md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub 仓库
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
