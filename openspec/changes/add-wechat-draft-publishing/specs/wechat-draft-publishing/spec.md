## ADDED Requirements

### Requirement: Fixed Pixel Theme Draft Rendering
系统 SHALL 将输入的 Markdown 按固定经典像素主题渲染为带内联样式的 HTML，用于公众号草稿内容。

#### Scenario: Render markdown into draft HTML
- **WHEN** 调用方提交合法的 Markdown 内容
- **THEN** 系统生成与现有经典像素预览结构一致的 HTML
- **AND** 输出内容包含内联样式，不依赖外部 CSS

#### Scenario: Preserve current preview flow
- **WHEN** 前端用户继续使用现有预览与复制流程
- **THEN** 现有 `WeChatRenderer` 行为保持可用

### Requirement: Cover Image Upload
系统 SHALL 要求调用方提供封面图，并在创建草稿前上传为微信封面素材。

#### Scenario: Missing cover image
- **WHEN** 请求中缺少 `coverImage`
- **THEN** 系统返回 `MISSING_COVER_IMAGE`
- **AND** 不继续执行草稿创建

#### Scenario: Successful cover upload
- **WHEN** 提供了合法封面图
- **THEN** 系统上传封面图并获取 `thumb_media_id`

### Requirement: Content Image Upload And Replacement
系统 SHALL 自动处理 Markdown 正文中的远程图片与 Base64 图片，并替换为微信侧可用地址。

#### Scenario: Remote image upload
- **WHEN** Markdown 中包含 `http` 或 `https` 图片
- **THEN** 系统下载该图片、上传到微信，并替换 HTML 中对应 `src`

#### Scenario: Data URL image upload
- **WHEN** Markdown 中包含 `data:` 图片
- **THEN** 系统解析图片内容、上传到微信，并替换 HTML 中对应 `src`

#### Scenario: Unsupported image source
- **WHEN** Markdown 中包含不支持的图片来源（如 `blob:` 或相对路径）
- **THEN** 系统返回 `UNSUPPORTED_IMAGE_SOURCE`
- **AND** 不创建草稿

### Requirement: WeChat Draft Creation
系统 SHALL 在渲染完成并处理图片后，调用公众号草稿接口创建单篇草稿。

#### Scenario: Create draft successfully
- **WHEN** Markdown 渲染、正文图片处理与封面上传都成功
- **THEN** 系统调用草稿接口创建草稿
- **AND** 返回草稿标识 `media_id`

#### Scenario: Draft creation fails
- **WHEN** 微信草稿接口返回错误
- **THEN** 系统返回 `WECHAT_DRAFT_CREATE_FAILED`
- **AND** 附带微信原始错误信息用于诊断

### Requirement: Unified Error Response
系统 SHALL 为发布接口返回统一的错误响应结构，便于调用方诊断失败原因。

#### Scenario: Invalid request payload
- **WHEN** 请求缺少必填字段（`markdown`、`title`、`author`、`digest`）
- **THEN** 系统返回 `INVALID_INPUT`

#### Scenario: Token fetch fails
- **WHEN** 无法获取有效的公众号 `access_token`
- **THEN** 系统返回 `WECHAT_TOKEN_FETCH_FAILED` 或 `WECHAT_AUTH_FAILED`

#### Scenario: Image upload fails
- **WHEN** 正文图片或封面图上传失败
- **THEN** 系统返回对应错误码
- **AND** 不继续创建草稿
