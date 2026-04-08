# Refactor doocs-md-old to React Spec

## Why
原项目基于 Vue 3 体系构建。为了更好地利用 React 生态体系，降低后续维护成本，并且统一技术栈为 React 18+、TypeScript 和 Tailwind CSS，需要将现有的 Markdown 编辑器重构到一个全新的目录 `doocs-md-new` 中。通过重构，系统能更加轻量地进行状态管理（采用 Zustand）和 UI 构建（采用 shadcn-ui）。

## What Changes
- 在工作区新建 `doocs-md-new` 目录，并初始化为 Vite + React + TS 项目。
- 移除 Vue 3、Pinia、UnoCSS 等依赖，替换为 React 18+、Zustand、Tailwind CSS v3/v4。
- 将原本基于 `shadcn-vue` 和 `radix-vue` 的 UI 体系替换为 `shadcn-ui` (React) 体系。
- 保持底层的核心 Markdown 解析与图床处理逻辑不变（纯 TS/JS 逻辑直接迁移）。
- 将 CodeMirror 5 编辑器及双向同步滚动逻辑重构为 React Hooks 和组件。

## Impact
- Affected specs: 整个前端应用的视图渲染、状态持久化和组件交互逻辑将被彻底替换。
- Affected code: 所有的 `.vue` 文件将被重写为 `.tsx`，状态管理的 `stores` 目录将被重写。

## ADDED Requirements
### Requirement: 新增 React 基础设施
系统应当基于 Vite + React 18+ 模板运行，并且通过 Zustand 替代原有的 Pinia 完成持久化数据存储。

#### Scenario: Success case
- **WHEN** 用户启动开发服务器并访问页面
- **THEN** 页面正常渲染，且能够读取并持久化本地存储的编辑器配置。

## MODIFIED Requirements
### Requirement: 核心编辑器体验还原
编辑器必须保留 CodeMirror 5 的核心功能（代码高亮、快捷键等），并与 Markdown 预览区域实现精准的双向同步滚动。

## REMOVED Requirements
### Requirement: 移除旧版样式引擎
**Reason**: UnoCSS 和 Less 在项目中增加了多余的复杂度，与 Tailwind CSS 存在功能重叠。
**Migration**: 全面迁移至纯净的 Tailwind CSS 标准配置体系。
