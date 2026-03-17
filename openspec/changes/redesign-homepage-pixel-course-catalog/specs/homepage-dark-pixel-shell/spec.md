## ADDED Requirements

### Requirement: Homepage Uses a Dark Pixel Product Shell
系统 SHALL 将首页渲染为暗色像素产品首页，而不是浅色控制台式工具页面。

#### Scenario: Homepage uses dark mode by default
- **WHEN** 用户首次进入首页
- **THEN** 页面使用深色背景基线、浅色前景文本和暗色结构容器作为默认视觉样式

#### Scenario: Homepage removes the console-style shell
- **WHEN** 首页完成本次重构
- **THEN** 首页不再以浅色像素工作台、控制室面板或监视器外壳作为主要版式语言

### Requirement: Homepage Uses Dual Typography
系统 SHALL 在首页采用像素显示字体与现代正文 sans 的双字体层级，而不是将像素字体扩展到所有文本。

#### Scenario: Hero and logo use pixel display typography
- **WHEN** 首页渲染品牌标识、hero 主标题或短 CTA
- **THEN** 这些元素使用像素显示字体以建立 8-bit 产品识别

#### Scenario: Navigation and body copy use readable sans-serif
- **WHEN** 首页渲染导航链接、说明文字、课程描述或辅助文案
- **THEN** 这些文本使用现代可读 sans-serif 字体而不是像素正文方案

### Requirement: Homepage Provides a Product-Site Navigation Bar
系统 SHALL 在首页顶部提供产品站式导航栏，以承载品牌、主导航、辅助图标和主要 CTA。

#### Scenario: Navigation bar renders key product navigation
- **WHEN** 首页顶部导航渲染完成
- **THEN** 页面展示品牌标识、核心导航项、辅助图标入口和一个高优先级主要按钮

#### Scenario: Navigation remains responsive
- **WHEN** 首页在窄屏设备上渲染导航
- **THEN** 导航结构仍保持可用，且不会因为像素装饰导致主要入口不可见或不可点击

### Requirement: Homepage Hero Uses Pixel Worldbuilding
系统 SHALL 使用大面积像素世界或景观 hero 来建立“探索课程世界”的产品氛围。

#### Scenario: Hero presents a pixel-art scene
- **WHEN** 首页加载首屏 hero
- **THEN** hero 区域展示横幅式或地图式 pixel art 场景，而不是纯色控制面板或简单渐变区块

#### Scenario: Hero combines worldbuilding with clear copy
- **WHEN** 用户浏览 hero 区域
- **THEN** 页面在像素场景之上提供清晰的主标题、副标题和至少一个主要行动入口

### Requirement: Homepage Includes a Secondary Atmosphere Strip
系统 SHALL 在 hero 后提供支持方横幅、世界观带状区块或等价的次级氛围区域，以增强首页层次。

#### Scenario: Homepage renders a secondary strip after hero
- **WHEN** hero 区块结束
- **THEN** 页面在主内容区之前提供一个次级带状信息区，用于展示支持方、专题氛围或世界观补充信息

### Requirement: Homepage Preserves Core App Entry Paths
系统 SHALL 在重构首页视觉后继续保留现有核心应用入口行为。

#### Scenario: Main CTA can still lead into the editor flow
- **WHEN** 用户点击首页主要 CTA 或专题入口
- **THEN** 系统仍可引导用户进入当前编辑台主流程

#### Scenario: Existing auxiliary entry points remain available
- **WHEN** 首页完成重构
- **THEN** 文档入口与管理员隐藏入口的既有能力仍然保留，不因首页视觉替换而消失
