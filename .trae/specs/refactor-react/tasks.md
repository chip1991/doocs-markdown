# Tasks

- [x] Task 1: 初始化基础架构项目
  - [x] SubTask 1.1: 在 `/workspace/doocs-md-new` 目录下使用 Vite 创建 React + TS 项目。
  - [x] SubTask 1.2: 安装并配置 Tailwind CSS 基础环境。
  - [x] SubTask 1.3: 配置路径别名（如 `@/` 映射到 `src/`）以便于模块引入。

- [x] Task 2: 迁移纯逻辑与核心工具函数
  - [x] SubTask 2.1: 将原项目 `doocs-md-old/src/utils` 目录完整迁移至新项目。
  - [x] SubTask 2.2: 将原项目 `doocs-md-old/src/config` 和 `src/types` 迁移至新项目。
  - [x] SubTask 2.3: 验证核心的 `renderer.ts` 及其依赖项 (marked, highlight.js 等) 的安装与编译。

- [x] Task 3: 重构状态管理层 (Zustand)
  - [x] SubTask 3.1: 创建 `src/store/useEditorStore.ts`，实现编辑器内容、配置的持久化存储。
  - [x] SubTask 3.2: 创建 `src/store/useUIStore.ts`，用于管理弹窗、侧边栏等临时 UI 状态。

- [x] Task 4: 搭建基础 UI 组件 (shadcn-ui)
  - [x] SubTask 4.1: 初始化 shadcn-ui，并集成至当前项目中。
  - [x] SubTask 4.2: 按需引入核心基础组件（Button, Dialog, Select, Tabs, Tooltip, DropdownMenu 等）。
  - [x] SubTask 4.3: 替换旧项目的图标库为 `lucide-react`。

- [x] Task 5: 重构核心编辑器组件
  - [x] SubTask 5.1: 封装 `<CodeMirrorEditor />` React 组件，集成 CodeMirror 5 及其相关插件和主题。
  - [x] SubTask 5.2: 将旧版的快捷键事件、粘贴上传图片等逻辑迁移至 React 的 `useEffect` 中。

- [x] Task 6: 重构预览区域与双向同步滚动
  - [x] SubTask 6.1: 封装 `<PreviewArea />` 组件，接收并渲染经过处理的 HTML。
  - [x] SubTask 6.2: 编写 `useSyncScroll` 自定义 Hook，绑定编辑器与预览区的滚动事件，实现精准同步滚动。

- [x] Task 7: 组装全局布局与业务功能
  - [x] SubTask 7.1: 重构顶部工具栏 `<EditorHeader />`（包含主题切换、格式化、复制、导出等功能）。
  - [x] SubTask 7.2: 重构 CSS 编辑器 `<CssEditor />` 面板。
  - [x] SubTask 7.3: 在 `App.tsx` 中整合所有组件，完成页面的最终布局拼装。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2], [Task 3]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 4], [Task 5], [Task 6]
