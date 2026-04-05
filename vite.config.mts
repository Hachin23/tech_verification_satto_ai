import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Satto AI 〜 「もっといい感じ」を、その場で解決。 〜',
        short_name: 'Satto AI',
        description: 'AI師匠による写真診断',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // 後でpublicに配置
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0', // コンテナ外からのアクセスを許可
    port: 3036,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: 'localhost', // ブラウザからは localhost としてアクセスさせる
      port: 3036
    },
    // Docker環境でのファイル変更検知を確実にするための設定
    watch: {
      usePolling: true,
    }
  }
})
