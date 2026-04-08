# Refactor doocs-md-old to React Phase 3 Spec

## Why
经过前两轮的重构，`doocs-md-new` 已经实现了核心编辑、状态管理、WXT 扩展打包以及绝大部分的侧边栏与弹窗交互。但是，在深入的代码审查中发现，UI 细节、多图床支持、本地存储的向后兼容性以及 CodeMirror 的部分核心插件和主题存在缺失或退化。为了达到真正 100% 的生产级替换标准，需要开启第三轮（Phase 3）修复与打磨。

## What Changes
- 重构 `UploadImgDialog.tsx`，恢复原有的拖拽/点击上传 UI，补全被删减的四种图床（七牛云、MinIO、公众号图床、Cloudflare R2），并统一接入 Zustand 状态管理。
- 修复编辑器在浅色模式下的代码高亮失效问题，引入缺失的 `xq-light.css`。
- 恢复 CodeMirror 的增强插件支持（如 `matchbrackets`, `closebrackets` 等），提升输入体验。
- 增加向后兼容脚本（Migration Hook），以确保老版本 Vue 用户在升级到新版 React 时，原有分散在 `localStorage` 的配置项能够平滑迁移至 Zustand 的 `doocs-md-storage` 中。
- 补齐并挂载 `CustomUploadForm.tsx`（自定义代码上传图床功能）。

## Impact
- Affected specs: 图床配置系统、CodeMirror 基础配置、应用初始化数据加载逻辑。
- Affected code: `UploadImgDialog.tsx`, `CodemirrorEditor.tsx`, `main.tsx`, `stores/index.ts` 以及相关新增组件。

## ADDED Requirements
### Requirement: 数据无损迁移能力
系统必须在用户首次使用 React 版本时，自动检测并读取旧版 Vue 生成的独立 `localStorage` 键值（如 `doocs-md-theme`），并将其合并到新的 Zustand 状态结构中。

#### Scenario: Success case
- **WHEN** 老用户首次打开新版编辑器
- **THEN** 旧的草稿文章、主题偏好、图床配置均不丢失，并被成功转换和保存为新版结构。

## MODIFIED Requirements
### Requirement: 多图床全覆盖与交互还原
图床弹窗除了配置参数，还必须提供一个可视化的拖拽区域供用户直接上传单张图片，且必须包含旧版的全部 8 种图床服务。

## REMOVED Requirements
### Requirement: 无
**Reason**: 本阶段主要为查漏补缺和功能强化。
