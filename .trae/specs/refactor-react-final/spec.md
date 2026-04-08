# Refactor doocs-md-old to React Final Phase Spec

## Why
经过前几轮重构，项目核心功能和架构已迁移至 React，但为了达到 100% 的功能覆盖度和 100% 的视觉/交互还原程度，必须补齐在审计中发现的所有 UI 降级、功能缺失和交互差异。本次 Final Phase 将彻底解决这些“最后一公里”的问题，实现完美收官。

## What Changes
- **布局与统计复原**：恢复底部的 Footer 状态栏以显示字数和阅读时间；在界面中补充“左右布局切换”的控制按钮。
- **高级颜色定制**：在右侧面板或样式菜单中，引入原生或第三方颜色选择器，支持任意 RGB/HEX 主题色拾取。
- **表格插入增强**：强化 `InsertFormDialog`，不仅支持行列数选择，还支持动态生成输入框以填写表头和单元格内容。
- **图床表单校验**：为 `UploadImgDialog` 补充必填项和格式的表单校验，并正确挂载 `CustomUploadForm`。
- **一键发布功能**：补全 `PostInfo` 与 `PostTaskDialog` 组件，打通与第三方“文章同步助手 (`window.$syncer`)”的交互，实现多平台一键发布。

## Impact
- Affected specs: 涉及整体布局微调、弹窗组件增强以及全局窗口对象（`window.$syncer`）的类型扩展。
- Affected code: `App.tsx`, `EditorHeader.tsx`, `RightSlider.tsx`, `UploadImgDialog.tsx`, `InsertFormDialog.tsx`, 及新增组件 `PostInfo.tsx`, `PostTaskDialog.tsx`。

## ADDED Requirements
### Requirement: 多平台一键发布
**WHEN** 用户点击顶部栏的“发布”按钮
**THEN** 唤起 `PostTaskDialog` 弹窗，读取 Markdown 内容及前置属性（Front-matter），并通过 `window.$syncer` 将内容分发至目标平台（如知乎、微信公众号等）。

## MODIFIED Requirements
### Requirement: 动态表格插入
**WHEN** 用户在“插入表格”弹窗中修改行列数
**THEN** 界面动态渲染对应数量的输入框，用户输入内容后点击确定，生成包含实际内容的 Markdown 表格。
