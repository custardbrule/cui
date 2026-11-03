/// <reference types="node" />
import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 8000;

const MIME_TYPES: Record<string, string> = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "text/javascript",
  mjs: "text/javascript",
  css: "text/css",
  json: "application/json",
  map: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
  woff2: "font/woff2",
};

const STATIC_PATH = path.dirname(fileURLToPath(import.meta.url));

const toBool = [() => true, () => false];

const prepareFile = async (url: string) => {
  const urlAsPath = decodeURI(url);
  const paths = [STATIC_PATH, urlAsPath];
  if (url.endsWith("/")) paths.push("index.html");
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : `${STATIC_PATH}/404.html`;
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};

http
  .createServer(async (req, res) => {
    // CORS on every response, including errors
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    const file = await prepareFile(req.url!.split("?")[0]!);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;

    file.stream.on("error", () => {
      if (!res.headersSent)
        res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    });

    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
