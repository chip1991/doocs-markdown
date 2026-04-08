import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores'
import CodeMirror from 'codemirror'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function CustomUploadForm() {
  const { formCustomConfig, setFormCustomConfig, isDark } = useAppStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editorRef = useRef<CodeMirror.EditorFromTextArea | null>(null)

  useEffect(() => {
    if (textareaRef.current && !editorRef.current) {
      editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
        mode: 'javascript',
        theme: isDark ? 'darcula' : 'xq-light',
        lineNumbers: true,
      })
      editorRef.current.setValue(formCustomConfig)
      
      editorRef.current.on('change', () => {
        // we can keep it uncontrolled and save only on button click
      })
    }
    
    return () => {
      // cleanup if needed
    }
  }, [isDark])

  const handleSave = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      setFormCustomConfig(code)
      toast.success('保存成功')
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-60 border">
        <textarea
          ref={textareaRef}
          placeholder="Your custom code here."
          defaultValue={formCustomConfig}
        />
      </div>
      <Button
        variant="link"
        className="p-0"
        asChild
      >
        <a href="https://github.com/doocs/md#自定义上传逻辑" target="_blank" rel="noreferrer">
          参数详情
        </a>
      </Button>
      <Button className="block w-full" onClick={handleSave}>
        保存配置
      </Button>
    </div>
  )
}
