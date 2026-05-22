import { useRef } from 'react'
import { useStore } from '@/stores'
import { useSyncScroll } from '@/hooks/useSyncScroll'

import { BackTop } from '@/components/ui/back-top'

export function PreviewArea() {
  const { output, editor } = useStore()
  const previewRef = useRef<HTMLDivElement>(null)

  // Use custom hook for bidirectional scroll sync
  useSyncScroll(previewRef, editor)

  // Note: old code uses v-html="output" on section#output.
  return (
    <div
      id="preview"
      ref={previewRef}
      className="preview-wrapper flex-1 overflow-y-auto h-full"
    >
      <div id="output-wrapper">
        <div className="preview border-x shadow-xl">
          <section
            id="output"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </div>
      <BackTop target="preview" right={40} bottom={40} />
    </div>
  )
}
