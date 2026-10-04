import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// On Vercel, base is root '/'. On GitHub Pages, base is '/gsfcugottalent/'.
const isVercel = Boolean(process.env.VERCEL);
const isGitHubPages = !isVercel && Boolean(process.env.GITHUB_ACTIONS || process.env.GITHUB_PAGES || process.env.VITE_BASE_PATH);

// Dynamically use repo name from GitHub Actions (e.g. 'GSFCU_GOT_TALENT'), or custom base, or fallback to '/GSFCU_GOT_TALENT/'
const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/GSFCU_GOT_TALENT/';
const basePath = process.env.VITE_BASE_PATH || (isGitHubPages ? repoName : '/');

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
})

