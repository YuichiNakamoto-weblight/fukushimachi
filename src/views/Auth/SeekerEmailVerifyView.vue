<!-- src/views/Auth/SeekerEmailVerifyView.vue -->
 <!-- 求職者用OTP認証ページ -->
<template>
      <body class="is-seeker">
    <div class="wrap">

    <AppHeader />
    <!-- <HamburgerMenu />
    <FooterNav /> -->

  <div class="mx-auto max-w-sm p-6">


    <form class="space-y-4" @submit.prevent="onVerify">
      <div>
        <label class="page-title maru">ワンタイムパスワード確認（求職者用）</label>
      </div>

      <!-- ステップ -->
      <div class="inner singup-lead">
        <div class="signup-step flex">
          <div class="signup-step__step step1">アカウント<br>登録</div>
          <div class="signup-step__step step2 select">ワンタイム<br>パスワード<br>入力</div>
          <div class="signup-step__step step3">プロフィール<br>作成</div>
          <div class="signup-step__step step4">完了</div>
        </div>


      <p>ご登録のメールアドレスに送信されたワンタイムパスワードを入力してください。</p>
      <p class="otp-expire">
        ワンタイムパスワードの有効期限：{{ mm }}分{{ ss }}秒
      </p>
      </div>

      <div class="form-wrap">
        <div class="inner">

      <!-- 期限切れ時のみ「再送信」ボタンを表示（送信ボタンの“上”） -->
      <!-- <button
        v-if="showResend"
        type="button"
        class="w-full rounded py-2 border mb-2"
        :disabled="resending"
        @click="onResend"
      >
        {{ resending ? '再送中...' : 'ワンタイムパスワードを再送信する' }}
      </button> -->

      <div class="form-item">
        <label for="otp">ワンタイムパスワード</label>
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <input
          v-model="code"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          pattern="[0-9]{6}"
          maxlength="6"
          class="w-full border rounded px-3 py-2"
          placeholder=""
          required
          @input="onCodeInput"
        />
      </div>

<!-- ★ ボタン2つを同じラッパーで包む -->
    <div class="otp-buttons">
      <!-- 期限切れ時のみ表示（送信ボタンの“上”） -->
      <button
        v-if="showResend"
        type="submit"
        class="w-full rounded py-2 bg-gray-800 text-white disabled:opacity-50"
        :disabled="resending"
        @click="onResend"
      >
        {{ resending ? '再送中...' : 'ワンタイムパスワードを再送信する' }}
      </button>

      <!-- 送信ボタン -->
      <button
        type="submit"
        class="w-full rounded py-2 bg-gray-800 text-white disabled:opacity-50"
        :disabled="!email || code.length !== 6 || loading || expired || showResend || resending"
      >
        {{ loading ? '認証中...' : 'プロフィール登録へ進む' }}
      </button>
    </div>
  </div>
</div>

      <!-- <button
        type="button"
        class="w-full rounded py-2 border mt-2"
        :disabled="resending"
        @click="onResend"
      >
      </button> -->
    </form>
  </div>
  <AppFooter />
</div>
</body>

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


<script setup>
// --- 追加インポート ---
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// import { verifyOtpByEmail, resendOtpByEmail } from '@/api/auth' // ★ 再送APIもインポート
import { resendOtp as resendOtpByEmail, verifyOtpByEmail } from '@/api/auth'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
// import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
// import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const route = useRoute()
const router = useRouter()
const store = useUserStore()
const auth = useAuthStore()

// 画面遷移時に Register 側から渡された一時情報（存在しなければ空オブジェクト）
const navState = history.state || {} // 例: { password, userId, userType }

const email   = ref(String(route.query.email || store.email || ''))
const code    = ref('')
const error   = ref('')
const loading = ref(false)
const resending = ref(false) // ★ 追加

// === 5分カウントダウン ===
const EXPIRE_SECONDS = 300
const remainingSec = ref(EXPIRE_SECONDS)
let tId = null // JSなので型注釈なし

