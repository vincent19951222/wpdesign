## ADDED Requirements

### Requirement: Draft Sync Availability and Credential Guard
系统 SHALL 仅在微信公众号草稿同步所需的服务端配置完整时允许创建草稿。

#### Scenario: 服务端凭据完整
- **WHEN** 服务端已配置 `WECHAT_APP_ID`、`WECHAT_APP_SECRET` 和默认封面缩略图 `WECHAT_DEFAULT_THUMB_MEDIA_ID`
- **THEN** 前端可以调用草稿同步接口创建草稿

#### Scenario: 缺少服务端配置
- **WHEN** 服务端缺少任一微信公众号草稿同步所需配置
- **THEN** 草稿同步接口返回可操作的错误信息，并提示补齐服务端配置

### Requirement: Draft Sync Theme Constraint
系统 SHALL 在 v1 草稿同步链路中仅支持经典像素 API-safe 主题。

#### Scenario: 当前主题为经典像素 API-safe
- **WHEN** 用户在预览页使用经典像素 API-safe 主题
- **THEN** 系统显示可用的“一键同步草稿”入口

#### Scenario: 当前主题不是经典像素 API-safe
- **WHEN** 用户在预览页使用其他主题
- **THEN** 系统隐藏或禁用草稿同步入口，并明确提示 v1 仅支持经典像素 API-safe 主题

### Requirement: Draft Payload Generation
系统 SHALL 从 Markdown 与预览结果中生成适配微信公众号草稿接口的标题与正文内容。

#### Scenario: 从首个一级标题生成草稿标题
- **WHEN** Markdown 内容包含首个一级标题
- **THEN** 系统使用该一级标题作为草稿标题

#### Scenario: 正文移除首个一级标题模块
- **WHEN** 系统生成用于草稿接口的正文 HTML
- **THEN** 系统从正文 HTML 中移除与草稿标题重复的首个一级标题模块，避免正文与标题重复

#### Scenario: Markdown 缺少一级标题
- **WHEN** Markdown 内容不存在一级标题
- **THEN** 系统阻止草稿同步并提示用户先提供文章标题

### Requirement: Draft Creation via Server Proxy
系统 SHALL 通过现有 Express 服务代理微信公众号草稿创建请求。

#### Scenario: 成功创建草稿
- **WHEN** 前端提交合法的标题与正文 HTML 到服务端草稿同步接口
- **THEN** 服务端获取或复用有效 access token，并调用微信公众号草稿接口创建草稿

#### Scenario: 使用默认封面缩略图
- **WHEN** 服务端调用微信公众号草稿接口创建图文草稿
- **THEN** 服务端使用预配置的默认 `thumb_media_id` 作为 v1 封面缩略图

#### Scenario: 微信接口返回错误
- **WHEN** 微信公众号草稿接口返回失败或凭据失效
- **THEN** 服务端将错误转换为前端可展示的同步失败信息

### Requirement: Preserve Existing Manual Copy Workflow
系统 SHALL 保留现有预览与手动复制到公众号后台的工作流，不被草稿同步能力替代。

#### Scenario: 手动复制链路保持可用
- **WHEN** 用户继续使用预览页的复制功能
- **THEN** 系统保持现有复制行为与样式保真策略不变

#### Scenario: 草稿同步失败后继续手动复制
- **WHEN** 草稿同步失败
- **THEN** 用户仍可在同一预览页继续使用手动复制流程
