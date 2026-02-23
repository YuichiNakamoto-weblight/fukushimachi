<!-- src/views/Auth/BusinessEmailVerifyView -->
<!-- 事業者用OTP認証ページ -->
<template>
  <body class="is-employer">
    <div class="wrap">
      <AppHeader />
      <!-- <HamburgerMenu />
      <FooterNav /> -->

      <div class="mx-auto max-w-sm p-6">
        <form class="space-y-4" @submit.prevent="onVerify">
          <div>
            <label class="page-title maru">ワンタイムパスワード確認（事業者用）</label>
          </div>

          <div class="inner singup-lead">
            <div class="signup-step flex">
              <div class="signup-step__step step1">アカウント<br>登録</div>
              <div class="signup-step__step step2 select">ワンタイム<br>パスワード<br>入力</div>
              <div class="signup-step__step step3">プロフィール<br>作成</div>
              <div class="signup-step__step step4">完了</div>
            </div>

            <p>ご登録のメールアドレスに送信されたワンタイムパスワードを入力してください。</p>
            <p class="otp-expire">ワンタイムパスワードの有効期限：{{ mm }}分{{ ss }}秒</p>
          </div>

          <div class="form-wrap">
            <div class="inner">
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
                  required
                  @input="onCodeInput"
                />
              </div>

              <!-- 旧ボタンは“ボタン要素だけ”コメントアウト -->
              <!--
              <button
                type="submit"
                class="w-full rounded py-2 bg-gray-800 text-white disabled:opacity-50"
                :disabled="!email || code.length !== 6 || loading"
              >
                {{ loading ? '認証中...' : 'プロフィール登録へ進む' }}
              </button>
              -->

              <!-- ★ ここを追加：2ボタンを同ラッパーに -->
              <div class="otp-buttons">
                <button
                  v-if="showResend"
                  type="submit"
                  class="w-full rounded py-2 bg-gray-800 text-white disabled:opacity-50"
                  :disabled="resending"
                  @click="onResend"
                >
                  {{ resending ? '再送中...' : 'ワンタイムパスワードを再送信する' }}
                </button>

                <button
                  type="submit"
                  class="w-full rounded py-2 bg-gray-800 text-white disabled:opacity-50"
                  :disabled="!email || code.length !== 6 || loading || expired || showResend || resending"
                >
                  {{ loading ? '認証中...' : 'プロフィール登録へ進む' }}
                </button>
              </div>
            </div> <!-- /.inner -->
          </div>   <!-- /.form-wrap -->
        </form>
      </div>

      <AppFooter />
    </div>
  </body>
</template>



<script setup>
/**
 * EmailVerifyView.vue（認証コード入力画面）
 * 目的：
 *  - 入力された 6 桁 OTP をサーバに検証させる
 *  - 成功したら「同デバイスでは以後のログイン入力を省略」できるように、
 *    可能ならここで一度だけ /auth/login を実行して Cookie を取得（＝自動ログイン状態）
 *  - もしパスワードが無く自動ログインできない場合でも、最小限のユーザー情報を
 *    localStorage に保存し、次回起動時の UI 復元を早くする（※認証は /auth/me 等で最終判断）
 *
 * 前提：
 *  - 登録画面から遷移する際に history.state に { password, userId, userType } を渡しておくと、
 *    ここで1回だけ auth.login(email, password) を実行できる（Cookie付与）
 *  - パスワードは localStorage には保存しない（history.state はタブ内一時メモリ）
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { verifyOtpByEmail, resendOtp as resendOtpByEmail } from '@/api/auth'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
// ★ 自動ログイン＆ローカル保存のために認証ストアを利用
import { useAuthStore } from '@/stores/auth'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
// import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
// import FooterNav from '@/components/layout/FooterNav.vue'
// import PcModel from '@/components/layout/PcModel.vue'

const route = useRoute()
const router = useRouter()
const store = useUserStore()
const auth = useAuthStore()

// 画面遷移時に Register 側から渡された一時情報（存在しなければ空オブジェクト）
const navState = history.state || {} // 例: { password: '******', userId: 123, userType: 'seeker' }

const email = ref(String(route.query.email || store.email || ''))
const code = ref('')
const error = ref('')
const loading = ref(false)
const resending = ref(false)

// === 5分カウントダウン ===
const EXPIRE_SECONDS = 300
const remainingSec = ref(EXPIRE_SECONDS)
let tId = null
const expired    = computed(() => remainingSec.value <= 0)
const showResend = computed(() => expired.value && !resending.value)
const mm = computed(() => Math.floor(remainingSec.value / 60))
const ss = computed(() => String(remainingSec.value % 60).padStart(2, '0'))

function startTimer () {
  stopTimer()
  remainingSec.value = EXPIRE_SECONDS
  tId = window.setInterval(() => {
    if (remainingSec.value > 0) remainingSec.value -= 1
    else stopTimer()
  }, 1000)
}
function stopTimer () {
  if (tId !== null) { clearInterval(tId); tId = null }
}

onMounted(() => startTimer())
onBeforeUnmount(() => stopTimer())

// === 再送 ===
async function onResend () {
  if (!email.value || resending.value) return
  error.value = ''
  resending.value = true
  try {
    await resendOtpByEmail(email.value)  // /auth/resend-otp を叩く（既存API）
    startTimer()                         // 成功で5分リセット
  } catch (e) {
    error.value = e?.response?.data?.error || 'ワンタイムパスワードの再送に失敗しました。'
  } finally {
    resending.value = false
  }
}

/**
 * 入力ユーティリティ：
 * - 全角数字を半角化
 * - 数字以外を除去
 */
