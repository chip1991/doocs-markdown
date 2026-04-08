# Checklist

- [ ] 初始化 Monorepo，成功构建了 `apps/web` (React 18+) 和 `apps/api` (NestJS)。
- [ ] 前后端共用的类型包 `packages/shared` 已被成功引用。
- [ ] `apps/web` 成功集成了 Tailwind CSS 和 shadcn-ui，并配置了基本的入口。
- [ ] NestJS 成功连接 PostgreSQL 数据库并初始化 Prisma 模型。
- [ ] 后端提供了图片上传/STS 接口。
- [ ] 核心 Markdown 到 HTML 的渲染引擎成功迁移至 React 项目，能够解析内联 CSS。
- [ ] CodeMirror 6 编辑区能正常输入 Markdown 和自定义 CSS。
- [ ] 编辑区与预览区的双向滚动同步功能工作正常。
- [ ] 在编辑器中粘贴或拖拽图片时，可以通过后端接口成功上传。
- [ ] 顶部工具栏实现了复制带内联样式的 HTML 到剪贴板的功能，格式符合微信公众号规范。
- [ ] 左侧或右侧的侧边栏功能正常，支持多篇草稿的创建与管理。
- [ ] 前端能通过 Zustand/Jotai 等状态管理工具同步主题、字体配置。