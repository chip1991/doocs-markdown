import { useEffect, useRef, useState } from 'react'
import { Edit3, Plus, X } from 'lucide-react'
import { useAppStore, useStore, useDisplayStore } from '@/stores'
import { toast } from 'sonner'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/css/css'
import 'codemirror/theme/darcula.css'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CssEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const {
    cssContentConfig,
    renameTab,
    addCssContentTab,
    tabChanged,
    validatorTabName,
    isDark
  } = useAppStore()

  const { cssEditor, setCssEditor, updateCss } = useStore()
  const { isShowCssEditor } = useDisplayStore()

  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false)
  const [addInputVal, setAddInputVal] = useState('')

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)
  const [editInputVal, setEditInputVal] = useState('')

  const [isOpenDelTabConfirmDialog, setIsOpenDelTabConfirmDialog] = useState(false)
  const [delTargetName, setDelTargetName] = useState('')

  const [tabHistory, setTabHistory] = useState(['', cssContentConfig.active])

  useEffect(() => {
    if (!textareaRef.current) return

    const cm = CodeMirror.fromTextArea(textareaRef.current, {
      mode: 'css',
      theme: isDark ? 'darcula' : 'xq-light',
      lineNumbers: true,
      lineWrapping: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      matchBrackets: true,
    } as any)

    setCssEditor(cm)

    cm.on('change', (e) => {
      const activeTab = useAppStore.getState().cssContentConfig.active
      const tabs = [...useAppStore.getState().cssContentConfig.tabs]
      const tabIndex = tabs.findIndex(t => t.name === activeTab)
      if (tabIndex > -1) {
        tabs[tabIndex].content = e.getValue()
        useAppStore.setState({ cssContentConfig: { ...useAppStore.getState().cssContentConfig, tabs } })
      }
      updateCss()
    })

    return () => {
      cm.toTextArea()
      setCssEditor(null)
    }
  }, []) // Initialize only once

  useEffect(() => {
    if (cssEditor) {
      cssEditor.setOption('theme', isDark ? 'darcula' : 'xq-light')
    }
  }, [isDark, cssEditor])

  useEffect(() => {
    if (cssEditor) {
      const activeTab = cssContentConfig.tabs.find(t => t.name === cssContentConfig.active)
      if (activeTab && cssEditor.getValue() !== activeTab.content) {
        cssEditor.setValue(activeTab.content)
      }
    }
  }, [cssContentConfig.active, cssEditor]) // When tab changes, update editor value

  function handleRename(name: string) {
    setEditInputVal(name)
    setIsOpenEditDialog(true)
  }

  function editTabName() {
    if (!editInputVal.trim()) {
      toast.error('新建失败，方案名不可为空')
      return
    }

    if (editInputVal !== cssContentConfig.active && !validatorTabName(editInputVal)) {
      toast.error('不能与现有方案重名')
      return
    }
    renameTab(editInputVal)
    setIsOpenEditDialog(false)
    toast.success('修改成功~')
  }

  function handleAddTab() {
    if (!addInputVal.trim()) {
      toast.error('新建失败，方案名不可为空')
      return
    }

    if (!validatorTabName(addInputVal)) {
      toast.error('不能与现有方案重名')
      return
    }

    addCssContentTab(addInputVal)
    setIsOpenAddDialog(false)
    setTabHistory([tabHistory[1], addInputVal])
    toast.success('新建成功~')
  }

  function removeHandler(targetName: string) {
    setDelTargetName(targetName)
    setIsOpenDelTabConfirmDialog(true)
  }

  function delTab() {
    const tabs = useAppStore.getState().cssContentConfig.tabs
    if (tabs.length === 1) {
      toast.warning('至少保留一个方案')
      setIsOpenDelTabConfirmDialog(false)
      return
    }

    let activeName = cssContentConfig.active
    if (activeName === delTargetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === delTargetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    }

    tabChanged(activeName)
    const newTabs = tabs.filter(tab => tab.name !== delTargetName)
    useAppStore.setState({ cssContentConfig: { active: activeName, tabs: newTabs } })
    
    setIsOpenDelTabConfirmDialog(false)
    toast.success('删除成功~')
  }

  function addHandler() {
    setAddInputVal(`方案${cssContentConfig.tabs.length + 1}`)
    setIsOpenAddDialog(true)
  }

  function handleTabChange(value: string) {
    if (value === 'add') {
      addHandler()
      return
    }

    setTabHistory([tabHistory[1], value])
    tabChanged(value)
  }

  if (!isShowCssEditor) return null

  return (
    <div
      className="order-2 flex flex-col flex-1 h-full bg-white dark:bg-[#1e1e1e] border-l transition-all duration-300 ease-in-out"
    >
      <Tabs value={cssContentConfig.active} onValueChange={handleTabChange} className="w-full flex-none">
        <TabsList className="w-full flex justify-start overflow-x-auto rounded-none border-b h-12 px-2 bg-transparent">
          {cssContentConfig.tabs.map(item => (
            <TabsTrigger
              key={item.name}
              value={item.name}
              className="flex-shrink-0 relative group data-[state=active]:bg-muted"
            >
              {item.title}
              {cssContentConfig.active === item.name && (
                <div className="flex items-center ml-2 space-x-1">
                  <Edit3
                    className="size-4 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRename(item.name)
                    }}
                  />
                  <X
                    className="size-4 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeHandler(item.name)
                    }}
                  />
                </div>
              )}
            </TabsTrigger>
          ))}
          <TabsTrigger value="add" className="flex-shrink-0 px-3">
            <Plus className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 3rem)' }}>
        <textarea
          ref={textareaRef}
          id="cssEditor"
          placeholder="Your custom css here."
          className="hidden"
        />
      </div>

      <Dialog open={isOpenAddDialog} onOpenChange={setIsOpenAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新建自定义 CSS</DialogTitle>
            <DialogDescription>
              请输入方案名称
            </DialogDescription>
          </DialogHeader>
          <Input value={addInputVal} onChange={e => setAddInputVal(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenAddDialog(false)}>取消</Button>
            <Button onClick={handleAddTab}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpenEditDialog} onOpenChange={setIsOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑方案名称</DialogTitle>
            <DialogDescription>
              请输入新的方案名称
            </DialogDescription>
          </DialogHeader>
          <Input value={editInputVal} onChange={e => setEditInputVal(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenEditDialog(false)}>取消</Button>
            <Button onClick={editTabName}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenDelTabConfirmDialog} onOpenChange={setIsOpenDelTabConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提示</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除该自定义方案，是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={delTab}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
