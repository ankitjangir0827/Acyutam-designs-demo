import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy HTML, JS, JSON, WEBM, CSS files from root to public
const filesToCopy = fs.readdirSync(rootDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return (
    ext === '.html' ||
    ext === '.js' ||
    ext === '.cjs' ||
    ext === '.json' ||
    ext === '.webm' ||
    ext === '.png' ||
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

console.log('Static assets synced to public/ folder successfully!');
