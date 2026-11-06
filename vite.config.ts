import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'llm-gateway-middleware',
      configureServer(server) {
        server.middlewares.use('/api/llm-gateway', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
          });

          req.on('end', async () => {
            try {
              const body = JSON.parse(rawBody || '{}');
              const providerId = body.providerId || 'google';
              const modelId = body.modelId || 'gemini-flash-lite-latest';
              const effectiveKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';

              if (!effectiveKey) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: { message: 'API Key가 설정되어 있지 않습니다.' } }));
                return;
              }

              if (providerId === 'google') {
                const host = ['https://generativelanguage', 'googleapis', 'com'].join('.');
                const url = `${host}/v1beta/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(effectiveKey)}`;
                const upstream = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(body.payload || {}),
                });
                const text = await upstream.text();
                res.statusCode = upstream.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(text);
                return;
              }

              if (providerId === 'openai' || providerId === 'xai' || providerId === 'deepseek') {
                const endpoint =
                  providerId === 'openai'
                    ? 'https://api.openai.com/v1/chat/completions'
                    : providerId === 'xai'
                      ? 'https://api.x.ai/v1/chat/completions'
                      : 'https://api.deepseek.com/chat/completions';

                const upstream = await fetch(endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${effectiveKey}`,
                  },
                  body: JSON.stringify(body.payload || {}),
                });
                const text = await upstream.text();
                res.statusCode = upstream.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(text);
                return;
              }

              if (providerId === 'anthropic') {
                const upstream = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': effectiveKey,
                    'anthropic-version': '2023-06-01',
                  },
                  body: JSON.stringify(body.payload || {}),
                });
                const text = await upstream.text();
                res.statusCode = upstream.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(text);
                return;
              }

              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: { message: 'Unsupported gateway provider' } }));
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Gateway error';
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: { message: msg } }));
            }
          });
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});



