# Project Context

## Purpose
Pixel Lab - WeChat Formatter 是一个基于 React 的 Web 应用，将 Markdown 内容转换为专为微信公众号文章设计的 HTML 格式。应用采用复古像素艺术美学风格，灵感来源于 8 位游戏和赛博朋克主题。

## Tech Stack

### 核心技术
- **TypeScript** ~5.8.2 - 主要编程语言
- **React** ^19.2.3 - UI 框架
- **Vite** ^6.2.0 - 构建工具和开发服务器
- **Tailwind CSS** - 样式框架

### 依赖库
- **react-markdown** ^10.1.0 - Markdown 解析和渲染
- **remark-gfm** ^4.0.1 - GitHub Flavored Markdown 支持
- **lucide-react** ^0.560.0 - UI 图标库

### 开发工具
- **Node.js** 环境
- **pnpm/npm** 包管理
- **TypeScript** 编译器

## Project Conventions

### Code Style

**命名规范：**
- PascalCase：React 组件、TypeScript 接口/类型（如 `WeChatRenderer`、`ITheme`）
- camelCase：变量、函数、方法（如 `headerType`、`content`）
- kebab-case：JSON 文件名、CSS 类名（如 `pixel-theme.json`、`pixel-container`）

**代码组织：**
- 每个文件一个主要的 React 组件
- 接口定义在 `types/` 目录或组件文件顶部
- 主题配置文件放在 `themes/` 目录
- 公共 UI 组件放在 `components/` 目录

**格式偏好：**
- 使用单引号
- 尾随逗号
- 2 个空格缩进
- 函数组件使用箭头函数：`const Component: React.FC<Props> = () => {}`

### Architecture Patterns

**主题系统架构：**
- 主题以 JSON 格式存储，键为 camelCase 的 CSS 属性
- 使用 `ITheme` 接口定义主题结构（见 `types/ITheme.ts`）
- 主题通过 `meta` 字段提供元数据（headerType、footerType、author、description）

**WeChat 兼容性原则：**
- 仅使用内联样式（`style` 属性），WeChat 编辑器忽略外部 CSS
- 所有颜色使用十六进制或 RGBA 格式
- 使用安全字体族：`"Courier New"`、`monospace`
- 模拟移动界面预览移动端呈现

**组件设计模式：**
- 容器组件使用语义化 HTML `section` 标签
- 避免不必要的嵌套包装
- 将样式与逻辑分离：纯视觉样式提取到主题 JSON

**复制策略：**
- 使用 `document.execCommand('copy')` 和手动文本选择作为回退方案
- 富文本复制到 WeChat 编辑器需要精确的选择处理

### Testing Strategy
当前项目未设置测试框架。优先进行：
- 手动测试不同 Markdown 元素渲染
- 测试复制功能到 WeChat 编辑器
- 跨设备移动预览测试
- 主题切换和配置测试

### Git Workflow

**提交约定：**
使用约定式提交格式，支持中英文混合：
- `feat:` - 新功能
- `fix:` - Bug 修复
- `refactor:` - 代码重构
- `docs:` - 文档更新
- `style:` - 格式调整

示例：
- `feat: Add copy button component`
- `refactor(主题系统): 重构硬编码样式为可配置主题系统`

**分支策略：**
- `main` 作为主分支（PR 目标分支）
- 功能分支使用 kebab-case：`add-two-factor-auth`

## Domain Context

### WeChat 公众号发布工作流
用户需要格式化工具来解决：
1. **Markdown 转换**：将标准 Markdown 转换为 WeChat 兼容 HTML
2. **视觉一致性**：确保文章在 WeChat 内外观良好
3. **移动优化**：使用手机界面预览移动端呈现
4. **复制可靠性**：处理 WeChat 编辑器的粘贴限制

### 主题定制
- 主题决定文章的视觉风格
- `pixel` 主题提供赛博朋克美学
- 主题可切换 header/footer 类型
- JSON 格式便于版本控制和多人协作

### 技术约束
- WeChat 编辑器仅支持内联样式，不支持外部 CSS
- WeChat 有特定的 HTML 标签白名单
- 移动端 viewport 限制
- 中国网络环境下的访问速度考虑

## Important Constraints

**技术约束：**
- 仅使用内联样式（`style` 属性）
- TypeScript 严格模式需要明确的类型定义
- Vite 构建需与 WeChat 内容安全策略兼容
- 避免使用实验性 Web 特性

**业务约束：**
- 中国内容监管合规性
- WeChat 政策变更兼容性
- 需要离线功能（不依赖外部 API）

**性能约束：**
- 首次加载时间 < 3 秒
- 打包体积优化（拆包和懒加载）
- 移动设备内存占用

## External Dependencies

### 开发环境
- **Gemini API**（可选）- AI 辅助功能（通过 `GEMINI_API_KEY` 环境变量）

### 运行时依赖
- 无外部 API 依赖
- 无后端服务依赖
- 完全离线运行

### 构建和部署
- GitHub（代码托管）
- Vercel/Netlify（可能用于预览部署）
- 中国境内 CDN 加速（如需要）
