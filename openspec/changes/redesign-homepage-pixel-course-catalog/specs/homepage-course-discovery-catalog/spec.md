## ADDED Requirements

### Requirement: Homepage Supports Course Discovery Structure
系统 SHALL 将首页主内容组织为课程发现体验，而不是主题控制面板或纯工具入口列表。

#### Scenario: Homepage includes a featured course section
- **WHEN** 用户离开 hero 区域进入主内容
- **THEN** 页面展示一个专题或 featured section，用于突出当前主推课程方向或内容主题

#### Scenario: Homepage includes a course grid
- **WHEN** 首页展示内容列表
- **THEN** 页面以课程卡片网格形式呈现内容，而不是以控制面板信息块或主题样式说明块呈现

### Requirement: Homepage Provides Search and Filter Controls
系统 SHALL 在首页提供搜索和分类筛选能力，以支持课程发现和快速定位。

#### Scenario: Search input is visible in the discovery section
- **WHEN** 用户进入课程发现区域
- **THEN** 页面展示一个可交互的搜索输入框，用于筛选当前卡片列表

#### Scenario: Category filters are presented as pills
- **WHEN** 用户浏览分类筛选区
- **THEN** 页面展示一组 pill 形态的分类筛选项，并支持明确的默认态、悬停态和选中态

#### Scenario: Filter controls remain usable on mobile
- **WHEN** 首页在移动端展示搜索和分类筛选
- **THEN** 分类筛选区支持横向滚动或等价的紧凑布局，且不会破坏主要浏览体验

### Requirement: Course Cards Use Pixel Art Content With Readable Metadata
系统 SHALL 使用像素插画封面与现代可读文本结构展示课程卡片。

#### Scenario: Course cards display pixel art imagery
- **WHEN** 首页渲染课程卡片
- **THEN** 每张课程卡片的顶部区域展示 pixel art 风格的封面图或场景图

#### Scenario: Course cards display readable metadata
- **WHEN** 用户阅读课程卡片内容
- **THEN** 卡片展示课程标签、标题、描述和难度或级别标记，并保持正文可读性

#### Scenario: Course cards use discovery-oriented hover feedback
- **WHEN** 用户在桌面端悬停课程卡片
- **THEN** 卡片提供轻量浮起、边框强化或微弱光效等反馈，而不是厚重控制台式压入效果

### Requirement: Homepage Reuses Existing Template Data for Discovery Cards
系统 SHALL 在不引入新后端模型的前提下复用当前模板数据作为首页发现卡片的数据来源。

#### Scenario: Discovery cards can be generated from existing templates
- **WHEN** 首页加载现有模板数据
- **THEN** 系统能够将这些数据映射为首页专题项和课程卡片项，而不要求新增独立课程数据源

#### Scenario: Selecting a discovery card preserves current app behavior
- **WHEN** 用户点击某张课程发现卡片
- **THEN** 系统仍然能够触发当前主题选择并进入既有编辑台链路

### Requirement: Homepage Avoids Generic SaaS Styling
系统 SHALL 通过游戏化细节、像素内容与暗色结构表达 8-bit 产品气质，而不是退化成普通课程平台或 SaaS 仪表盘。

#### Scenario: Homepage includes game-like accent details
- **WHEN** 首页渲染课程发现体验
- **THEN** 页面包含至少一类轻量游戏化细节，例如 coin、cursor、difficulty badge、world label 或等价装饰

#### Scenario: Homepage preserves responsive grid behavior
- **WHEN** 首页在不同屏宽下渲染卡片网格
- **THEN** 课程列表采用响应式栅格布局，在移动端、平板和桌面端均保持可浏览和可点击
