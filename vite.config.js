import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      manifest: {
        name: 'Weather App',
        short_name: 'Weather',
        description: 'A responsive weather application with PWA support',
        theme_color: '#42b549',
        background_color: '#ffffff',
        display: 'standalone',
        icon: 'src/assets/icon.png'
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
})