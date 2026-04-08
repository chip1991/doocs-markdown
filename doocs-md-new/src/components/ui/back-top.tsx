import { useEffect, useState, useRef } from 'react'
import { throttle } from 'es-toolkit'
import { ArrowUpFromLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Target = HTMLElement | Window | null

interface BackTopProps {
  left?: number
  top?: number
  right?: number
  bottom?: number
  visibilityHeight?: number
  target?: string
  onClick?: (e: React.MouseEvent) => void
}

export function BackTop({
  left,
  top,
  right,
  bottom,
  visibilityHeight = 400,
  target: targetId,
  onClick,
}: BackTopProps) {
  const [visible, setVisible] = useState(false)
  const targetRef = useRef<Target>(null)

  const scrollToTop = (e: React.MouseEvent) => {
    targetRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    onClick?.(e)
  }

  useEffect(() => {
    const handleScroll = throttle((el: Target) => {
      if (el instanceof HTMLElement) {
        setVisible(el.scrollTop > visibilityHeight)
      } else {
        setVisible(window.scrollY > visibilityHeight)
      }
    }, 200, { edges: ['leading', 'trailing'] })

    let el: Target = window
    if (targetId) {
      el = document.getElementById(targetId)
    }
    targetRef.current = el

    const onScroll = () => handleScroll(targetRef.current)

    if (el) {
      el.addEventListener('scroll', onScroll)
    }

    return () => {
      if (el) {
        el.removeEventListener('scroll', onScroll)
      }
    }
  }, [targetId, visibilityHeight])

  if (!visible) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed z-50 rounded-full"
      style={{
        left: left !== undefined ? `${left}px` : undefined,
        top: top !== undefined ? `${top}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        bottom: bottom !== undefined ? `${bottom}px` : undefined,
      }}
      onClick={scrollToTop}
    >
      <ArrowUpFromLine className="h-4 w-4" />
    </Button>
  )
}
