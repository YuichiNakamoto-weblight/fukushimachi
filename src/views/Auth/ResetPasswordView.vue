<!-- src/views/auth/ResetPasswordView.vue -->
 <!-- パスワード再設定 -->
<template>
  <div class="wrap">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main>
        <section class="l-sec mypage-detail">
          <div class="page-title maru">パスワードの再設定</div>

            <div class="form-wrap">
              <div class="inner">

              <!-- 入力フォーム -->
              <section v-if="!done" class="rounded-2xl bg-white shadow p-5">
                <form class="space-y-4" @submit.prevent="onReset">
                  <!-- <div>
                    <label class="block text-sm font-semibold mb-1">メールアドレス</label>
                    <input v-model.trim="email" type="email"
                          class="w-full border rounded-lg px-3 py-2"
                          autocomplete="email" required />
                  </div> -->

                  <div class="form-items">
                    <div class="form-item">
                      <label class="block text-sm font-semibold mb-1">メールに届いた6桁コードを入力してください。</label>
                      <p class="otp-expire">再設定コードの有効期限：{{ mm }}分{{ ss }}秒</p>
                      <input type="text" v-model.trim="code" inputmode="numeric" maxlength="6"
                            class="w-full border rounded-lg px-3 py-2"
                            placeholder="123456" autocomplete="one-time-code" required />
                      <!-- <p class="text-xs text-gray-500 mt-1">メールに届いた6桁コードを入力してください。</p> -->
                    </div>

                    <div class="form-item">
                      <label class="block text-sm font-semibold mb-1">新しいパスワード</label>
                        <div class="input-wrap">
                          <!-- before -->
                          <input :type="showPw ? 'text' : 'password'" v-model="pw"
                                minlength="6"
                                maxlength="100"
                                class="password-input"
                                autocomplete="new-password"
                                required />
                                <button type="button" class="toggle-password"
                                  :aria-pressed="showPw"
                                  :title="showPw ? '非表示にする' : '表示する'"
                                  @click="showPw = !showPw">
                            <!-- eye -->
                            <svg v-if="!showPw" class="icon-eye" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                              <path d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <!-- eye-off -->
                            <svg v-else class="icon-eye-off" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                              <path d="M2 4l18 18-1.5 1.5L17 19.9A12 12 0 0 1 2 12c.6-1.5 1.7-3.1 3.2-4.6L.5 5.5 2 4zm20 8c-.8 2-3 4.8-6.2 6.3l-2.1-2.1a5 5 0 0 0-6-6L5.7 7.2C7.7 6 9.8 5.2 12 5.2c5 0 9 4 10 6.8z"/>
                            </svg>
                          </button>
                        </div>
                        <ul class="note indent">
                          <li>※ 7文字以上で入力してください。</li>
                          <li>※ 半角英字と半角数字を含めてください。</li>
                        </ul>
                    </div>

                    <div class="form-item">
                      <label class="block text-sm font-semibold mb-1">新しいパスワード（確認用）</label>
                      <div class="input-wrap">
                        <input :type="showPw2 ? 'text' : 'password'" v-model="pw2"
                            minlength="6"
                            maxlength="100"
                            class="password-input"
                            autocomplete="new-password" required />
                            <button type="button" class="toggle-password"
                              :aria-pressed="showPw2"
                              :title="showPw2 ? '非表示にする' : '表示する'"
                              @click="showPw2 = !showPw2">
                          <!-- eye -->
                          <svg v-if="!showPw2" class="icon-eye" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                            <path d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <!-- eye-off -->
                          <svg v-else class="icon-eye-off" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                            <path d="M2 4l18 18-1.5 1.5L17 19.9A12 12 0 0 1 2 12c.6-1.5 1.7-3.1 3.2-4.6L.5 5.5 2 4zm20 8c-.8 2-3 4.8-6.2 6.3l-2.1-2.1a5 5 0 0 0-6-6L5.7 7.2C7.7 6 9.8 5.2 12 5.2c5 0 9 4 10 6.8z"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p v-if="msg" :class="ok ? 'text-emerald-600' : 'text-red-600'">{{ msg }}</p>

                    <!-- <button type="submit"
                            class="w-full rounded-full py-3 font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            :disabled="loading">
                      {{ loading ? '更新中…' : 'パスワードを再設定する' }}
                    </button> -->
                    <div class="otp-buttons">
                    <!-- 期限切れ時のみ表示（送信ボタンの上 / 同デザイン系） -->
                    <button
                      v-if="showResend"
                      type="submit"
                      class="w-full rounded-full py-3 font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      :disabled="resending"
                      @click="onResend"
                    >
                      {{ resending ? '再送中…' : '認証コードを再送する' }}
                    </button>

                    <!-- 送信：期限切れ/再送表示中/再送中は無効 -->
                    <button
                      type="submit"
                      class="w-full rounded-full py-3 font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      :disabled="loading || expired || showResend || resending"
                    >
                      {{ loading ? '更新中…' : 'パスワードを再設定する' }}
                    </button>
                  </div>
                  </div>
                </form>

                <div class="btn-back">
                  <a href="#" onclick="history.back()" return="false;=">
                    <span class="ico">
                      <img src="/src/assets/images/common/ico-back.svg">
                    </span>
                    戻る
                  </a>
                </div>
              </section>

              <!-- 完了画面 -->
              <section v-else class="rounded-2xl bg-white shadow p-10 text-center">
                <p class="text-gray-600 mb-6" style="text-align:center">ログイン画面からログインしてください。</p>
                <button
                  type="submit"
                  class="btn-submit maru"
                  @click="$router.push({ name: 'Login' })"
                >
                  ログイン
                </button>
              </section>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
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
            <a href="/seeker/mypage">
            <div class="mypage-link-tmb">
                <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
            </div>
            <span class="mypage-link-txt">マイページ</span>
            </a>
        </div>
        </div>

        <div class="employer-content login-content">
        <div class="mypage-link">
            <a href="/business/mypage">
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
// import { ref } from 'vue'
// import { verifyResetCode, resetPassword } from '@/api/auth'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { verifyResetCode, resetPassword, requestPasswordReset } from '@/api/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

