import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import { createUserPersistPlugin } from './plugins/persist-user'
import '@/assets/site.css'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)

// 1) Pinia を作成して、まずプラグインを登録
const pinia = createPinia()
pinia.use(createUserPersistPlugin({
  key: 'user',                 // 保存キー
  storage: localStorage,       // 例: sessionStorage に変えてもOK
  paths: ['userId', 'userType', 'email', 'emailVerified'],
}))

// 2) 先に app へ Pinia を注入
app.use(pinia)

// 3) その後でストアを使う（ここが重要）
const auth = useAuthStore()
// 起動時に端末保存を即反映（UIを早く出す）
auth.loadFromStorage()
// サーバセッション（Cookie）が生きているかを裏で確認（awaitしない）
auth.me()

// 4) ルーター注入 → マウント
app.use(router)
app.mount('#app')

const updateSW = registerSW({
  onNeedRefresh() {
    // ここで UI を出す（例：簡易confirm）
    if (confirm('新しいバージョンがあります。今すぐ更新しますか？')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.info('このアプリはオフラインでも利用できます。')
  }
})

navigator.serviceWorker?.addEventListener('message', (e: MessageEvent) => {
  if (e.data?.type === 'OPEN_URL' && e.data?.url) {
    router.push(e.data.url)        // 例: /app/talks に遷移
  }
})
