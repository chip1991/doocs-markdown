# Tasks

- [x] Task 1: 恢复 WXT 浏览器扩展架构
  - [x] SubTask 1.1: 在 `doocs-md-new` 中配置 `wxt.config.ts`，设置扩展的清单权限（Storage，跨域图床访问等）。
  - [x] SubTask 1.2: 迁移旧版 `entrypoints/` 目录下的 `background.ts` 和 `popup/` 逻辑。

- [x] Task 2: 补全全局侧边栏面板
  - [x] SubTask 2.1: 重构 `PostSlider.tsx`（左侧文章列表管理），对接 Zustand 中的 `posts` 状态。
  - [x] SubTask 2.2: 重构 `RightSlider.tsx`（右侧高级设置）。
  - [x] SubTask 2.3: 在 `App.tsx` 中正确挂载并处理抽屉/侧边栏组件的显示隐藏动画逻辑。

- [x] Task 3: 还原深度样式定制菜单
  - [x] SubTask 3.1: 封装并挂载 `StyleDropdown.tsx`（字体、字号、主题切换下拉菜单）。
  - [x] SubTask 3.2: 补充颜色拾取器功能（可替换为 React 生态颜色选择器如 `react-color` 或原生 `input type="color"`）。

- [x] Task 4: 补全所有缺失的 Dialog 弹窗
  - [x] SubTask 4.1: 实现 `UploadImgDialog.tsx`，处理图片上传和自定义图床配置。
  - [x] SubTask 4.2: 实现 `InsertFormDialog.tsx`，生成并插入 Markdown 表格。
  - [x] SubTask 4.3: 实现 `AlertDialog.tsx`，处理恢复默认样式等二次确认拦截逻辑。
  - [x] SubTask 4.4: 实现 `AboutDialog.tsx` 等其他辅助性弹窗，并在 `App.tsx` 中统一挂载。

- [x] Task 5: 恢复编辑器的高级拖拽交互逻辑
  - [x] SubTask 5.1: 迁移 `mdLocalToRemote()` 核心算法逻辑到新版 `utils`。
  - [x] SubTask 5.2: 在 `<CodemirrorEditor />` 的拖拽事件中，集成文件夹读取（`DataTransferItem.webkitGetAsEntry()`）及图片批量直传逻辑。

- [x] Task 6: 补充 UI 交互细节与快捷键优化
  - [x] SubTask 6.1: 添加全屏 Loading 遮罩提示（复制/生成 HTML 时）。
  - [x] SubTask 6.2: 恢复预览区右下角的 `<BackTop />` 回到顶部按钮。
  - [x] SubTask 6.3: 统一快捷键拦截逻辑，避免 `EditorHeader` 和 CodeMirror 内部的快捷键事件冲突。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 1]