/* URL に ?email=&code= があれば初期セット */
const q = new URLSearchParams(location.search)
const email = ref(String(q.get('email') || ''))
const code  = ref(String(q.get('code')  || ''))

const pw  = ref('')
const pw2 = ref('')

const showPw  = ref(false)
const showPw2 = ref(false)

const msg = ref('')
const ok = ref(false)
const loading = ref(false)
const done = ref(false)
const resending = ref(false)   // 再送中フラグ

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

// === 再送：メール宛に6桁コードを再送（成功したら5分リセット）
async function onResend () {
  if (!email.value || resending.value) return
  msg.value = ''
  resending.value = true
  try {
    await requestPasswordReset(email.value) // /auth/forgot-password を叩く
    startTimer()
  } catch (e) {
    msg.value = e?.response?.data?.error || '認証コードの再送に失敗しました。'
  } finally {
    resending.value = false
  }
}

function validate() {
  if (!email.value || !code.value) {
    msg.value = 'メールアドレスと6桁コードを入力してください。'; return false
  }
  if (pw.value.length < 6 || pw.value.length > 100) {
    msg.value = 'パスワードは6桁以上で入力してください。'; return false
  }
  if (!/[A-Za-z]/.test(pw.value) || !/\d/.test(pw.value)) {
    msg.value = '英字と数字を少なくとも1文字ずつ含めてください。'; return false
  }
  if (pw.value !== pw2.value) {
    msg.value = '確認用パスワードが一致しません。'; return false
  }
  msg.value = ''
  return true
}

async function onReset () {
  if (!validate()) return
  loading.value = true
  ok.value = false
  try {
    // 1) コードの有効性チェック
    await verifyResetCode(email.value, code.value)
    // 2) パスワード更新
    await resetPassword(email.value, code.value, pw.value)
    ok.value = true
    done.value = true           // ← 完了画面に切り替え
  } catch (e) {
    console.error(e)
    msg.value = e?.response?.data?.error || '更新に失敗しました。'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 残り時間 */
.otp-expire{
  margin: 6px 0 10px;
  font-size: 15px;
  color: #374151;
}

/* 再送/送信の縦並びスペース */
.otp-buttons{
  display: flex;
  flex-direction: column;
  gap: 12px;
}
/* === SP: ヘッダー分の上余白を足す === */
@media (max-width: 880px){
  .wrap{
    padding-top: var(--sp-header-h, 64px); /* AppHeader が固定配置の場合の逃し */
  }
  .content > main{
    margin-top: 12px; /* タイトルと被らないよう微調整 */
  }
  .page-title{
    margin-top: 8px;  /* 余白を少しだけ追加（任意） */
  }
}

</style>
