import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');

if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(publicDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy HTML, JS, JSON, WEBM, CSS, images, etc. from root to public
const filesToCopy = fs.readdirSync(rootDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return (
    ext === '.html' ||
    ext === '.css' ||
    ext === '.js' ||
    ext === '.cjs' ||
    ext === '.json' ||
    ext === '.webm' ||
    ext === '.mp4' ||
    ext === '.png' ||
    ext === '.jpg' ||
    ext === '.jpeg' ||
    ext === '.webp'
  ) && file !== 'package.json' && file !== 'package-lock.json' && file !== 'tsconfig.json';
});

console.log('Copying static assets to public/ folder for Vercel deployment...');

for (const file of filesToCopy) {
  const srcPath = path.join(rootDir, file);
  const destPath = path.join(publicDir, file);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied ${file} -> public/${file}`);
  } catch (err) {
    console.error(`  ✗ Error copying ${file}:`, err);
  }
}

// Copy photos_and_videos directory to public/
const mediaSrc = path.join(rootDir, 'photos_and_videos');
if (fs.existsSync(mediaSrc)) {
  const mediaDest = path.join(publicDir, 'photos_and_videos');
  copyRecursiveSync(mediaSrc, mediaDest);
  console.log('  ✓ Copied photos_and_videos -> public/photos_and_videos');
}

console.log('Static assets synced to public/ folder successfully!');

