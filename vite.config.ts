import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/treedex/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Registered explicitly in main.tsx so a detected update triggers an
      // actual reload — the default injected script only calls register()
      // with no update/reload handling.
      injectRegister: false,
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'TreeDex',
        short_name: 'TreeDex',
        description: 'Catch and collect Chicago-area trees.',
        theme_color: '#f4efe3',
        background_color: '#f4efe3',
        display: 'standalone',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: {
        // Never cache the Pl@ntNet API or the Wikipedia photo lookups — only the app shell.
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
})
