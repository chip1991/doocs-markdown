# Tasks

- [x] Task 1: 恢复底部 Footer 与左右布局切换
  - [x] SubTask 1.1: 从 `EditorHeader` 中移除字数统计，抽离并新建底部 `Footer` 组件以 100% 还原旧版布局。
  - [x] SubTask 1.2: 在 `EditorHeader` 或 `RightSlider` 中增加控制 `isEditOnLeft` 状态的切换按钮。

- [x] Task 2: 还原任意主题色拾色器 (Color Picker)
  - [x] SubTask 2.1: 在 `StyleDropdown` 或 `RightSlider` 的主题色配置区域，引入原生 `<input type="color">` 或 `react-color` 组件。
  - [x] SubTask 2.2: 绑定选择器事件至 Zustand 的 `themeChanged` 与持久化状态。

- [x] Task 3: 增强表格插入体验 (Insert Table)
  - [x] SubTask 3.1: 重构 `InsertFormDialog.tsx`，根据行列数动态生成输入表单矩阵。
  - [x] SubTask 3.2: 收集表单矩阵数据，拼接生成完整的带内容 Markdown 表格字符串。

- [x] Task 4: 图床表单校验与自定义挂载
  - [x] SubTask 4.1: 在 `UploadImgDialog.tsx` 中为各大图床配置项增加基础非空校验和提示拦截。
  - [x] SubTask 4.2: 确保 `CustomUploadForm` 在弹窗或独立标签页中被正确挂载并能保存代码配置。

- [x] Task 5: 补全一键发布多平台功能 (Post Sync)
  - [x] SubTask 5.1: 迁移旧版 `PostInfo.vue` 为 `PostInfo.tsx`，解析 Markdown Front-matter 信息（标题、描述等）。
  - [x] SubTask 5.2: 迁移旧版 `PostTaskDialog.vue` 为 `PostTaskDialog.tsx`，与 `window.$syncer` API 桥接。
  - [x] SubTask 5.3: 在顶部工具栏挂载“发布”入口。

# Task Dependencies
- [Task 5] depends on [Task 1] (布局调整后挂载)
