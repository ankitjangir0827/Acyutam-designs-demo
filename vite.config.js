import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

function copyStaticFoldersPlugin() {
  return {
    name: 'copy-static-folders',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      const folders = ['home', 'fonts', 'icons', 'media'];
      folders.forEach(folder => {
        const src = resolve(__dirname, folder);
        const dest = resolve(distDir, folder);
        if (fs.existsSync(src)) {
          try {
            fs.cpSync(src, dest, { recursive: true, force: true });
          } catch (e) {
            console.warn('Warning copying folder:', folder, e.message);
          }
        }
      });

      try {
        const rootFiles = fs.readdirSync(__dirname).filter(f => 
          /\.(jpg|jpeg|png|webp|svg|ico|mp4|otf|woff2)$/i.test(f)
        );
        rootFiles.forEach(file => {
          const src = resolve(__dirname, file);
          const dest = resolve(distDir, file);
          try {
            fs.copyFileSync(src, dest);
          } catch (e) {
            console.warn('Warning copying file:', file, e.message);
          }
        });
      } catch (err) {
        console.warn('Warning reading root files:', err.message);
      }

      console.log('✅ Successfully copied all static media folders to dist/');
    }
  };
}

export default defineConfig({
  root: './',
  plugins: [copyStaticFoldersPlugin()],
  css: {
    postcss: false,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        residential: resolve(__dirname, 'residential.html'),
        industrial: resolve(__dirname, 'industrial.html'),
        commercial: resolve(__dirname, 'commercial.html'),
        assembly: resolve(__dirname, 'assembly.html'),
        careers: resolve(__dirname, 'careers.html'),
        business: resolve(__dirname, 'business.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: false,
    },
  },
});