function toHalfWidthDigits(s) {
  return s
    .replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\D/g, '')
}

/**
 * 6 桁上限のバインド（input のたびにクリーンアップ）
 */
function onCodeInput(e) {
  code.value = toHalfWidthDigits(e.target.value).slice(0, 6)
}

/**
 * 認証フロー：
 * 1) 入力バリデーション
 * 2) /auth/verify-otp に email + otp を送って検証
 * 3) 成功したら可能なら一度だけ /auth/login を実施（Cookie取得）
 *    - history.state.password があるときのみ（localStorage には保存しない）
 * 4) 最後にダッシュボードへ遷移
 */
async function onVerify() {
  error.value = ''
  if (!email.value) { error.value = 'メールアドレスが見つかりません。'; return }
  if (code.value.length !== 6) { error.value = '半角数字6桁を入力してください。'; return }

  loading.value = true
  try {
    // 2) OTP 検証
    await verifyOtpByEmail(email.value, code.value)

    // 3) 自動ログイン：password が共有されていればこの場で1回だけ /auth/login
    //    （Cookieを付与できれば以降の入力を省略できる）
    let loggedIn = false
    if (navState?.password) {
      try {
        loggedIn = await auth.login(email.value, navState.password)
      } catch {
        // 失敗しても後続にフォールバック（localStorage 最小保存 → ダッシュボード）
        loggedIn = false
      }
    }

    // 3') フォールバック：
    //  - 自動ログインできなかったが、最小ユーザー情報が分かるなら localStorage に保存
    //  - 保存は auth ストアの API があればそれを利用（無ければ安全にスキップ）
    if (!loggedIn && navState?.userId) {
      try {
        // auth.user が存在しない場合のみ最小情報を設定（パスワードは保存しない）
        if (!auth.user) {
          auth.user = {
            id: navState.userId,
            email: email.value,
            // 役割として userType を使う場合
            role: store.userType || navState.userType || undefined,
          }
        }
        // saveToStorage が定義されていれば localStorage に保存（存在チェック付き）
        if (typeof auth.saveToStorage === 'function') {
          auth.saveToStorage()
        } else {
          // 最低限の保険：独自保存キーを使う必要がある場合はストア側に実装してください
          // localStorage.setItem('auth_user_v1', JSON.stringify(auth.user))
        }
      } catch {
        /* 失敗しても致命ではないため握りつぶす */
      }
    }

  // 4) 遷移先：事業者専用 → 常に BusinessProfile へ
  const uid =
    String(auth.user?.id || navState.userId || route.query.uid || '') || undefined

  // 事業者として扱うことを明示（任意・推奨：後続フローのため）
  try {
    if (auth.user) auth.user.role = 'employer'
    localStorage.setItem('userType', 'employer')
  } catch {console.log}

  router.replace({ name: 'BusinessProfile', query: uid ? { uid } : undefined })
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

/* 追記（scoped の末尾でOK） */
.otp-expire{
  margin-top: 6px;
  margin-bottom: 8px;
  font-size: 18px;
  color: #374151;
}
.otp-buttons{
  display: flex;
  flex-direction: column;
  gap: 12px; /* ボタン間の縦スペース */
}

</style>


