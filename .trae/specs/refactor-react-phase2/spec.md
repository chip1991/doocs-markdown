# Refactor doocs-md-old to React Phase 2 Spec

## Why
虽然第一阶段完成了 React 18+、Zustand、Tailwind CSS 的核心架构替换，并实现了基础编辑与双向同步滚动功能，但作为浏览器插件运行的能力（WXT 架构）以及大量外围高级功能（侧边栏、各类弹窗、深度样式定制、拖拽图片自动上传逻辑）尚未实现。为了达到 100% 的功能保真度和生产级可用性，需要开启第二阶段重构。

## What Changes
- 重新引入 WXT 框架，将项目还原为支持双端的 Web / 浏览器扩展应用。
- 重构并接入侧边栏面板（文章管理的 `PostSlider` 与高级设置的 `RightSlider`）。
- 还原深度样式定制功能，包括 `StyleDropdown` 及其内部的字体、字号、主题色拾取器。
- 补全所有缺失的弹窗组件（`UploadImgDialog`、`InsertFormDialog`、`AlertDialog` 等），并在全局挂载。
- 恢复编辑器的核心高级交互：解析拖拽上传的文件及文件夹，实现 `mdLocalToRemote()` 的本地图片自动转图床功能。
- 补充丢失的 UI 交互细节：全屏 Loading 遮罩、BackTop 回到顶部按钮、优化格式化快捷键逻辑。

## Impact
- Affected specs: 整体架构从纯 Vite SPA 变更为 WXT 支持的双端应用架构，全局布局 `App.tsx` 将挂载更多外围组件。
- Affected code: `wxt.config.ts`, `entrypoints/`, `src/components/`, `src/App.tsx`, `src/hooks/`.

## ADDED Requirements
### Requirement: 恢复 WXT 浏览器扩展架构
系统应当能够通过 WXT 构建出 Chrome/Firefox 的扩展包，并具备访问 Storage、跨域请求（各大图床）等所需权限。

#### Scenario: Success case
- **WHEN** 用户运行 `npm run dev:wxt` 或打包构建扩展
- **THEN** 生成扩展文件夹，且 popup/background 脚本正常工作，清单文件权限正确。

## MODIFIED Requirements
### Requirement: 编辑器拖拽增强交互
原先只支持纯文本或单图片拖拽，现需要支持整个包含图片的文件夹拖拽。
**WHEN** 拖入一个本地文件夹
**THEN** 系统解析内部的 Markdown 及关联的相对路径图片，将图片批量上传至当前配置的图床，并将 Markdown 中的图片链接替换为远程链接。

## REMOVED Requirements
### Requirement: 无
**Reason**: 本阶段主要为功能补全，无额外移除需求。
