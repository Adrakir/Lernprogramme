import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {viteSingleFile} from 'vite-plugin-singlefile';
import {fileURLToPath} from 'node:url';
// Baut MatheKompass als eine einzige, offline nutzbare HTML-Datei.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {alias: {'@': fileURLToPath(new URL('.', import.meta.url))}},
  build: {outDir: fileURLToPath(new URL('./offline-build/dist', import.meta.url)), emptyOutDir: true, chunkSizeWarningLimit: 4000}
});
