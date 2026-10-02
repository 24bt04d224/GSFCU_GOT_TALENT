import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// On Vercel, base is root '/'. On GitHub Pages, base is '/GSFCU_GOT_TALENT/'.
const isGitHubPages = Boolean(process.env.GITHUB_ACTIONS || process.env.GITHUB_PAGES);

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/GSFCU_GOT_TALENT/' : '/',
  plugins: [react(), tailwindcss()],
})

