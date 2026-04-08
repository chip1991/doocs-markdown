import { useEffect, useRef, useState } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/darcula.css'
import '@/assets/xq-light.css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import { useAppStore, useStore, useDisplayStore } from '@/stores'
import { altKey, altSign, ctrlKey, shiftKey, shiftSign } from '@/config'
import { checkImage, toBase64 } from '@/utils'
import fileApi from '@/utils/file'
import { toast } from 'sonner'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import { UploadImgDialog } from '@/components/UploadImgDialog'

export function CodemirrorEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isImgLoading, setIsImgLoading] = useState(false)
  const changeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    isDark,
    posts,
    currentPostIndex,
    isEditOnLeft,
  } = useAppStore()

  const {
    editor,
    setEditor,
    editorRefresh,
    formatContent,
    exportEditorContent2HTML,
    exportEditorContent2MD,
    importMarkdownContent,
    importDefaultContent,
    resetStyleConfirm,
  } = useStore()

  const {
    toggleShowInsertFormDialog,
    toggleShowUploadImgDialog,
  } = useDisplayStore()

  useEffect(() => {
    if (!textareaRef.current) return

    if (!textareaRef.current.value && posts[currentPostIndex]) {
      textareaRef.current.value = posts[currentPostIndex].content
    }

    const cm = CodeMirror.fromTextArea(textareaRef.current, {
      mode: 'text/x-markdown',
      theme: isDark ? 'darcula' : 'xq-light',
      lineNumbers: false,
      lineWrapping: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      extraKeys: {
        [`${shiftKey}-${altKey}-F`]: function autoFormat() {
          formatContent()
        },
        [`${ctrlKey}-B`]: function bold(cm: any) {
          const selected = cm.getSelection()
          cm.replaceSelection(`**${selected}**`)
        },
        [`${ctrlKey}-I`]: function italic(cm: any) {
          const selected = cm.getSelection()
          cm.replaceSelection(`*${selected}*`)
        },
        [`${ctrlKey}-D`]: function del(cm: any) {
          const selected = cm.getSelection()
          cm.replaceSelection(`~~${selected}~~`)
        },
        [`${ctrlKey}-K`]: function link(cm: any) {
          const selected = cm.getSelection()
          cm.replaceSelection(`[${selected}]()`)
        },
        [`${ctrlKey}-E`]: function code(cm: any) {
          const selected = cm.getSelection()
          cm.replaceSelection(`\`${selected}\``)
        },
      },
    } as any)

    setEditor(cm)

    cm.on('change', (e) => {
      if (changeTimerRef.current) clearTimeout(changeTimerRef.current)
      changeTimerRef.current = setTimeout(() => {
        editorRefresh()
        const newPosts = [...useAppStore.getState().posts]
        newPosts[useAppStore.getState().currentPostIndex].content = e.getValue()
        useAppStore.setState({ posts: newPosts })
      }, 300)
    })

    return () => {
      cm.toTextArea()
      setEditor(null)
    }
  }, []) // Initialize only once

  useEffect(() => {
    if (editor) {
      editor.setOption('theme', isDark ? 'darcula' : 'xq-light')
    }
  }, [isDark, editor])

  useEffect(() => {
    if (!editor) return

    const handlePaste = (_cm: CodeMirror.Editor, e: ClipboardEvent) => {
      if (!(e.clipboardData && e.clipboardData.items) || isImgLoading) {
        return
      }
      for (let i = 0, len = e.clipboardData.items.length; i < len; ++i) {
        const item = e.clipboardData.items[i]
        if (item.kind === 'file') {
          const pasteFile = item.getAsFile()!
          const isValid = beforeUpload(pasteFile)
          if (!isValid) continue
          uploadImage(pasteFile)
        }
      }
    }

    editor.on('paste', handlePaste)
    return () => {
      editor.off('paste', handlePaste)
    }
  }, [editor, isImgLoading])

  const beforeUpload = (file: File) => {
    const checkResult = checkImage(file)
    if (!checkResult.ok) {
      toast.error(checkResult.msg!)
      return false
    }

    const imgHost = useAppStore.getState().imgHost || 'default'
    if (!useAppStore.getState().imgHost) {
      useAppStore.setState({ imgHost: 'default' })
    }

    const config = (useAppStore.getState() as any)[`${imgHost}Config`]
    const isValidHost = imgHost === 'default' || config
    if (!isValidHost) {
      toast.error(`请先配置 ${imgHost} 图床参数`)
      return false
    }
    return true
  }

  const uploaded = (imageUrl: string) => {
    if (!imageUrl) {
      toast.error('上传图片未知异常')
      return
    }
    toggleShowUploadImgDialog() // Pass false if it accepts a boolean
    if (editor) {
      const cursor = editor.getCursor()
      const markdownImage = `![](${imageUrl})`
      editor.replaceSelection(`\n${markdownImage}\n`, cursor as any)
      toast.success('图片上传成功')
    }
  }

  const uploadImage = (file: File, cb?: (url: any) => void) => {
    setIsImgLoading(true)

    toBase64(file)
      .then((base64Content) => fileApi.fileUpload(base64Content as string, file))
      .then((url) => {
        if (cb) {
          cb(url)
        } else {
          uploaded(url as string)
        }
      })
      .catch((err) => {
        toast.error(err.message)
      })
      .finally(() => {
        setIsImgLoading(false)
      })
  }

  useEffect(() => {
    if (!editor || !wrapperRef.current) return

    const dom = wrapperRef.current

    const showFileStructure = async (root: any) => {
      const result = []
      let cwd = ''
      try {
        const dirs = [root]
        for (const dir of dirs) {
          cwd += `${dir.name}/`
          for await (const [, handle] of dir) {
            if (handle.kind === 'file') {
              result.push({
                path: cwd + handle.name,
                file: await handle.getFile(),
              })
            } else {
              result.push({
                path: `${cwd + handle.name}/`,
              })
              dirs.push(handle)
            }
          }
        }
      } catch (err) {
        console.error(err)
      }
      return result
    }

    const getMd = async ({ list }: { list: { path: string, file: File }[] }) => {
      return new Promise<{ str: string, file: File, path: string } | undefined>((resolve) => {
        const found = list.find(item => item.path.match(/\.md$/))
        if (!found) {
          resolve(undefined)
          return
        }
        const { path, file } = found
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = (evt) => {
          resolve({
            str: evt.target!.result as string,
            file,
            path,
          })
        }
      })
    }

    const uploadMdImg = async ({ md, list }: { md: { str: string, path: string, file: File }, list: { path: string, file: File }[] }) => {
      const mdImgList = [
        ...(md.str.matchAll(/!\[(.*?)\]\((.*?)\)/g) || []),
      ].filter((item) => item)

      const rootMatch = md.path.match(/.+?\//)
      if (!rootMatch) return
      const root = rootMatch[0]

      const resList = await Promise.all<{ matchStr: string, url: string }>(
        mdImgList.map((item) => {
          return new Promise((resolve) => {
            let [, , matchStr] = item
            matchStr = matchStr.replace(/^.\//, '')
            const found = list.find(f => f.path === `${root}${matchStr}`)
            if (found && found.file) {
              uploadImage(found.file, (url) => {
                resolve({ matchStr, url })
              })
            } else {
              resolve({ matchStr, url: matchStr })
            }
          })
        })
      )

      resList.forEach((item) => {
        md.str = md.str
          .replace(`](./${item.matchStr})`, `](${item.url})`)
          .replace(`](${item.matchStr})`, `](${item.url})`)
      })
      editor.setValue(md.str)
    }

    const handleDragOver = (evt: DragEvent) => evt.preventDefault()
    
    const handleDrop = async (evt: any) => {
      evt.preventDefault()
      if (!evt.dataTransfer?.items) return
      for (const item of evt.dataTransfer.items) {
        if (typeof item.getAsFileSystemHandle === 'function') {
          item.getAsFileSystemHandle().then(async (handle: any) => {
            if (handle?.kind === 'directory') {
              const list = await showFileStructure(handle) as { path: string, file: File }[]
              const md = await getMd({ list })
              if (md) {
                uploadMdImg({ md, list })
              }
            } else if (handle?.kind === 'file') {
              const file = await handle.getFile()
              console.log('file', file)
            }
          }).catch(console.error)
        }
      }
    }

    dom.addEventListener('dragover', handleDragOver)
    dom.addEventListener('drop', handleDrop)

    return () => {
      dom.removeEventListener('dragover', handleDragOver)
      dom.removeEventListener('drop', handleDrop)
    }
  }, [editor])

  return (
    <div
      ref={wrapperRef}
      className={`codeMirror-wrapper flex-1 ${
        !isEditOnLeft ? 'order-1 border-l' : 'border-r'
      }`}
      style={{ overflowX: 'auto', height: '100%' }}
    >
      <ContextMenu>
        <ContextMenuTrigger className="block h-full min-h-full">
          <textarea
            ref={textareaRef}
            id="editor"
            placeholder="Your markdown text here."
            className="hidden"
          />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onClick={() => toggleShowUploadImgDialog()}>
            上传图片
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => toggleShowInsertFormDialog()}>
            插入表格
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => resetStyleConfirm()}>
            恢复默认样式
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => importDefaultContent()}>
            导入默认文档
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset onClick={() => importMarkdownContent()}>
            导入 .md 文档
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => exportEditorContent2MD()}>
            导出 .md 文档
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => exportEditorContent2HTML()}>
            导出 .html
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => formatContent()}>
            格式化
            <ContextMenuShortcut>
              {altSign} + {shiftSign} + F
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <UploadImgDialog onUploadImage={uploadImage} />
    </div>
  )
}
