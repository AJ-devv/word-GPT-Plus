import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // ✅ This is CRITICAL so Netlify uses relative paths
  server: {
    port: 3000,
    https:
      process.env.NETLIFY !== 'true'
        ? {
            key: fs.readFileSync('./localhost-key.pem'),
            cert: fs.readFileSync('./localhost.pem')
          }
        : undefined
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
