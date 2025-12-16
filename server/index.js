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

if (!MOONSHOT_API_KEY) {
  console.warn('⚠️ 警告: 未找到 VITE_MOONSHOT_API_KEY 或 MOONSHOT_API_KEY 环境变量。Kimi API 可能无法工作。');
}

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
// 3. 静态文件托管
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
- Static Files: ${distPath}
  `);
});
