<!-- src/views/settings/SeekerNoticePush.vue -->
<!-- 求職者：プッシュ通知 -->
<script setup>
import { reactive, computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import PrefRow from '@/components/PrefRow.vue'
import { useAuthLocal } from '@/stores/authLocal'
import { fetchPushPrefs, savePushPref } from '@/api/notifications'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const m = reactive({
  // ▼ master（このブラウザでプッシュ通知を受け取るか）
  master_push_enabled: false,

  // ▼ 個別（seeker / push）
  good_target_update:  false,
  talk_received:       false,
  clip_target_update:  false,
  news_new_job:        false,
  news_new:           false,
  news_update:         false,
  news_feature_update: false,
  news_feature_new:   false,
})

const auth = useAuthLocal()
auth.restore()
const userId = auth.userId

// ===== Push サポート＆状態 =====
const pushSupported = computed(() =>
  'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
)
const permission = computed(() => (pushSupported.value ? Notification.permission : 'unsupported'))

onMounted(async () => {
  // ① メール通知と同じ：個別設定の読み込み
  if (userId) {
    try {
      const items = await fetchPushPrefs('seeker', userId) // {pref_key, enabled:0|1}[]
      items.forEach(({ pref_key, enabled }) => {
        if (Object.prototype.hasOwnProperty.call(m, pref_key)) {
          m[pref_key] = !!enabled // 1→true, 0→false
        }
      })
    } catch (e) {
      console.error('fetchPushPrefs failed:', e)
    }
  }

  // ② マスター状態（既存購読＋権限）を反映
  if (pushSupported.value) {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      m.master_push_enabled = !!sub && Notification.permission === 'granted'
    } catch (e) {
      console.warn('Push init check failed:', e)
    }
  }
})

// ③ userId が遅れて入るケースをフォロー（1回だけ）
watch(() => auth.userId, async (id, prev) => {
  if (!prev && id) {
    const items = await fetchPushPrefs('seeker', id)
    items.forEach(({ pref_key, enabled }) => {
      if (Object.prototype.hasOwnProperty.call(m, pref_key)) {
        m[pref_key] = !!enabled
      }
    })
  }
}, { immediate: false })

// ====== EnablePushButton と同じ実装（購読作成/解除 & サーバ同期） ======
const VAPID_PUBLIC = import.meta.env.VITE_VAPID_PUBLIC || import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const arr = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i)
  return arr
}

function ensureSupported () {
  return ('Notification' in window) && ('serviceWorker' in navigator) && ('PushManager' in window)
}

// EnablePushButton と同様：既存のSW登録がある前提で ready を待つだけ
async function ensureSW () {
  return await navigator.serviceWorker.ready
}

/** マスターON/OFF切替：購読の作成/解除＆サーバ登録/削除 */
async function onToggleMaster (nextVal) {
  if (!ensureSupported()) {
    alert('このブラウザはプッシュ通知に対応していません。')
    m.master_push_enabled = false
    return
  }
  if (!userId) {
    alert('ログインが必要です。')
    m.master_push_enabled = false
    return
  }

  if (nextVal) {
    // === ON: 許可 → SW ready → subscribe → /api/push/subscribe ===
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') {
      if (perm === 'denied') {
        alert('通知がブラウザで拒否されています。ブラウザ設定から許可に変更してください。')
      }
      m.master_push_enabled = false
      return
    }
    try {
      const reg = await ensureSW()
      let sub = await reg.pushManager.getSubscription()
      if (!sub) {
        if (!VAPID_PUBLIC) throw new Error('VITE_VAPID_PUBLIC（または VITE_VAPID_PUBLIC_KEY）が未設定です')
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
        })
      }
      // ★ テスト版と同じエンドポイント
      await axios.post('/api/push/subscribe', { subscription: sub, userId })
      m.master_push_enabled = true
    } catch (e) {
      console.error('[push] enable failed:', e)
      alert('プッシュ通知の有効化に失敗しました。時間をおいて再度お試しください。')
      m.master_push_enabled = false
    }
  } else {
    // === OFF: /api/push/unsubscribe → unsubscribe() ===
    try {
      const reg = await ensureSW()
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        try {
          await axios.post('/api/push/unsubscribe', { endpoint: sub.endpoint, userId })
        } catch (e) {
          // サーバ側未登録でも購読解除は続行
          console.warn('[push] server unsubscribe failed (continue):', e)
        }
        await sub.unsubscribe()
      }
      m.master_push_enabled = false
    } catch (e) {
      console.error('[push] disable failed:', e)
      alert('プッシュ通知の無効化に失敗しました。')
      m.master_push_enabled = false
    }
  }
}

