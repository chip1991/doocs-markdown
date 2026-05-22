import { useState, useEffect } from 'react'
import { useStore, useDisplayStore } from '@/stores'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function InsertFormDialog() {
  const { isShowInsertFormDialog, toggleShowInsertFormDialog } = useDisplayStore()
  const { editor } = useStore()
  
  const [rowNum, setRowNum] = useState(3)
  const [colNum, setColNum] = useState(3)
  const [tableData, setTableData] = useState<string[][]>([])

  useEffect(() => {
    if (isShowInsertFormDialog) {
      setRowNum(3)
      setColNum(3)
      setTableData(Array.from({ length: 4 }, () => Array(3).fill('')))
    }
  }, [isShowInsertFormDialog])

  const updateTableData = (newRow: number, newCol: number) => {
    setTableData(prev => {
      return Array.from({ length: newRow + 1 }, (_, i) => {
        return Array.from({ length: newCol }, (_, j) => {
          return prev[i]?.[j] || ''
        })
      })
    })
  }

  const handleRowChange = (val: number) => {
    const newVal = Math.max(1, Math.min(100, val))
    setRowNum(newVal)
    updateTableData(newVal, colNum)
  }

  const handleColChange = (val: number) => {
    const newVal = Math.max(1, Math.min(100, val))
    setColNum(newVal)
    updateTableData(rowNum, newVal)
  }

  const handleCellChange = (i: number, j: number, val: string) => {
    setTableData(prev => {
      const newData = [...prev]
      newData[i] = [...newData[i]]
      newData[i][j] = val
      return newData
    })
  }

  const handleInsert = () => {
    if (!editor) return

    let tableStr = '\n'
    
    tableStr += '| ' + tableData[0].map(c => c || '列名').join(' | ') + ' |\n'
    tableStr += '| ' + tableData[0].map(() => '---').join(' | ') + ' |\n'
    for (let i = 1; i < tableData.length; i++) {
      tableStr += '| ' + tableData[i].map(c => c || '内容').join(' | ') + ' |\n'
    }

    const cm = editor as any
    const cursor = cm.getCursor()
    cm.replaceRange(tableStr, cursor)
    cm.focus()
    
    toggleShowInsertFormDialog()
  }

  return (
    <Dialog open={isShowInsertFormDialog} onOpenChange={toggleShowInsertFormDialog}>
      <DialogContent className="sm:max-w-fit min-w-[400px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>插入表格</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-right whitespace-nowrap">行数 (数据)</span>
              <Input
                type="number"
                value={rowNum}
                onChange={(e) => handleRowChange(Number(e.target.value))}
                className="w-24"
                min={1}
                max={100}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-right whitespace-nowrap">列数</span>
              <Input
                type="number"
                value={colNum}
                onChange={(e) => handleColChange(Number(e.target.value))}
                className="w-24"
                min={1}
                max={100}
              />
            </div>
          </div>
          
          <div className="overflow-auto max-h-[50vh] mt-2 border rounded-md">
            <table className="w-full border-collapse">
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border p-1">
                        <Input
                          value={cell}
                          onChange={(e) => handleCellChange(i, j, e.target.value)}
                          placeholder={i === 0 ? `列名 ${j + 1}` : `内容`}
                          className="h-8 min-w-[100px] border-0 focus-visible:ring-1"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DialogFooter>
     <Button type="button" variant="outline" onClick={() => toggleShowInsertFormDialog(false)}>
                取消
              </Button>
          <Button onClick={handleInsert}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
