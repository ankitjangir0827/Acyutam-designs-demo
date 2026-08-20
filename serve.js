import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3005;
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function resolvePath(reqUrl) {
  let cleanUrl = (reqUrl || "/").split("?")[0];
  if (cleanUrl === "/") cleanUrl = "/index.html";

  let decodedUrl = cleanUrl;
  try {
    decodedUrl = decodeURIComponent(cleanUrl);
  } catch {
    decodedUrl = cleanUrl;
  }

  // Prevent direct path traversal attempts
  const relPath = decodedUrl.replace(/\\/g, "/").replace(/^\/+/, "");
  if (relPath.includes("..")) {
    return null;
  }

  const rootDir = path.resolve(__dirname);
  const lowerRel = relPath.toLowerCase();

  // 1. CEO Picture Mapping
  if (lowerRel.includes("ceo-admin-profile") || lowerRel.includes("ceo pic")) {
    const ceoFile = path.join(rootDir, "photos_and_videos", "ceo pic.jpeg");
    if (fs.existsSync(ceoFile)) return ceoFile;
  }

  // 2. Preloader Video Mapping
  if (lowerRel.includes("preloader") || lowerRel.includes("lotus-animation")) {
    if (lowerRel.endsWith(".mp4")) {
      const mp4File = path.join(rootDir, "preloader-video.mp4");
      if (fs.existsSync(mp4File)) return mp4File;
    }
    const webmFile = path.join(rootDir, "preloader-video.webm");
    if (fs.existsSync(webmFile)) return webmFile;
    const mp4File = path.join(rootDir, "preloader-video.mp4");
    if (fs.existsSync(mp4File)) return mp4File;
  }

  // 3. Logo & Favicon Mapping
  if (lowerRel.includes("logo") || lowerRel.includes("favicon")) {
    const logoWebp = path.join(rootDir, "photos_and_videos", "logo.webp");
    if (fs.existsSync(logoWebp)) return logoWebp;
    const logoPng = path.join(rootDir, "photos_and_videos", "logo.png");
    if (fs.existsSync(logoPng)) return logoPng;
    const rootLogo = path.join(rootDir, "logo.png");
    if (fs.existsSync(rootLogo)) return rootLogo;
  }

  // 4. Canvas Scroller Frame Animation Mapping
  if (lowerRel.includes("ezgif-frame-")) {
    const fileName = path.basename(relPath);
    const frameFile = path.join(
      rootDir,
      "photos_and_videos",
      "scroller",
      fileName,
    );
    if (fs.existsSync(frameFile)) return frameFile;
  }

  const hasExt = path.extname(relPath) !== "";

  // Standard lookup candidate paths
  const candidates = [
    path.join(rootDir, relPath),
    path.join(rootDir, "photos_and_videos", relPath),
    path.join(rootDir, "public", relPath),
    path.join(
      rootDir,
      relPath.replace(/^photos[ _]and[ _]videos\//i, ""),
    ),
    path.join(
      rootDir,
      "photos_and_videos",
      relPath.replace(/^photos[ _]and[ _]videos\//i, ""),
    ),
  ];


  if (!hasExt) {
    candidates.unshift(
      path.join(rootDir, `${relPath}.html`),
      path.join(rootDir, "public", `${relPath}.html`),
    );
  }

  for (const cand of candidates) {
    try {
      const resolved = path.resolve(cand);
      if (!resolved.startsWith(rootDir)) continue;
      if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
        return resolved;
      }
    } catch {
      // Ignore stat errors
    }
  }

  return null;
}

function startServer(port) {
  const server = http.createServer(async (req, res) => {
    try {
      const securityHeaders = {
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      };

      const reqUrl = (req.url || "/").split("?")[0];

      // 1. GET /api/projects
      if (reqUrl === "/api/projects" && req.method === "GET") {
        try {
          const { getCloudinaryProjects } = await import("./api/projects.js");
          const projects = await getCloudinaryProjects();
          res.writeHead(200, {
            "Content-Type": "application/json",
            ...securityHeaders
          });
          res.end(JSON.stringify(projects, null, 2));
          return;
        } catch (apiErr) {
          console.error("Cloudinary /api/projects Route Error:", apiErr);
          res.writeHead(500, { "Content-Type": "application/json", ...securityHeaders });
          res.end(JSON.stringify({ error: apiErr.message }));
          return;
        }
      }

      // 2. GET /api/admin/projects (Grouped Tree)
      if (reqUrl === "/api/admin/projects" && req.method === "GET") {
        try {
          const { getAdminGroupedProjects } = await import("./api/admin/projects/index.js");
          const groupedData = await getAdminGroupedProjects();
          res.writeHead(200, {
            "Content-Type": "application/json",
            ...securityHeaders
          });
          res.end(JSON.stringify(groupedData, null, 2));
          return;
        } catch (apiErr) {
          console.error("Cloudinary /api/admin/projects Route Error:", apiErr);
          res.writeHead(500, { "Content-Type": "application/json", ...securityHeaders });
          res.end(JSON.stringify({ error: apiErr.message }));
          return;
        }
      }

      // 3. POST /api/admin/projects/upload
      if (reqUrl === "/api/admin/projects/upload" && req.method === "POST") {
        let bodyRaw = "";
        req.on("data", (chunk) => { bodyRaw += chunk; });
        req.on("end", async () => {
          try {
            const handler = (await import("./api/admin/projects/upload.js")).default;
            req.body = bodyRaw ? JSON.parse(bodyRaw) : {};
            const result = await handler(req, res);
            if (!res.headersSent) {
              res.writeHead(200, { "Content-Type": "application/json", ...securityHeaders });
              res.end(JSON.stringify(result));
            }
          } catch (uploadErr) {
            console.error("Cloudinary /api/admin/projects/upload Route Error:", uploadErr);
            if (!res.headersSent) {
              res.writeHead(500, { "Content-Type": "application/json", ...securityHeaders });
              res.end(JSON.stringify({ error: uploadErr.message }));
            }
          }
        });
        return;
      }

      const targetFile = resolvePath(req.url);
      if (targetFile) {
        const ext = path.extname(targetFile).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        res.writeHead(200, {
          "Content-Type": contentType,
          ...securityHeaders,
        });
        const stream = fs.createReadStream(targetFile);
        stream.on("error", (err) => {
          if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "text/plain", ...securityHeaders });
          }
          res.end("Internal Server Error");
        });
        stream.pipe(res);
      } else {
        if (req.headers.accept && req.headers.accept.includes("text/html")) {
          const indexPath = path.join(__dirname, "index.html");
          if (fs.existsSync(indexPath)) {
            res.writeHead(200, { "Content-Type": "text/html", ...securityHeaders });
            const stream = fs.createReadStream(indexPath);
            stream.on("error", () => res.end());
            stream.pipe(res);
            return;
          }
        }
        res.writeHead(404, { "Content-Type": "text/plain", ...securityHeaders });
        res.end("404 Not Found");
      }
    } catch (err) {
      console.error("Request handling error:", err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain" });
      }
      res.end("Internal Server Error");
    }
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(
      `🚀 Achyutam Builder server running locally at http://localhost:${port}`,
    );
  });
}

startServer(PORT);
