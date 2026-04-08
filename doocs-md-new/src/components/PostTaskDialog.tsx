import { useEffect, useState } from 'react'
import type { Post } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PostTaskDialogProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostTaskDialog({ post, open, onOpenChange }: PostTaskDialogProps) {
  const [taskStatus, setTaskStatus] = useState<any>(null)

  useEffect(() => {
    if (open && post) {
      setTaskStatus(null)

      try {
        if (typeof window !== 'undefined' && (window as any).$syncer) {
          (window as any).$syncer.addTask(
            {
              post: {
                title: post.title,
                content: post.content,
                markdown: post.markdown,
                thumb: post.thumb,
                desc: post.desc,
              },
              accounts: post.accounts.filter((a) => a.checked),
            },
            (newStatus: any) => {
              setTaskStatus(newStatus)
            },
            () => {
              // submitting finished
            }
          )
        } else {
          console.warn('同步助手插件未加载')
        }
      } catch (error) {
        console.error('发布失败:', error)
      }
    }
  }, [open, post])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>提交发布任务</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {!taskStatus ? (
            <div className="py-4 text-center">等待发布..</div>
          ) : (
            <div className="max-h-[400px] flex flex-col overflow-y-auto">
              {taskStatus?.accounts?.map((account: any) => (
                <div
                  key={account.uid + account.displayName}
                  className="border-b py-4 last:border-b-0"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {account.icon && (
                      <img src={account.icon} className="object-cover h-5 w-5" alt="" />
                    )}
                    <span>
                      {account.title} - {account.displayName || account.home}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'w-full flex-1 gap-2 overflow-auto pl-7 text-sm',
                      {
                        'text-yellow-600': account.status === 'uploading',
                        'text-red-600': account.status === 'failed',
                        'text-green-600': account.status === 'done',
                      }
                    )}
                  >
                    {account.status === 'uploading' && (
                      <>{account.msg || '发布中'}</>
                    )}

                    {account.status === 'failed' && (
                      <>同步失败, 错误内容：{account.error}</>
                    )}

                    {account.status === 'done' && account.editResp && (
                      <>
                        同步成功
                        {account.type !== 'wordpress' && (
                          <a
                            href={account.editResp.draftLink}
                            className="ml-2 text-blue-500 hover:underline"
                            referrerPolicy="no-referrer"
                            target="_blank"
                            rel="noreferrer"
                          >
                            查看草稿
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