const expired    = computed(() => remainingSec.value <= 0)
const showResend = computed(() => expired.value && !resending.value)

// mm:ss 表示（分はゼロ詰め不要、秒のみゼロ詰め）
const mm = computed(() => Math.floor(remainingSec.value / 60))
const ss = computed(() => String(remainingSec.value % 60).padStart(2, '0'))

function startTimer () {
  stopTimer()
  remainingSec.value = EXPIRE_SECONDS
  tId = window.setInterval(() => {
    if (remainingSec.value > 0) {
      remainingSec.value -= 1
    } else {
      stopTimer()
    }
  }, 1000)
}

function stopTimer () {
  if (tId !== null) {
    clearInterval(tId)
    tId = null
  }
}

onMounted(() => { startTimer() })
onBeforeUnmount(() => { stopTimer() })

// === 再送 ===
async function onResend () {
  if (!email.value || resending.value) return
  error.value = ''
  resending.value = true
  try {
    await resendOtpByEmail(email.value) // プロジェクトのAPI名に合わせてOK
    // 成功：カウンターをリセットして再開
    startTimer()
  } catch (e) {
    error.value = e?.response?.data?.error || 'ワンタイムパスワードの再送に失敗しました。'
  } finally {
    resending.value = false
  }
}

/* 入力ユーティリティ：全角→半角 & 非数字除去 */
function toHalfWidthDigits (s) {
  return s
    .replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\D/g, '')
}

/* 6桁上限のクレンジング */
function onCodeInput (e) {
  code.value = toHalfWidthDigits(e.target.value).slice(0, 6)
}

/* 認証フロー */
async function onVerify () {
  error.value = ''
  if (!email.value) { error.value = 'メールアドレスが見つかりません。'; return }
  if (code.value.length !== 6) { error.value = '半角数字6桁を入力してください。'; return }

  loading.value = true
  try {
    // 1) OTP検証
    await verifyOtpByEmail(email.value, code.value)

    // 2) 可能なら自動ログイン
    let loggedIn = false
    if (navState?.password) {
      try {
        loggedIn = await auth.login(email.value, navState.password)
    } catch {
        loggedIn = false
      }
    }

    // 3) フォールバック保存
    if (!loggedIn && navState?.userId) {
      try {
        if (!auth.user) {
          auth.user = {
            id: navState.userId,
            email: email.value,
            role: store.userType || navState.userType || undefined,
          }
        }
        if (typeof auth.saveToStorage === 'function') {
          auth.saveToStorage()
        }
      } catch { /* noop */ }
    }

    // 4) 遷移（求職者）
    const uid = String(auth.user?.id || navState.userId || route.query.uid || '') || undefined
    try {
      if (auth.user) auth.user.role = 'seeker'
      localStorage.setItem('userType', 'seeker')
    } catch { /* noop */ }

    router.replace({ name: 'SeekerProfile', query: uid ? { uid } : undefined })
  } catch (e) {
    error.value = e?.response?.data?.error || '認証に失敗しました。'
  } finally {
    loading.value = false
  }
}
</script>



<style scoped>
.container { max-width:560px; margin:40px auto; padding:0 16px; }
.title { font-size:22px; margin-bottom:12px; }
.actions { display:flex; gap:8px; margin-top:16px; }
.btn { background:#333; color:#fff; border:none; padding:10px 14px; border-radius:6px; }
.btn-outline { background:#fff; color:#333; border:1px solid #333; padding:10px 14px; border-radius:6px; }
.error { color:#c0392b; margin-top:8px; }
.ok { color:#16a34a; margin-top:8px; }
.text-red-600 {color: #ff1c02;}

.otp-expire{
  margin-top: 6px;
  margin-bottom: 8px;
  font-size: 18px;
  color: #374151; /* gray-700 */
}

/* 2つのボタンに一定の縦スペースを確保 */
.otp-buttons{
  display: flex;
  flex-direction: column;
  gap: 12px;        /* ← ここをお好みで (8〜16px など) */
}

</style>


