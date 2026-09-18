import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dist = join(root, 'dist');
const port = Number(process.env.PORT ?? 8787);
const allowedMethods = new Set(['GET', 'POST']);
const certPath = process.env.HTTPS_CERT_PATH ?? join(root, 'certs', 'localhost-cert.pem');
const keyPath = process.env.HTTPS_KEY_PATH ?? join(root, 'certs', 'localhost-key.pem');
const useHttps = process.env.USE_HTTPS === 'true' || (existsSync(certPath) && existsSync(keyPath));

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error('Request body is too large.');
  }
  return JSON.parse(body || '{}');
}

async function askGwdg({ message, contextPack }) {
  const response = await fetch((process.env.GWDG_BASE_URL ?? 'https://chat-ai.academiccloud.de/v1') + '/chat/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + process.env.GWDG_API_KEY,
      'Content-Type': 'application/json',
      'inference-service': 'saia-openai-gateway'
    },
    body: JSON.stringify({
      model: process.env.GWDG_MODEL ?? 'qwen3-30b-a3b-instruct-2507',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein vorsichtiger Hof-Assistent. Trenne Beobachtung, mögliche Erklärungen, Prüfungen und nächste Schritte. Stelle agronomische Einschätzungen als Hinweise mit Unsicherheit dar und erfinde keine Quellen.'
        },
        {
          role: 'user',
          content: 'Nutzerfrage: ' + message + '\n\nFarmVisite-Kontext:\n' + JSON.stringify(contextPack ?? {})
        }
      ],
      temperature: 0,
      top_p: 0.05,
      'enable-tools': true,
      arcana: { id: process.env.GWDG_ARCANA_ID }
    })
  });

  if (!response.ok) throw new Error('GWDG request failed with status ' + response.status);
  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content ?? '', raw: data };
}

async function serveAsset(response, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = normalize(join(dist, requested));
  if (!file.startsWith(dist)) return false;

  try {
    const content = await readFile(file);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml'
    };
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(content);
    return true;
  } catch {
    return false;
  }
}

async function handleRequest(request, response) {
  if (!allowedMethods.has(request.method ?? '')) {
    response.writeHead(405);
    response.end();
    return;
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  try {
    if (url.pathname === '/health') return sendJson(response, 200, { ok: true });

    if (url.pathname === '/api/assistant' && request.method === 'POST') {
      if (!process.env.GWDG_API_KEY || !process.env.GWDG_ARCANA_ID) {
        return sendJson(response, 503, { error: 'GWDG server configuration is missing.' });
      }

      const body = await readBody(request);
      if (typeof body.message !== 'string' || !body.message.trim()) {
        return sendJson(response, 400, { error: 'message is required.' });
      }

      return sendJson(response, 200, await askGwdg(body));
    }

    if (request.method === 'GET' && (await serveAsset(response, url.pathname))) return;

    sendJson(response, 404, { error: 'Not found.' });
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : 'Internal server error.' });
  }
}

const server = useHttps
  ? createHttpsServer({ cert: readFileSync(certPath), key: readFileSync(keyPath) }, handleRequest)
  : createHttpServer(handleRequest);

server.listen(port, () => {
  console.log(`KlarblattFarm server listening on ${useHttps ? 'https' : 'http'}://localhost:${port}`);
});