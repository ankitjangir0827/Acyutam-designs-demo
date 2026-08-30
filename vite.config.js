import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

function copyStaticFoldersPlugin() {
  return {
    name: 'copy-static-folders',
    closeBundle() {
      const folders = ['home', 'fonts', 'icons', 'media'];
      folders.forEach(folder => {
        const src = resolve(__dirname, folder);
        const dest = resolve(__dirname, 'dist', folder);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      });
      // Copy root media files
      const rootFiles = fs.readdirSync(__dirname).filter(f => 
        /\.(jpg|jpeg|png|webp|svg|ico|mp4|otf|woff2)$/i.test(f)
      );
      rootFiles.forEach(file => {
        const src = resolve(__dirname, file);
        const dest = resolve(__dirname, 'dist', file);
        fs.copyFileSync(src, dest);
      });
      console.log('✅ Successfully copied all static media folders (home, fonts, icons, media) to dist/');
    }
  };
}

export default defineConfig({
  root: './',
  plugins: [copyStaticFoldersPlugin()],
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
  },
});
