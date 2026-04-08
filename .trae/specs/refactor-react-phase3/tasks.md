# Tasks

- [x] Task 1: 修复编辑器主题与增强插件
  - [x] SubTask 1.1: 将原项目中的 `xq-light.css` 迁移并引入到 `CodemirrorEditor.tsx` 或全局样式中。
  - [x] SubTask 1.2: 在 `CodemirrorEditor.tsx` 初始化时，引入并注册 `matchbrackets`, `closebrackets`, `show-hint` 以及常用的 `javascript` 等语法插件。

- [x] Task 2: 补全图床配置与弹窗交互
  - [x] SubTask 2.1: 重构 `UploadImgDialog.tsx`，增加拖拽/点击上传区域（复刻 `<UploadCloud>` 交互）。
  - [x] SubTask 2.2: 在状态库和 UI 中补齐缺失的四种图床（七牛云、MinIO、微信公众号、Cloudflare R2）及其配置表单。
  - [x] SubTask 2.3: 迁移并挂载 `CustomUploadForm.tsx`，支持自定义代码上传图床。

- [x] Task 3: 规范化图床状态管理
  - [x] SubTask 3.1: 移除 `UploadImgDialog.tsx` 中直接操作 `localStorage` 的反模式代码。
  - [x] SubTask 3.2: 在 `useAppStore` (Zustand) 中新增并接管所有图床配置状态，确保数据能被统一持久化。

- [x] Task 4: 开发向后兼容数据迁移脚本 (Migration Hook)
  - [x] SubTask 4.1: 编写 `useMigration.ts` 或在 store 初始化逻辑中添加检测代码。
  - [x] SubTask 4.2: 读取并解析以 `doocs-md-` 为前缀的旧版 localStorage 数据。
  - [x] SubTask 4.3: 将解析后的旧数据合并覆盖到新的 Zustand `doocs-md-storage` 中，并在迁移完成后清理旧键以避免重复迁移。

# Task Dependencies
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
