import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change `base` to match your GitHub repository name, e.g.
// if your repo is https://github.com/USERNAME/calisthenics-tracker
// then base should be '/calisthenics-tracker/'
// If you deploy to a USERNAME.github.io root repo, set base to '/'
export default defineConfig({
  plugins: [react()],
  base: '/calisthenics-tracker/',
})
