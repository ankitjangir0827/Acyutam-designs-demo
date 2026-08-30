import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
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
        achyutam: resolve(__dirname, 'achyutam.html'),
        business: resolve(__dirname, 'business.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
