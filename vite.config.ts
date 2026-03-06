import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { publishWechatBrowserDraft } = require('./server/lib/browserDraftPublisher');
const { toErrorResponse } = require('./server/lib/errors');

const saveThemePlugin = () => ({
  name: 'save-theme',
  configureServer(server) {
    server.middlewares.use('/api/save-theme', async (req, res, next) => {
      console.log(`[save-theme] Received request: ${req.method} ${req.url}`);
      
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          console.log('[save-theme] Body received, parsing...');
          try {
            const { theme, filename } = JSON.parse(body);
            console.log(`[save-theme] Saving theme: ${filename}`);
            
            if (!theme || !filename) {
              console.error('[save-theme] Missing theme or filename');
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing theme or filename' }));
              return;
            }
            
            // Ensure filename ends with .json
            const safeFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
            // Sanitize filename to prevent directory traversal
            const sanitizedFilename = safeFilename.replace(/[^a-zA-Z0-9._-]/g, '');
            const filePath = path.resolve(__dirname, 'themes', sanitizedFilename);
            
            console.log(`[save-theme] Writing to: ${filePath}`);

            // Ensure directory exists
            if (!fs.existsSync(path.dirname(filePath))) {
              fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }

            fs.writeFileSync(filePath, JSON.stringify(theme, null, 2));
            console.log('[save-theme] Save successful');
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: filePath }));
          } catch (err) {
            console.error('[save-theme] Error saving theme:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save theme' }));
          }
        });
      } else {
        next();
      }
    });
  }
});

const browserDraftPlugin = () => ({
  name: 'wechat-browser-draft',
  configureServer(server) {
    server.middlewares.use('/api/wechat/browser-draft', async (req, res, next) => {
      if (req.method !== 'POST') {
        next();
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const result = await publishWechatBrowserDraft(payload);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (error) {
          const response = toErrorResponse(error);
          res.statusCode = response.statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response.body));
        }
      });
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        // Proxy for Kimi K2 API (local development only)
        '/api/moonshot': {
          target: 'https://api.moonshot.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/moonshot/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Inject API key header
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_MOONSHOT_API_KEY}`);
            });
          },
        },
      },
    },
    plugins: [react(), saveThemePlugin(), browserDraftPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
