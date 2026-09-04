// Servidor estático mínimo (zero dependências).
// Serve o site de docs buildado (dist/) + o registry em /r/<item>.json
// (o Vite copia public/r -> dist/r no build). Usado no deploy do Railway.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("./dist/", import.meta.url));
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
};

createServer(async (req, res) => {
  // O shadcn CLI baixa server-side, mas liberamos CORS por conveniência.
  res.setHeader("Access-Control-Allow-Origin", "*");

  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok");
  }
  if (pathname === "/") pathname = "/index.html";

  const filePath = normalize(join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("forbidden");
  }

  try {
    const s = await stat(filePath);
    const resolvedPath = s.isDirectory() ? join(filePath, "index.html") : filePath;
    const body = await readFile(resolvedPath);
    res.setHeader(
      "Content-Type",
      TYPES[extname(resolvedPath)] || "application/octet-stream",
    );
    res.setHeader("Cache-Control", "public, max-age=300");
    res.writeHead(200);
    res.end(body);
  } catch {
    // SPA fallback: rotas sem extensão (ex.: #hash já é client-side, mas
    // deep-links tipo /componentes) caem no index.html. /r/*.json (com
    // extensão) segue retornando 404 JSON quando o item não existe.
    if (extname(pathname) === "") {
      try {
        const html = await readFile(join(ROOT, "index.html"));
        res.setHeader("Content-Type", TYPES[".html"]);
        res.writeHead(200);
        return res.end(html);
      } catch {
        /* sem build ainda */
      }
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found", path: pathname }));
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`lai-design-system registry servindo em :${PORT}`);
});
