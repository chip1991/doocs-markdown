import { useAppStore, useDisplayStore, useStore, themeChanged, fontChanged, sizeChanged, colorChanged, codeBlockThemeChanged, legendChanged, macCodeBlockChanged, useIndentChanged, citeStatusChanged, countStatusChanged } from '@/stores'
import { themeOptions, fontFamilyOptions, fontSizeOptions, colorOptions, codeBlockThemeOptions, legendOptions } from '@/config'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RightSlider() {
  const {
    theme,
    fontFamily,
    fontSize,
    primaryColor,
    codeBlockTheme,
    legend,
    isMacCodeBlock,
    isUseIndent,
    isEditOnLeft,
    isCiteStatus,
    isCountStatus,
    isOpenRightSlider,
    setIsOpenRightSlider,
    toggleEditOnLeft,
  } = useAppStore()

  const { resetStyleConfirm } = useStore()
  const { isShowCssEditor, toggleShowCssEditor } = useDisplayStore()

  if (!isOpenRightSlider) return null

  return (
    <div className="w-80 h-full border-l bg-white dark:bg-[#1e1e1e] flex flex-col z-10 shrink-0">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">基础设置</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpenRightSlider(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-3">
          <Label>主题选择</Label>
          <Select value={theme} onValueChange={(val) => themeChanged(val as Parameters<typeof themeChanged>[0])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>字体选择</Label>
          <Select value={fontFamily} onValueChange={fontChanged}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilyOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>字体大小</Label>
          <Select value={fontSize} onValueChange={sizeChanged}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>主题颜色</Label>
          <div className="grid grid-cols-6 gap-2">
            {colorOptions.map(opt => (
              <button
                key={opt.value}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${primaryColor === opt.value ? 'border-gray-800 dark:border-gray-200' : 'border-transparent'}`}
                style={{ backgroundColor: opt.value }}
                title={opt.label}
                onClick={() => colorChanged(opt.value)}
              />
            ))}
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative overflow-hidden cursor-pointer ${!colorOptions.some(opt => opt.value === primaryColor) ? 'border-gray-800 dark:border-gray-200' : 'border-transparent'}`}
              title="自定义颜色"
            >
              <input
                type="color"
                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                value={primaryColor}
                onChange={(e) => colorChanged(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>代码主题</Label>
          <Select value={codeBlockTheme} onValueChange={codeBlockThemeChanged}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codeBlockThemeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>图注格式</Label>
          <Select value={legend} onValueChange={legendChanged}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {legendOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="edit-on-left">编辑器靠左</Label>
          <Switch id="edit-on-left" checked={isEditOnLeft} onCheckedChange={toggleEditOnLeft} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="mac-code-block">Mac 代码块</Label>
          <Switch id="mac-code-block" checked={isMacCodeBlock} onCheckedChange={macCodeBlockChanged} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="use-indent">首行缩进</Label>
          <Switch id="use-indent" checked={isUseIndent} onCheckedChange={useIndentChanged} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="cite-status">微信外链转底部引用</Label>
          <Switch id="cite-status" checked={isCiteStatus} onCheckedChange={citeStatusChanged} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="count-status">统计字数和阅读时间</Label>
          <Switch id="count-status" checked={isCountStatus} onCheckedChange={countStatusChanged} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="css-editor">自定义 CSS 面板</Label>
          <Switch id="css-editor" checked={isShowCssEditor} onCheckedChange={toggleShowCssEditor} />
        </div>

        <div className="pt-4 border-t space-y-3">
          <Label className="block mb-2">样式配置</Label>
          <Button variant="outline" className="w-full" onClick={resetStyleConfirm}>
            重置
          </Button>
        </div>
      </div>
    </div>
  )
}
