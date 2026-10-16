import { createServer, type Server } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
const types: Readonly<Record<string,string>> = {html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json',svg:'image/svg+xml',woff2:'font/woff2',txt:'text/plain; charset=utf-8',png:'image/png',webm:'video/webm'};
export async function startServer(port = 4173): Promise<{ server: Server; url: string; close: () => Promise<void> }> {
  const root = resolve('dist');
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      let file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
      try { if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html'); }
      catch { file = resolve(root, '404.html'); res.statusCode = 404; }
      let data = await readFile(file);
      res.setHeader('Content-Type', types[file.split('.').at(-1) ?? ''] ?? 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (req.headers['accept-encoding']?.includes('gzip') && /\.(html|js|css|json|svg)$/.test(file)) {
        data = gzipSync(data); res.setHeader('Content-Encoding', 'gzip'); res.setHeader('Vary', 'Accept-Encoding');
      }
      res.end(data);
    } catch { res.writeHead(500).end('Unable to load this page.'); }
  });
  await new Promise<void>((resolveReady, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolveReady); });
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;
  return { server, url: `http://127.0.0.1:${actualPort}`, close: () => new Promise<void>((resolveClose, reject) => { server.closeAllConnections(); server.close(error => error ? reject(error) : resolveClose()); }) };
}
