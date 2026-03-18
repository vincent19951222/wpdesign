
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**排版实验室 (Pixel Lab)** 是一个基于 React 的 Web 应用，用于将 Markdown 内容转换为适配微信公众号的富文本排版。应用提供多种主题风格（像素复古、科技极简、商务经典、手绘风格等），支持主题自定义和 API-safe 模式。

### 核心功能

- **多主题系统**：内置 8+ 预设主题，支持 JSON 主题文件上传
- **5 步工作流**：首页 → 编辑器 → 预览 → 帮助文档 → 后台工作台
- **主题提取器**：从现有微信文章中提取样式生成主题 JSON（实验性功能）
- **API-safe 模式**：为草稿 API 优化的主题变体，移除复杂装饰元素

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Core Components

- **App.tsx**: 主应用组件，管理 5 步工作流状态和主题切换
- **components/LandingPage.tsx**: 首页，展示主题卡片和入口导航
- **components/Editor.tsx**: Markdown 编辑器，支持文件上传和主题切换
- **components/Preview.tsx**: 预览页面，模拟手机界面显示渲染结果
- **components/Help.tsx**: 帮助文档页面
- **components/AdminWorkbench.tsx**: 后台工作台（需密码验证）
- **components/ThemeExtractorUI.tsx**: 主题提取器（实验性功能）
- **components/WeChatRenderer.tsx**: Markdown → WeChat HTML 转换核心
- **types/ITheme.ts**: 主题类型定义（70+ 样式属性）
- **themes/*.json**: 预设主题配置文件

### Key Technical Decisions

1. **内联样式架构**：所有微信输出使用内联样式（WeChat 编辑器忽略外部 CSS）
2. **主题系统**：基于 ITheme 接口的 JSON 配置，支持 70+ 样式属性自定义
3. **复制策略**：使用 `document.execCommand('copy')` + 手动选区实现富文本复制
4. **Markdown 处理**：react-markdown + remark-gfm 支持 GitHub Flavored Markdown
5. **状态管理**：React useState 管理 5 步工作流和主题状态
6. **主题分类**：
   - `standard`：标准主题（适合手动复制粘贴）
   - `api-safe`：API 安全主题（移除复杂装饰，适合草稿 API）

### WeChat Compatibility Requirements

- **内联样式强制**：所有样式必须内联（不能使用 class 或外部 CSS）
- **主题配色示例**：
  - 经典像素：`#FFD700` (金色), `#00E099` (绿色), `#1a1a1a` (深色)
  - 科技极简：`#f5f8fc` (浅蓝), `#0066cc` (科技蓝)
- **字体策略**：代码块使用 `"Courier New"`, monospace
- **装饰元素**：像素风格使用 box-shadow 和 border 实现复古效果
- **API-safe 限制**：移除厚重边框、阴影和外层容器装饰

### State Management Pattern

应用使用 React useState 管理状态：
- `step`: 当前工作流步骤 (1|2|3|4|5)
  - 1: 首页（主题选择）
  - 2: 编辑器
  - 3: 预览
  - 4: 帮助文档
  - 5: 后台工作台（需密码验证）
- `markdown`: Markdown 内容字符串
- `copied`: 复制成功反馈状态
- `currentTheme`: 当前主题对象 (ITheme)
- `currentThemeId`: 当前主题 ID
- `templates`: 主题模板数组（包含主题元数据和 theme 对象）
- `showExtractor`: 主题提取器显示状态
- `showAdminAuth`: 后台验证弹窗状态

### File Upload Handling

- **Markdown 文件上传**：通过 FileReader API 读取 `.md` 文件内容
- **主题文件上传**：支持上传 JSON 格式的主题配置文件
- 上传后内容替换当前状态，input value 重置以支持重复上传

### Theme System

**主题结构 (ITheme)**：
- `meta`: 元数据（headerType, footerType, author, description）
- `wrapper`, `section`: 基础容器样式
- `h1`-`h5`: 标题样式（含容器、徽章、副标题）
- `p`, `strong`, `em`, `code`, `a`: 文本样式
- `blockquote`: 引用块（含徽章和内容区）
- `ul`, `ol`, `li`: 列表样式（含自定义标记）
- `pre`: 代码块（含头部、装饰点、标签）
- `table`, `thead`, `th`, `td`: 表格样式
- `footer`: 页脚样式

**预设主题**：
- `pixel-classic`: 经典像素风格
- `pixel-v4`: 像素原野（清新版）
- `pixel-v4-api-safe`: 像素原野 API 安全版
- `pixel-classic-api-safe`: 经典像素 API 安全版
- `tech-minimalist`: 科技极简
- `classic-theme`: 商务经典
- `default-theme`: 极简默认
- `hand-drawn-theme`: 手绘风格

### Build Configuration

Vite 配置包含：
- 开发服务器端口 3000，支持 host 绑定
- 环境变量支持（`GEMINI_API_KEY` 用于实验性功能）
- 路径别名 `@` 映射到项目根目录
- React 插件用于 JSX 转换
- Tailwind CSS v4 + PostCSS 用于 UI 样式

### UI Framework

- **Tailwind CSS v4**：用于应用界面样式（非微信输出）
- **Framer Motion**：页面过渡和动画效果
- **Lucide React**：图标库
- **自定义组件**：NeoUI, NeoEffects, Logo 等像素风格 UI 组件

### Admin Features

- **后台密码**：默认密码 `admin`（存储在 sessionStorage）
- **主题提取器**：实验性工具，从微信文章 HTML 中提取样式生成主题 JSON
- **工作台入口**：首页连续点击 Logo 5 次触发验证弹窗

### Development Notes

- 所有微信输出相关代码必须使用内联样式
- 新增主题需遵循 ITheme 接口定义
- 主题文件命名规范：`{theme-id}-theme.json`
- API-safe 主题应移除复杂的 box-shadow、border 和外层装饰容器
