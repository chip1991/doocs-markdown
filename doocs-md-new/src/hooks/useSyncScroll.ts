import { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'

export function useSyncScroll(
  previewRef: React.RefObject<HTMLElement | null>,
  editor: CodeMirror.Editor | null
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!previewRef.current || !editor) return

    const previewEl = previewRef.current

    const scrollCB = (sourceType: 'preview' | 'editor') => {
      let source: HTMLElement
      let target: HTMLElement

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      if (sourceType === 'preview') {
        source = previewEl
        target = document.querySelector<HTMLElement>('.CodeMirror-scroll')!

        editor.off('scroll', editorScrollCB)
        timeoutRef.current = setTimeout(() => {
          editor.on('scroll', editorScrollCB)
        }, 300)
      } else {
        source = document.querySelector<HTMLElement>('.CodeMirror-scroll')!
        target = previewEl

        target.removeEventListener('scroll', previewScrollCB, false)
        timeoutRef.current = setTimeout(() => {
          target.addEventListener('scroll', previewScrollCB, false)
        }, 300)
      }

      if (!source || !target) return

      // Handle divide by zero if no scrollable area
      if (source.scrollHeight - source.offsetHeight <= 0) return

      const percentage = source.scrollTop / (source.scrollHeight - source.offsetHeight)
      const height = percentage * (target.scrollHeight - target.offsetHeight)

      target.scrollTo(0, height)
    }

    function editorScrollCB() {
      scrollCB('editor')
    }

    function previewScrollCB() {
      scrollCB('preview')
    }

    // Give it a tiny delay to ensure DOM is fully rendered before attaching
    const initTimer = setTimeout(() => {
      previewEl.addEventListener('scroll', previewScrollCB, false)
      editor.on('scroll', editorScrollCB)
    }, 300)

    return () => {
      clearTimeout(initTimer)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      previewEl.removeEventListener('scroll', previewScrollCB, false)
      editor.off('scroll', editorScrollCB)
    }
  }, [previewRef, editor])
}
