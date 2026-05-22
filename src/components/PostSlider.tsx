import { useState } from 'react'
import { useAppStore, useStore } from '@/stores'
import { Plus, MoreVertical, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export function PostSlider() {
  const {
    posts,
    currentPostIndex,
    setCurrentPostIndex,
    addPost,
    renamePost,
    delPost,
    isOpenPostSlider,
    setIsOpenPostSlider,
  } = useAppStore()

  const { editor, editorRefresh } = useStore()

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  if (!isOpenPostSlider) return null

  const handleSelectPost = (index: number) => {
    // Before switching, save current editor content to the current post
    if (editor && currentPostIndex !== index) {
      const newPosts = [...posts]
      newPosts[currentPostIndex].content = editor.getValue()
      useAppStore.setState({ posts: newPosts })
    }
    setCurrentPostIndex(index)
    // The editor component needs to react to this change and load the new content.
    // However, CodemirrorEditor.tsx should ideally watch currentPostIndex or we do it here:
    if (editor && currentPostIndex !== index) {
      editor.setValue(posts[index].content)
      editorRefresh()
    }
  }

  const handleAddPost = () => {
    // save current content first
    if (editor) {
      const newPosts = [...posts]
      newPosts[currentPostIndex].content = editor.getValue()
      useAppStore.setState({ posts: newPosts })
    }
    const title = `新文档 ${posts.length + 1}`
    addPost(title)
    if (editor) {
      editor.setValue(`# ${title}`)
      editorRefresh()
    }
  }

  const startRename = (index: number) => {
    setEditingIndex(index)
    setEditTitle(posts[index].title)
  }

  const handleRename = () => {
    if (editingIndex !== null && editTitle.trim()) {
      renamePost(editingIndex, editTitle.trim())
    }
    setEditingIndex(null)
  }

  const handleDelete = () => {
    if (deleteIndex !== null) {
      if (posts.length <= 1) {
        toast.error('至少保留一个文档')
        setDeleteIndex(null)
        return
      }
      delPost(deleteIndex)
      
      // if we deleted the current post, the store adjusts currentPostIndex
      // we need to update the editor content
      if (editor) {
        const newIndex = useAppStore.getState().currentPostIndex
        editor.setValue(useAppStore.getState().posts[newIndex].content)
        editorRefresh()
      }
    }
    setDeleteIndex(null)
  }

  return (
    <div className="w-64 h-full border-r bg-white dark:bg-[#191c20] flex flex-col z-10 shrink-0">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">我的内容</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAddPost} title="新增内容">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpenPostSlider(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {posts.map((post, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer group ${
              index === currentPostIndex
                ? 'bg-gray-100 dark:bg-stone-800 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-stone-800/50'
            }`}
            onClick={() => handleSelectPost(index)}
          >
            {editingIndex === index ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
                className="h-7 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="truncate text-sm flex-1">{post.title}</span>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 ${
                    index === currentPostIndex ? 'opacity-100' : ''
                  }`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={(e) => {
                  e.stopPropagation()
                  startRename(index)
                }}>
                  <Pencil className="h-4 w-4 mr-2" /> 重命名
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onSelect={(e) => {
                    e.stopPropagation()
                    setDeleteIndex(index)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> 删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该文档吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。删除后将无法恢复此文档的内容。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
