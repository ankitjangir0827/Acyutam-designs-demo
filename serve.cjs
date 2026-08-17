const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3005;
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
    const ceoFile = path.join(
      rootDir,
      "public",
      "photos_and_videos",
      "ceo pic.jpeg",
    );
    if (fs.existsSync(ceoFile)) return ceoFile;
  }

  // 2. Preloader Video Mapping
  if (lowerRel.includes("preloader") || lowerRel.includes("lotus-animation")) {
    const videoFile = path.join(
      rootDir,
      "public",
      "photos_and_videos",
      "preloader video.webm",
    );
    if (fs.existsSync(videoFile)) return videoFile;
    const rootVideo = path.join(rootDir, "preloader-video.webm");
    if (fs.existsSync(rootVideo)) return rootVideo;
  }

  // 3. Logo & Favicon Mapping
  if (lowerRel.includes("logo") || lowerRel.includes("favicon")) {
    const logoWebp = path.join(
      rootDir,
      "public",
      "photos_and_videos",
      "logo.webp",
    );
    if (fs.existsSync(logoWebp)) return logoWebp;
    const logoPng = path.join(rootDir, "public", "logo.png");
    if (fs.existsSync(logoPng)) return logoPng;
  }

  // 4. Canvas Scroller Frame Animation Mapping
  if (lowerRel.includes("ezgif-frame-")) {
    const fileName = path.basename(relPath);
    const frameFile = path.join(
      rootDir,
      "public",
      "photos_and_videos",
      "scroller",
      fileName,
    );
    if (fs.existsSync(frameFile)) return frameFile;
  }

  // Standard lookup candidate paths
  const candidates = [
    path.join(rootDir, relPath),
    path.join(rootDir, "public", relPath),
    path.join(rootDir, "public", "photos_and_videos", relPath),
    path.join(
      rootDir,
      "public",
      relPath.replace(/^photos[ _]and[ _]videos\//i, ""),
    ),
    path.join(
      rootDir,
      "public",
      "photos_and_videos",
      relPath.replace(/^photos[ _]and[ _]videos\//i, ""),
    ),
  ];

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
  const server = http.createServer((req, res) => {
    const targetFile = resolvePath(req.url);
    const securityHeaders = {
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    };

    if (targetFile) {
      const ext = path.extname(targetFile).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        ...securityHeaders,
      });
      fs.createReadStream(targetFile).pipe(res);
    } else {
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        const indexPath = path.join(__dirname, "index.html");
        if (fs.existsSync(indexPath)) {
          res.writeHead(200, { "Content-Type": "text/html", ...securityHeaders });
          fs.createReadStream(indexPath).pipe(res);
          return;
        }
      }
      res.writeHead(404, { "Content-Type": "text/plain", ...securityHeaders });
      res.end("404 Not Found");
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
