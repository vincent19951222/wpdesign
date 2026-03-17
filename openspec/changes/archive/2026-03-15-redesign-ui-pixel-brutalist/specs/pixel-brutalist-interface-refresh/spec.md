## ADDED Requirements

### Requirement: Shared UI Components Adopt Pixel System
系统 SHALL 让共享 UI 组件默认采用复古像素风设计系统，而不是继续依赖旧的混合视觉规则。

#### Scenario: 共享按钮采用像素按钮基线
- **WHEN** 应用渲染主操作按钮、次操作按钮或工具栏按钮
- **THEN** 这些按钮默认使用像素按钮样式基线，并通过功能色区分语义状态

#### Scenario: 共享输入控件采用像素输入框基线
- **WHEN** 应用渲染文本输入、文本域或文件选择触发控件
- **THEN** 这些控件默认使用像素输入框样式基线，并保持统一的边框、阴影和聚焦反馈

#### Scenario: 共享容器采用像素面板基线
- **WHEN** 应用渲染卡片、配置面板、信息面板或区块容器
- **THEN** 这些容器默认使用像素面板样式基线，而不是旧的柔性或混合阴影样式

### Requirement: Core Pages Use Pixel-Brutalist Layout
系统 SHALL 让核心页面与主要工作区采用统一的复古像素风页面结构和视觉语言。

#### Scenario: 首页采用统一像素页面基线
- **WHEN** 用户进入首页或主题选择入口
- **THEN** 页面背景、标题区、卡片区和主要 CTA 使用统一的像素配色、字体、边框和硬阴影规则

#### Scenario: 工作台采用统一像素页面基线
- **WHEN** 用户进入编辑区、预览区或帮助入口
- **THEN** 页面中的操作面板、编辑容器、工具区和结果区保持一致的像素风面板与控件表现

### Requirement: Workflow Behavior Remains Intact During Refresh
系统 SHALL 在完成界面重构的同时保留现有核心内容工作流行为。

#### Scenario: Markdown 编辑流程保持可用
- **WHEN** 用户在新界面中输入、导入或修改 Markdown 内容
- **THEN** 系统保持当前编辑流程和内容更新行为不变

#### Scenario: 预览与复制流程保持可用
- **WHEN** 用户在新界面中预览文章并执行复制
- **THEN** 系统保持当前预览渲染和复制工作流可用，不因视觉重构而移除入口或改变结果语义

#### Scenario: 主题切换流程保持可用
- **WHEN** 用户在新界面中切换主题或进入相应工作区
- **THEN** 系统保持当前主题选择与进入编辑台的核心流程可用

### Requirement: Runtime-Compatible Implementation
系统 MUST 在当前项目运行时中提供等价的设计系统实现，而不依赖未引入的框架能力。

#### Scenario: 当前运行时不是 Next.js
- **WHEN** 项目运行在现有的 Vite + React 环境中
- **THEN** 系统通过当前运行时可用的配置和全局样式机制接入字体、颜色令牌和基础像素类

#### Scenario: 未来迁移框架时保持设计约束
- **WHEN** 项目未来迁移到其他前端框架
- **THEN** 新框架实现仍需满足本规格定义的颜色、字体、面板、按钮和输入框行为约束