// ===== 個別トグル保存（channel: 'push'） =====
async function onToggle(key, nextVal) {
  if (!userId) { m[key] = !nextVal; return }
  const prev = m[key]
  m[key] = nextVal
  try {
    await savePushPref('seeker', key, nextVal, userId)
  } catch (e) {
    m[key] = prev
    console.error('savePushPref failed:', e)
  }
}

// ===== スマホでヘッダーに隠れないための対策 =====
const headerH = ref(72) // 初期値（描画後に実測で上書き）
function updateHeaderHeight () {
  const headerEl =
    document.querySelector('[data-app-header]') ||
    document.querySelector('header')
  if (!headerEl) return
  const h = Math.round(headerEl.getBoundingClientRect().height)
  if (h > 0) {
    headerH.value = h
    document.documentElement.style.setProperty('--header-height', `${h}px`)
  }
}
onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})

</script>

<template>
  <div class="wrap">

    <AppHeader data-app-header />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main>
        <div class="l-sec">
          <div class="page-title maru">プッシュ通知</div>
          <p class="note">オフにすると通知されません</p>
          <div class="inner">
            <!-- ▼ マスター切替 -->
            <section class="group">
              <h3>プッシュ通知</h3>
              <PrefRow
                label="このブラウザでプッシュ通知を受け取る"
                v-model="m.master_push_enabled"
                @changed="val => onToggleMaster(val)"
              />
              <p class="hint">
                <template v-if="!pushSupported">このブラウザはプッシュ通知に対応していません。</template>
                <template v-else-if="permission === 'denied'">ブラウザ設定で通知が拒否されています。許可に変更してください。</template>
                <template v-else-if="permission === 'default'">ONにすると通知許可ダイアログが表示されます。</template>
                <!-- <template v-else>通知は許可されています。</template> -->
              </p>
            </section>

            <!-- ▼ 個別設定 -->
            <section class="group">
              <h3>グッド</h3>
              <PrefRow
                label="グッドを押した事業者の更新"
                v-model="m.good_target_update"
                @changed="val => onToggle('good_target_update', val)"
              />
            </section>

            <section class="group">
              <h3>トーク</h3>
              <PrefRow
                label="事業者からトークが届く"
                v-model="m.talk_received"
                @changed="val => onToggle('talk_received', val)"
              />
            </section>

            <section class="group">
              <h3>クリップ</h3>
              <PrefRow
                label="クリップした事業者の更新"
                v-model="m.clip_target_update"
                @changed="val => onToggle('clip_target_update', val)"
              />
            </section>

            <section class="group">
              <h3>お知らせ</h3>
              <PrefRow
                label="新規求人情報"
                v-model="m.news_new_job"
                @changed="val => onToggle('news_new_job', val)"
              />
              <PrefRow
                label="新着NEWS情報の更新"
                v-model="m.news_update"
                @changed="val => onToggle('news_update', val)"
              />
              <PrefRow
                label="新規特集記事"
                v-model="m.news_feature_update"
                @changed="val => onToggle('news_feature_update', val)"
              />
            </section>

            <button class="back" @click="$router.back()">
              <span class="circle">←</span><span>戻る</span>
            </button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
      <PcModel />
  </div>

  <!-- <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt>
  </div>

  <div class="hero-copy pc">
    <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo user-content">
      <a href="/user">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo employer-content">
      <a href="/employer">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>
  </div>

  <div class="pc">
    <div class="user-content login-content">
      <div class="mypage-link">
        <a href="/user/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <a href="/employer/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>
  </div> -->
    <PcModel />
</template>


<style scoped>
.title{text-align:center;font-size:22px;font-weight:700;margin-bottom:24px;}
.group{margin:24px 0;} .group h3{font-weight:700;margin:0 0 8px;}
.back{margin-top:24px;display:flex;align-items:center;gap:10px;border:none;background:none;cursor:pointer;}
.circle{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#ff0;}
.note{margin:-8px 0 12px;font-size:13px;color:#666;text-align:right;}
.hint{margin:4px 0 0;font-size:12px;color:#888;}

/* ▼ スマホでヘッダーに隠れないよう .content を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* JSで実測値に置き換わります */
  .content{
    padding-top: var(--header-height);
  }
  /* 先頭セクションの上マージン相殺を予防（保険） */
  .content > main > .l-sec:first-child{
    margin-top: 0;
  }
}
</style>
