import { useEffect, useState, useMemo } from 'react'
import type { Post, PostAccount } from '@/types'
import { useStore } from '@/stores'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { PostTaskDialog } from './PostTaskDialog'

export function PostInfo() {
  const { output, editor } = useStore()

  const [dialogVisible, setDialogVisible] = useState(false)
  const [extensionInstalled, setExtensionInstalled] = useState(false)
  const [allAccounts, setAllAccounts] = useState<PostAccount[]>([])
  const [postTaskDialogVisible, setPostTaskDialogVisible] = useState(false)

  const [form, setForm] = useState<Post>({
    title: '',
    desc: '',
    thumb: '',
    content: '',
    markdown: '',
    accounts: [] as PostAccount[],
  })

  const allowPost = useMemo(() => {
    return extensionInstalled && form.accounts.some((a) => a.checked)
  }, [extensionInstalled, form.accounts])

  const fetchAccounts = async () => {
    return new Promise<void>((resolve) => {
      if (typeof window !== 'undefined' && (window as any).$syncer) {
        (window as any).$syncer.getAccounts((resp: PostAccount[]) => {
          setAllAccounts(resp.map((a) => ({ ...a, checked: true })))
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  const checkExtension = () => {
    if (typeof window !== 'undefined' && (window as any).$syncer !== undefined) {
      setExtensionInstalled(true)
      return
    }

    let count = 0
    const timer = setInterval(async () => {
      if (typeof window !== 'undefined' && (window as any).$syncer !== undefined) {
        setExtensionInstalled(true)
        await fetchAccounts()
        clearInterval(timer)
        return
      }

      count++
      if (count > 10) {
        clearInterval(timer)
      }
    }, 500)
  }

  useEffect(() => {
    checkExtension()
  }, [])

  const prePost = async () => {
    let currentAccounts = allAccounts
    if (extensionInstalled && currentAccounts.length === 0) {
      const resp = await new Promise<PostAccount[]>((resolve) => {
        if (typeof window !== 'undefined' && (window as any).$syncer) {
          (window as any).$syncer.getAccounts((accountsResp: PostAccount[]) => {
            resolve(accountsResp.map((a) => ({ ...a, checked: true })))
          })
        } else {
          resolve([])
        }
      })
      currentAccounts = resp
      setAllAccounts(resp)
    }

    let auto: Post = {
      thumb: '',
      title: '',
      desc: '',
      content: '',
      markdown: '',
      accounts: [],
    }
    const accounts = currentAccounts.filter((a) => !['weixin', 'ipfs'].includes(a.type))
    try {
      const outputDiv = document.querySelector('#output')
      const img = outputDiv?.querySelector<HTMLImageElement>('img')
      
      let titleElement = null
      for (let i = 1; i <= 6; i++) {
        const h = outputDiv?.querySelector(`h${i}`)
        if (h) {
          titleElement = h
          break
        }
      }
      
      const p = outputDiv?.querySelector('p')

      auto = {
        thumb: img?.src ?? '',
        title: titleElement?.textContent ?? '',
        desc: p?.textContent ?? '',
        content: output,
        markdown: (editor as any)?.getValue() ?? '',
        accounts,
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setForm((prev) => ({
        ...prev,
        ...auto,
      }))
    }
  }

  const post = () => {
    setForm((prev) => ({
      ...prev,
      accounts: prev.accounts.filter((a) => a.checked),
    }))
    setPostTaskDialogVisible(true)
    setDialogVisible(false)
  }

  const handleAccountCheck = (uid: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      accounts: prev.accounts.map((a) => (a.uid === uid ? { ...a, checked } : a)),
    }))
  }

  return (
    <>
      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={prePost}>
            发布
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>发布</DialogTitle>
          </DialogHeader>

          <div className="bg-blue-50 text-blue-900 border border-blue-200 rounded-md p-4 flex gap-3 text-sm">
            <Info className="h-5 w-5 shrink-0 text-blue-600" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold">提示</span>
              <span>此功能由第三方浏览器插件支持，本平台不保证安全性及同步准确度。</span>
            </div>
          </div>

          {!extensionInstalled && (
            <div className="bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-md p-4 flex gap-3 text-sm mt-2">
              <Info className="h-5 w-5 shrink-0 text-yellow-600" />
              <div className="flex flex-col gap-1">
                <span className="font-semibold">未检测到插件</span>
                <span>
                  请安装{' '}
                  <a
                    className="text-blue-600 hover:underline"
                    href="https://www.wechatsync.com/?utm_source=syncicon#install"
                    target="_blank"
                    rel="noreferrer"
                  >
                    文章同步助手
                  </a>{' '}
                  插件
                </span>
              </div>
            </div>
          )}

          <div className="w-full flex items-center gap-4 mt-4">
            <Label htmlFor="thumb" className="w-10 text-end">
              封面
            </Label>
            <Input
              id="thumb"
              value={form.thumb}
              onChange={(e) => setForm({ ...form, thumb: e.target.value })}
              placeholder="自动提取第一张图"
            />
          </div>
          <div className="w-full flex items-center gap-4">
            <Label htmlFor="title" className="w-10 text-end">
              标题
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="自动提取第一个标题"
            />
          </div>
          <div className="w-full flex items-start gap-4">
            <Label htmlFor="desc" className="w-10 text-end mt-2">
              描述
            </Label>
            <Textarea
              id="desc"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="自动提取第一个段落"
            />
          </div>

          <div className="w-full flex items-start gap-4">
            <Label className="w-10 text-end mt-2">账号</Label>
            <div className="flex flex-1 flex-col gap-2 max-h-[200px] overflow-y-auto">
              {form.accounts.map((account) => (
                <div key={account.uid + account.displayName} className="flex items-center gap-2">
                  <label className="flex flex-row items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={account.checked}
                      onChange={(e) => handleAccountCheck(account.uid, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="flex items-center gap-2 text-sm">
                      {account.icon && (
                        <img src={account.icon} alt="" className="inline-block h-[20px] w-[20px]" />
                      )}
                      {account.title} - {account.displayName ?? account.home}
                    </span>
                  </label>
                </div>
              ))}
              {form.accounts.length === 0 && extensionInstalled && (
                <div className="text-sm text-gray-500 mt-2">暂无可用账号，请在插件中配置</div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogVisible(false)}>
              取 消
            </Button>
            <Button disabled={!allowPost} onClick={post}>
              确 定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PostTaskDialog
        open={postTaskDialogVisible}
        onOpenChange={setPostTaskDialogVisible}
        post={form}
      />
    </>
  )
}
