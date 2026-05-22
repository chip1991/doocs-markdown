import { useStore } from '@/stores'
import {
  AlertDialog as AlertDialogWrapper,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function AlertDialog() {
  const { isOpenConfirmDialog, setIsOpenConfirmDialog, resetStyle } = useStore()

  const handleConfirm = () => {
    resetStyle()
    setIsOpenConfirmDialog(false)
  }

  return (
    <AlertDialogWrapper open={isOpenConfirmDialog} onOpenChange={setIsOpenConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>提示</AlertDialogTitle>
          <AlertDialogDescription>此操作将丢失您的自定义样式，是否继续？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>确认</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogWrapper>
  )
}
