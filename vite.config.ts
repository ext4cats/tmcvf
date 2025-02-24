import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'node:path';
import * as url from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  appType: 'mpa',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        404: path.resolve(__dirname, '404.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg'],
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
