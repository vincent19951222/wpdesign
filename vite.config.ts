import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api/wechat/drafts': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
        '/api/save-theme': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
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
    plugins: [react()],
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
