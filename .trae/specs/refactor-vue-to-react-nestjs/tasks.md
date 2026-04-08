# Tasks

- [ ] Task 1: 工程初始化与 Monorepo 搭建
  - [ ] SubTask 1.1: 创建 Turborepo 项目结构，包含 `apps/web` (React + Vite) 和 `apps/api` (NestJS)。
  - [ ] SubTask 1.2: 建立 `packages/shared` 用于前后端共用类型（接口、配置参数等）。
  - [ ] SubTask 1.3: 为 `apps/web` 配置 Tailwind CSS 和基本的 shadcn-ui 环境。

- [ ] Task 2: 后端基础设施与核心 API (NestJS)
  - [ ] SubTask 2.1: 配置 Prisma 与 PostgreSQL 数据库连接。
  - [ ] SubTask 2.2: 实现基础的用户表、草稿表、配置表数据模型。
  - [ ] SubTask 2.3: 开发图床上传接口（或 STS 临时凭证接口）替换原有纯前端直传。
  - [ ] SubTask 2.4: 开发文档和配置的云端存取 RESTful API。

- [ ] Task 3: 前端核心渲染引擎迁移 (React)
  - [ ] SubTask 3.1: 将原项目 `src/utils/renderer.ts` 迁移到 `apps/web`，并替换 `marked` 和相关插件的依赖。
  - [ ] SubTask 3.2: 引入 Zustand/Jotai 初始化全局配置状态（主题、字体、CSS）。
  - [ ] SubTask 3.3: 封装 React Hook 用于监听状态变化并触发 Markdown 转 HTML 内联样式的逻辑。

- [ ] Task 4: 前端编辑器与视图构建 (React)
  - [ ] SubTask 4.1: 引入 CodeMirror 6，开发 Markdown 编辑区组件（支持双向绑定、快捷键防抖）。
  - [ ] SubTask 4.2: 开发 HTML 实时预览区组件，完成基于百分比高度的左右滚动同步功能。
  - [ ] SubTask 4.3: 开发右侧的自定义 CSS 编辑区组件（CodeMirror 6）。
  - [ ] SubTask 4.4: 组合主视图组件，实现经典三栏布局。

- [ ] Task 5: 前端 UI 组件与业务功能 (React)
  - [ ] SubTask 5.1: 使用 shadcn-ui 还原顶部工具栏（复制到微信、导出、帮助等）。
  - [ ] SubTask 5.2: 开发侧边栏多文档草稿管理界面。
  - [ ] SubTask 5.3: 实现图片粘贴/拖拽上传的前端交互，并对接后端的图床/STS 接口。

- [ ] Task 6: 联调与测试验证
  - [ ] SubTask 6.1: 验证 Markdown 到带内联样式的 HTML 转换的准确性。
  - [ ] SubTask 6.2: 验证云端数据存取和本地草稿同步功能。
  - [ ] SubTask 6.3: 执行端到端图片上传与展示流程测试。

# Task Dependencies
- Task 3 depends on Task 1
- Task 4 depends on Task 3
- Task 5 depends on Task 4
- Task 2 depends on Task 1
- Task 6 depends on Task 2, Task 5