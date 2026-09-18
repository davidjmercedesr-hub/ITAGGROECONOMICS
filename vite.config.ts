import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  base: isGitHubPages ? '/KlarblattVisite/' : './',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8787', '/health': 'http://localhost:8787' } },
  build: { outDir: 'dist' }
});