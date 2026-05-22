import { useState } from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronDownIcon, Moon, PanelLeftClose, PanelLeftOpen, Settings, Sun } from 'lucide-react'
import { useAppStore, useStore, useDisplayStore } from '@/stores'
import { altSign, ctrlKey, ctrlSign, shiftSign } from '@/config'
import { toast } from 'sonner'
import { processClipboardContent } from '@/utils'

import { PostInfo } from '@/components/PostInfo'

export function EditorHeader() {
  const {
    isDark,
    toggleDark,
    isOpenPostSlider,
    setIsOpenPostSlider,
    isOpenRightSlider,
    setIsOpenRightSlider,
    primaryColor,
  } = useAppStore()

  const {
    output,
    editorRefresh,
    formatContent,
    exportEditorContent2HTML,
    exportEditorContent2MD,
    importMarkdownContent,
    importDefaultContent,
    resetStyleConfirm,
    editor,
  } = useStore()

  const {
    toggleShowCssEditor,
    toggleShowUploadImgDialog,
    toggleShowInsertFormDialog,
    toggleShowAboutDialog,
  } = useDisplayStore()

  const [copyMode, setCopyMode] = useState('txt')

  const formatItems = [
    { label: '加粗', kbd: [ctrlSign, 'B'], action: () => addFormat(`${ctrlKey}-B`) },
    { label: '斜体', kbd: [ctrlSign, 'I'], action: () => addFormat(`${ctrlKey}-I`) },
    { label: '删除线', kbd: [ctrlSign, 'D'], action: () => addFormat(`${ctrlKey}-D`) },
    { label: '超链接', kbd: [ctrlSign, 'K'], action: () => addFormat(`${ctrlKey}-K`) },
    { label: '行内代码', kbd: [ctrlSign, 'E'], action: () => addFormat(`${ctrlKey}-E`) },
    { label: '格式化', kbd: [altSign, shiftSign, 'F'], action: formatContent },
  ]

  function addFormat(shortcut: string) {
    if (!editor) return
    const cm = editor as any
    if (cm.options.extraKeys && cm.options.extraKeys[shortcut]) {
      cm.options.extraKeys[shortcut](cm)
    }
  }

  function handleCopy() {
    const appState = useAppStore.getState()
    appState.setIsCopying(true)
    setTimeout(() => {
      const isBeforeDark = isDark
      if (isBeforeDark) {
        toggleDark()
      }

      setTimeout(async () => {
        processClipboardContent(primaryColor)
        const clipboardDiv = document.getElementById('output')
        if (!clipboardDiv) {
          appState.setIsCopying(false)
          return
        }
        
        clipboardDiv.focus()
        window.getSelection()?.removeAllRanges()
        const temp = clipboardDiv.innerHTML
        
        if (copyMode === 'txt') {
          const range = document.createRange()
          range.setStartBefore(clipboardDiv.firstChild!)
          range.setEndAfter(clipboardDiv.lastChild!)
          window.getSelection()?.addRange(range)
          document.execCommand('copy')
          window.getSelection()?.removeAllRanges()
        }
        
        clipboardDiv.innerHTML = output
        if (isBeforeDark) {
          setTimeout(() => toggleDark(), 0)
        }
        
        if (copyMode === 'html') {
          await navigator.clipboard.writeText(temp)
        }

        toast.success(
          copyMode === 'html'
            ? '已复制 HTML 源码，请进行下一步操作。'
            : '已复制渲染后的内容到剪贴板，可直接到公众号后台粘贴。'
        )

        editorRefresh()
        appState.setIsCopying(false)
      }, 100)
    }, 350)
  }

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b bg-white dark:bg-[#191c20]">
      <div className="flex space-x-2">
        <Menubar className="border-none shadow-none bg-transparent">
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">文件</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={importMarkdownContent}>导入 .md 文档</MenubarItem>
              <MenubarItem onSelect={importDefaultContent}>导入默认文档</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={exportEditorContent2MD}>导出 .md 文档</MenubarItem>
              <MenubarItem onSelect={exportEditorContent2HTML}>导出 .html</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">编辑</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => toggleShowUploadImgDialog()}>自定义图床</MenubarItem>
              <MenubarItem onSelect={() => toggleShowInsertFormDialog()}>插入表格</MenubarItem>
              <MenubarItem onSelect={() => toggleShowCssEditor()}>自定义 CSS</MenubarItem>
              <MenubarItem onSelect={resetStyleConfirm}>恢复默认样式</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">格式</MenubarTrigger>
            <MenubarContent className="w-60" align="start">
              {formatItems.map(({ label, kbd, action }) => (
                <MenubarItem key={label} onSelect={action}>
                  {label}
                  <MenubarShortcut>
                    {kbd.map((item, idx) => (
                      <kbd key={idx} className="mx-1 border px-1 rounded text-xs bg-gray-100 dark:bg-stone-800">
                        {item}
                      </kbd>
                    ))}
                  </MenubarShortcut>
                </MenubarItem>
              ))}
              <MenubarSeparator />
              <MenubarItem onSelect={() => setIsOpenRightSlider(true)}>
                更多设置...
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">帮助</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => toggleShowAboutDialog()}>关于</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setIsOpenPostSlider(!isOpenPostSlider)}>
                {isOpenPostSlider ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isOpenPostSlider ? "关闭" : "内容管理"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PostInfo />

        <Button variant="outline" size="icon" onClick={() => toggleDark()}>
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <div className="flex items-center bg-background border rounded-md mx-2 h-9">
          <Button variant="ghost" className="shadow-none rounded-r-none h-full px-3" onClick={handleCopy}>
            复制
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-2 shadow-none rounded-l-none h-full">
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]">
              <DropdownMenuRadioGroup value={copyMode} onValueChange={setCopyMode}>
                <DropdownMenuRadioItem value="txt">公众号格式</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="html">HTML 格式</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button variant="outline" size="icon" onClick={() => setIsOpenRightSlider(!isOpenRightSlider)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
