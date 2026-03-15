/**
 * Backend Server for wpdesign
 * 
 * 功能：
 * 1. 托管静态前端文件 (../dist)
 * 2. 代理 Kimi AI API 请求 (注入 API Key)
 * 3. 处理主题保存请求
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 增加限制以支持大文件

// 加载 API Key
const MOONSHOT_API_KEY = process.env.VITE_MOONSHOT_API_KEY || process.env.MOONSHOT_API_KEY;
const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET;
const WECHAT_DEFAULT_THUMB_MEDIA_ID = process.env.WECHAT_DEFAULT_THUMB_MEDIA_ID;
const WECHAT_TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const wechatTokenCache = {
  accessToken: null,
  expiresAt: 0,
};

const getMissingWechatConfig = () => {
  const missing = [];

  if (!WECHAT_APP_ID) missing.push('WECHAT_APP_ID');
  if (!WECHAT_APP_SECRET) missing.push('WECHAT_APP_SECRET');
  if (!WECHAT_DEFAULT_THUMB_MEDIA_ID) missing.push('WECHAT_DEFAULT_THUMB_MEDIA_ID');

  return missing;
};

const missingWechatConfig = getMissingWechatConfig();

if (!MOONSHOT_API_KEY) {
  console.warn('⚠️ 警告: 未找到 VITE_MOONSHOT_API_KEY 或 MOONSHOT_API_KEY 环境变量。Kimi API 可能无法工作。');
}

if (missingWechatConfig.length > 0) {
  console.warn(`⚠️ 警告: 微信草稿同步缺少环境变量: ${missingWechatConfig.join(', ')}`);
}

const sendApiError = (res, status, message, details = {}) => {
  res.status(status).json({
    error: 'wechat_draft_sync_failed',
    message,
    ...details,
  });
};

const getWechatAccessToken = async () => {
  if (
    wechatTokenCache.accessToken &&
    Date.now() < wechatTokenCache.expiresAt - WECHAT_TOKEN_REFRESH_BUFFER_MS
  ) {
    return wechatTokenCache.accessToken;
  }

  const tokenUrl = new URL('https://api.weixin.qq.com/cgi-bin/token');
  tokenUrl.searchParams.set('grant_type', 'client_credential');
  tokenUrl.searchParams.set('appid', WECHAT_APP_ID);
  tokenUrl.searchParams.set('secret', WECHAT_APP_SECRET);

  const response = await fetch(tokenUrl);
  const data = await response.json();

  if (!response.ok || data.errcode || !data.access_token) {
    const error = new Error(data.errmsg || '获取微信公众号 access token 失败');
    error.details = data;
    throw error;
  }

  wechatTokenCache.accessToken = data.access_token;
  wechatTokenCache.expiresAt = Date.now() + ((data.expires_in || 7200) * 1000);

  return wechatTokenCache.accessToken;
};

const createWechatDraft = async ({ title, contentHtml }) => {
  const accessToken = await getWechatAccessToken();
  const draftUrl = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;

  const payload = {
    articles: [
      {
        title,
        author: '',
        digest: '',
        content: contentHtml,
        content_source_url: '',
        thumb_media_id: WECHAT_DEFAULT_THUMB_MEDIA_ID,
        need_open_comment: 0,
        only_fans_can_comment: 0,
      },
    ],
  };

  const response = await fetch(draftUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || data.errcode) {
    const error = new Error(data.errmsg || '创建微信公众号草稿失败');
    error.details = data;
    throw error;
  }

  return data;
};

// ----------------------------------------------------------------
// 1. API 代理配置
// ----------------------------------------------------------------
app.use('/api/moonshot', createProxyMiddleware({
  target: 'https://api.moonshot.cn',
  changeOrigin: true,
  pathRewrite: {
    '^/api/moonshot': '', // 移除 /api/moonshot 前缀
  },
  onProxyReq: (proxyReq, req, res) => {
    // 安全注入 API Key
    if (MOONSHOT_API_KEY) {
      proxyReq.setHeader('Authorization', `Bearer ${MOONSHOT_API_KEY}`);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
}));

// ----------------------------------------------------------------
// 2. 主题保存 API
// ----------------------------------------------------------------
app.post('/api/save-theme', (req, res) => {
  try {
    const { theme, filename } = req.body;
    
    if (!theme || !filename) {
      return res.status(400).json({ error: 'Missing theme or filename' });
    }

    console.log(`[save-theme] Saving theme: ${filename}`);

    // 确保文件名安全
    const safeFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
    const sanitizedFilename = safeFilename.replace(/[^a-zA-Z0-9._-]/g, '');
    
    // 确定保存路径：优先保存到项目根目录的 themes，如果不存在则保存到 server/themes
    let themesDir = path.resolve(__dirname, '../themes');
    
    // 如果上级目录没有 themes 文件夹（可能是独立部署），则使用当前目录下的 themes
    if (!fs.existsSync(themesDir)) {
        themesDir = path.resolve(__dirname, 'themes');
    }

    // 确保目录存在
    if (!fs.existsSync(themesDir)) {
      fs.mkdirSync(themesDir, { recursive: true });
    }

    const filePath = path.join(themesDir, sanitizedFilename);
    
    console.log(`[save-theme] Writing to: ${filePath}`);
    fs.writeFileSync(filePath, JSON.stringify(theme, null, 2));
    
    res.json({ success: true, path: filePath });
  } catch (err) {
    console.error('[save-theme] Error saving theme:', err);
    res.status(500).json({ error: 'Failed to save theme' });
  }
});

// ----------------------------------------------------------------
// 3. 微信草稿同步 API
// ----------------------------------------------------------------
app.post('/api/wechat/drafts', async (req, res) => {
  try {
    if (missingWechatConfig.length > 0) {
      return sendApiError(res, 500, `微信草稿同步尚未配置完成，请补齐：${missingWechatConfig.join(', ')}`, {
        code: 'missing_wechat_config',
      });
    }

    const { title, contentHtml } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return sendApiError(res, 400, '缺少草稿标题，请先在 Markdown 中提供一级标题。', {
        code: 'missing_title',
      });
    }

    if (!contentHtml || typeof contentHtml !== 'string' || !contentHtml.trim()) {
      return sendApiError(res, 400, '缺少草稿正文 HTML。', {
        code: 'missing_content_html',
      });
    }

    const result = await createWechatDraft({
      title: title.trim(),
      contentHtml,
    });

    return res.json({
      success: true,
      mediaId: result.media_id,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[wechat-drafts] Error creating draft:', err);

    const details = err && typeof err === 'object' && 'details' in err ? err.details : undefined;
    const errcode = details && typeof details === 'object' ? details.errcode : undefined;
    const status = errcode === 40001 || errcode === 42001 ? 502 : 500;

    return sendApiError(res, status, err instanceof Error ? err.message : '创建微信公众号草稿失败', {
      code: 'wechat_api_error',
      details,
    });
  }
});

// ----------------------------------------------------------------
// 4. 静态文件托管
// ----------------------------------------------------------------
// 生产环境构建目录
const distPath = path.resolve(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  console.log(`📁 Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback: 所有未匹配的请求都返回 index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn(`⚠️ Warning: dist directory not found at ${distPath}. Make sure to run 'npm run build' first.`);
  app.get('/', (req, res) => {
    res.send('Frontend not built. Please run "npm run build" and restart server.');
  });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
- API Proxy: /api/moonshot -> https://api.moonshot.cn
- Save Theme: /api/save-theme
- WeChat Draft Sync: /api/wechat/drafts
- Static Files: ${distPath}
  `);
});
