import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    apiKeyConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    time: new Date().toISOString(),
  });
});

// ANTHROPIC API PROXY (streaming)
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on the server. Set ANTHROPIC_API_KEY in your environment.' });
  }
  const body = req.body || {};
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: 'messages[] is required.' });
  }
  if (!body.model) body.model = 'claude-sonnet-4-5';
  if (typeof body.max_tokens !== 'number') body.max_tokens = 2000;
  body.stream = true;

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(502).json({ error: 'Failed to reach Anthropic API: ' + err.message });
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    let parsed = null;
    try { parsed = JSON.parse(text); } catch {}
    const message = parsed?.error?.message || parsed?.error || text || ('Upstream error ' + upstream.status);
    return res.status(upstream.status).json({ error: typeof message === 'string' ? message : JSON.stringify(message) });
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  upstream.body.on('data', (chunk) => res.write(chunk));
  upstream.body.on('end', () => res.end());
  upstream.body.on('error', (err) => {
    console.error('Upstream stream error:', err);
    try { res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`); } catch {}
    res.end();
  });

  req.on('close', () => { try { upstream.body.destroy(); } catch {} });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SceneCraft Studio running on http://localhost:${PORT}`);
});
