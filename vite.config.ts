import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  base: isGitHubPages ? '/KlarblattVisite/' : './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    https: {
      key: 'certs/localhost-key.pem',
      cert: 'certs/localhost-cert.pem'
    },
    proxy: { '/api': 'http://localhost:8787', '/health': 'http://localhost:8787' }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    https: {
      key: 'certs/localhost-key.pem',
      cert: 'certs/localhost-cert.pem'
    }
  },
  build: { outDir: 'dist' }
});