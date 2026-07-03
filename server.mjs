// Servidor estático mínimo (zero dependências) para servir o registry.
// Serve a pasta ./public — os itens ficam em /r/<item>.json.
// Usado no deploy do Railway (bind em $PORT).

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("./public/", import.meta.url));
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
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
    if (s.isDirectory()) throw new Error("is directory");
    const body = await readFile(filePath);
    res.setHeader("Content-Type", TYPES[extname(filePath)] || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.writeHead(200);
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found", path: pathname }));
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`lai-design-system registry servindo em :${PORT}`);
});
