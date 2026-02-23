// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_')
  // const base = mode === 'production' ? '/app/' : '/'
  const base = '/'

  return {
    base,
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/favicon.ico'],
        devOptions: { enabled: false },
        manifest: {
          id: '/',
          name: 'ふくしま介護福祉　就職情報サイト）',
          short_name: 'ふくしまち',
          start_url: base,
          scope: base,
          // start_url: '/',
          // scope: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#0ea5e9',
          icons: [
            { src: '/icons/fukushim192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/fukushim512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/fukushim192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icons/fukushim512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          importScripts: ['sw-custom.js'],

          // ★ SPA フォールバック先
          // navigateFallback: `${base}index.html`,
          navigateFallback: '/index.html',
          cleanupOutdatedCaches: true,   // ← 旧 /app スコープのSW/キャッシュ掃除に有効

          // ★ フォールバック除外：API と PDF（/app/assets/manual/*.pdf 含む）
          navigateFallbackDenylist: [
            /^\/api\//i,
            // baseに追従（本番: /app/assets/manual/*.pdf）
            new RegExp(`^${base.replace(/\//g, '\\/')}assets\\/manual\\/.*\\.pdf$`, 'i'),
            // 念のため全 .pdf
            /\.pdf$/i,
            /^\/phpmyadmin(\/|$)/i,  // phpMyAdmin は SW のフォールバック対象外
          ],

          // 事前キャッシュ対象（PDFは含めない）
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],

          runtimeCaching: [
            // API は NetworkFirst（5秒でタイムアウト）
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 5 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            // 画像は CacheFirst（14日）
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'img-cache',
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 14 }
              }
            },
            // CSS/JS/worker は SWR
            {
              urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'assets-cache' }
            },
            // 失敗した POST をバックグラウンド再送
            {
              urlPattern: ({ url, request }) => url.pathname.startsWith('/api/') && request.method === 'POST',
              handler: 'NetworkOnly',
              options: {
                backgroundSync: {
                  name: 'api-post-queue',
                  options: { maxRetentionTime: 60 }
                }
              }
            },
            // ★（任意）PDF の個別キャッシュ方針：NetworkFirst
            {
              urlPattern: ({ url }) =>
                url.pathname.startsWith(`${base}assets/manual/`) && url.pathname.endsWith('.pdf'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pdf-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})
