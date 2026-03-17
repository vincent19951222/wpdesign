## ADDED Requirements

### Requirement: Pixel Color Tokens
系统 SHALL 定义并暴露一组统一的复古像素风颜色令牌，作为全站 UI 的唯一视觉基线。

#### Scenario: 配置核心颜色
- **WHEN** 前端加载设计系统配置
- **THEN** 系统提供以下可复用颜色值：边框与阴影 `#1a1a1a`、页面背景 `#f6e5c0`、面板背景 `#fff9ed`、功能红 `#e64a4e`、功能绿 `#5b9e54`、功能橙 `#e58c3a`、功能蓝 `#3666b3`、功能黄 `#e8c440`、功能紫 `#8e52a3`

#### Scenario: 页面使用统一背景基线
- **WHEN** 任一核心页面渲染应用外壳
- **THEN** 系统使用页面背景色 `#f6e5c0` 作为默认底色，并允许在该底色上叠加像素点阵纹理而不替换该基础色值

### Requirement: Pixel Typography Baseline
系统 SHALL 为标题与按钮、正文与输入框分别提供固定的字体基线，并统一全局渲染风格。

#### Scenario: 中文文本使用 Fusion Pixel
- **WHEN** 系统渲染中文正文、中文标题或其他中文界面文本
- **THEN** 系统使用 `Fusion Pixel` 作为首选字体，并提供当前运行时可用的中文回退字体链

#### Scenario: 英文大标题使用 Press Start 2P
- **WHEN** 系统渲染英文 H1 或英文 H2
- **THEN** 系统使用 `Press Start 2P` 作为首选字体，并提供当前运行时可用的英文回退字体链

#### Scenario: 英文次级文本和按钮使用 Silkscreen
- **WHEN** 系统渲染英文短描述、英文次级文本或英文按钮文案
- **THEN** 系统使用 `Silkscreen` 作为首选字体，并提供当前运行时可用的英文回退字体链

#### Scenario: 应用全局像素渲染风格
- **WHEN** 应用初始化全局样式
- **THEN** 系统关闭默认字体抗锯齿并应用 `-webkit-font-smoothing: none`

### Requirement: Even Pixel Grid
系统 SHALL 以偶数像素网格作为排版与间距基线，避免破坏像素对齐。

#### Scenario: 字号遵循偶数像素
- **WHEN** 系统定义标题、正文、标签、按钮或输入框的字号
- **THEN** 所有字号使用偶数像素值，例如 `4px`、`8px`、`16px`

#### Scenario: 间距遵循偶数像素
- **WHEN** 系统定义 margin 或 padding
- **THEN** 所有 margin 与 padding 使用偶数像素值，例如 `4px`、`8px`、`16px`

### Requirement: Reusable Pixel Surface Classes
系统 SHALL 提供可复用的基础像素样式类，覆盖面板、按钮和输入框三类核心界面元素。

#### Scenario: 面板类提供硬边框和实体投影
- **WHEN** 组件使用基础面板样式类
- **THEN** 系统应用 `4px` 深黑实线边框和 `8px 8px 0 0 #1a1a1a` 的无模糊右下硬阴影

#### Scenario: 按钮类提供三维像素按钮效果
- **WHEN** 组件使用基础按钮样式类
- **THEN** 系统应用深黑边框、左上高光 inset、右下暗部 inset 和外部实体投影组成的复合阴影

#### Scenario: 输入框类提供下凹视觉效果
- **WHEN** 组件使用基础输入框样式类
- **THEN** 系统应用深黑边框、顶部内阴影和外部实体投影，以表现下凹输入框效果

### Requirement: Pixel Interaction States
系统 SHALL 为像素按钮和输入框定义明确、统一的交互状态反馈。

#### Scenario: 按钮按下时表现为物理压入
- **WHEN** 用户激活像素按钮的按下态
- **THEN** 按钮向右下位移一个统一步长，外部实体投影收缩为零，且内阴影的高光与暗部反转

#### Scenario: 输入框聚焦时高亮
- **WHEN** 用户聚焦像素输入框
- **THEN** 系统移除默认 outline，并将输入框背景切换为高亮色以强调焦点状态
