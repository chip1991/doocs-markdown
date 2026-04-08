import { useAppStore } from '@/stores'
import { fontChanged, sizeChanged, colorChanged } from '@/stores'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fontFamilyOptions, fontSizeOptions, colorOptions } from '@/config'

export function StyleDropdown() {
  const { fontFamily, fontSize, primaryColor } = useAppStore()

  return (
    <div className="flex items-center space-x-2 mx-2">
      <Select value={fontFamily} onValueChange={fontChanged}>
        <SelectTrigger className="w-[120px] h-8 text-xs shadow-none">
          <SelectValue placeholder="字体" />
        </SelectTrigger>
        <SelectContent>
          {fontFamilyOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={fontSize} onValueChange={sizeChanged}>
        <SelectTrigger className="w-[80px] h-8 text-xs shadow-none">
          <SelectValue placeholder="字号" />
        </SelectTrigger>
        <SelectContent>
          {fontSizeOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-1">
        <Select 
          value={colorOptions.some(opt => opt.value === primaryColor) ? primaryColor : 'custom'} 
          onValueChange={(val) => {
            if (val !== 'custom') colorChanged(val)
          }}
        >
          <SelectTrigger className="w-[80px] h-8 text-xs shadow-none">
            <SelectValue placeholder="颜色" />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: opt.value }}
                  />
                  {opt.label}
                </div>
              </SelectItem>
            ))}
            {!colorOptions.some(opt => opt.value === primaryColor) && (
              <SelectItem value="custom" className="text-xs">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: primaryColor }}
                  />
                  自定义
                </div>
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <div 
          className="w-7 h-7 rounded overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 relative cursor-pointer"
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
  )
}
