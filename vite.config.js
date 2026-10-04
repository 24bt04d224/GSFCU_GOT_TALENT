import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// On Vercel, base is root '/'. On GitHub Pages, base is '/gsfcugottalent/'.
const isVercel = Boolean(process.env.VERCEL);
const isGitHubPages = !isVercel && Boolean(process.env.GITHUB_ACTIONS || process.env.GITHUB_PAGES || process.env.VITE_BASE_PATH);

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/gsfcugottalent/' : '/',
  plugins: [react(), tailwindcss()],
})

