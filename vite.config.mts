import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    vue(),
  ],
  resolve: {
    alias: {
      // '@' が 'frontend/src' を指すように設定
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
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
