# 重构 doocs-md 为 React + NestJS 架构 Spec

## Why
原 `doocs-md-old` 项目是一个纯前端的 Vue 3 应用，图床密钥等敏感信息必须由用户在前端配置并存储于 localStorage，存在极大的安全隐患；同时纯前端架构限制了多端同步、用户配置云端持久化等高级功能的扩展。为此，我们需要将其重构为 React 18+ (前端) 和 NestJS (后端) 的前后端分离架构，以提升安全性和扩展性。

## What Changes
- 将前端框架从 Vue 3 迁移到 React 18+，使用 Hooks 和 Zustand/Jotai 进行状态管理。
- 将 UI 组件库从自建组件/无头组件切换为 React 生态的 shadcn-ui + Tailwind CSS。
- 将编辑器核心从 CodeMirror 5 升级为 CodeMirror 6，提升 React 兼容性和性能。
- 引入 NestJS 作为后端服务，负责安全的图床中转/临时凭证(STS)下发，以及用户配置和文章草稿的云端持久化。
- 采用 Monorepo 结构（如 Turborepo）管理前后端代码，通过共享包复用 TypeScript 类型定义。
- **BREAKING**: 原有的前端直接填写图床 SecretId/SecretKey 的功能将被废弃，改为通过后端统一认证或获取 STS 凭证。

## Impact
- Affected specs: 图床上传流程、本地草稿保存流程、主题与样式配置流程。
- Affected code: 所有前端业务组件、状态库、上传工具类。新增后端 API 服务目录。

## ADDED Requirements
### Requirement: 后端图床临时凭证下发 (STS)
The system SHALL provide a secure way to upload images without exposing permanent credentials on the client side.

#### Scenario: Success case
- **WHEN** user pastes or drags an image into the editor
- **THEN** the frontend requests a temporary STS token from the NestJS backend, and uses it to upload the image to the cloud storage securely.

### Requirement: 云端数据同步
The system SHALL provide cloud synchronization for user settings and markdown drafts.

#### Scenario: Success case
- **WHEN** user logs in and modifies custom CSS or writes a new draft
- **THEN** the backend persists this data to the database, allowing the user to retrieve it from any device.

## MODIFIED Requirements
### Requirement: Markdown 实时渲染引擎
The core `marked` renderer logic is preserved but modified to consume React State/Context instead of Pinia stores for dynamic theme and CSS variable injection.

## REMOVED Requirements
### Requirement: 纯前端图床密钥配置
**Reason**: 存在严重的安全泄露风险。
**Migration**: 迁移至后端环境变量管理，前端仅负责请求上传凭证或通过后端代理上传。