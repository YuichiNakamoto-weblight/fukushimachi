<!-- src/views/settings/AccountOtpVerifyView.vue-->
 <!-- OTP（ワンタイムパスワード）を入力し、認証を行う -->
<template>
  <div class="wrap is-guest">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec signup-detail">
        <div class="page-title maru">再設定コード認証</div>

        <div class="form-wrap">
          <div class="inner">
            <form @submit.prevent="verifyOtp">
              <div class="form-item">
                <label for="otp" class="form-label">再設定コードをメールに送信しました</label>
                <p class="otp-expire">再設定コードの有効期限：{{ mm }}分{{ ss }}秒</p>
                <input
                  id="otp"
                  v-model="otp"
                  type="text"
                  maxlength="6"
                  class="form-control"
                  placeholder="6桁のコード"
                  required
                />
              </div>

              <div class="form-btn-item">
                <button type="submit" class="btn btn-primary maru" :disabled="loading">
                  {{ loading ? '確認中…' : '認証して次へ' }}
                </button>
              </div>

              <div v-if="error" class="form-error">{{ error }}</div>
            </form>

            <div class="form-resend">
              <p>コードが届かない場合は、以下を確認してください</p>
              <ul>
                <li>・迷惑メールフォルダをご確認ください</li>
                <li>・メール受信設定をご確認ください</li><br>
              </ul>
            </div>
            <div class="form-btn-item">
              <button type="submit" @click="resendOtp" class="btn btn-primary maru" :disabled="loading">
                  認証コードを再送する
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>

  <div class="body-bg pc">
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
  </div>
    <PcModel />
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter,useRoute  } from 'vue-router'
import { http } from '@/api/http'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const route = useRoute()
// const email = route.query.email || ''
const email = String(route.query.email || '')

const otp = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

// === 5分カウントダウン（表示のみ）===
const EXPIRE_SECONDS = 300
const remainingSec = ref(EXPIRE_SECONDS)
let tId = null
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
+onMounted(() => startTimer())
+onBeforeUnmount(() => stopTimer())

const verifyOtp = async () => {
  loading.value = true
  error.value = ''

  try {
   const { data } = await http.post('/auth/verify-email-change-otp', {
     email,
     otp: otp.value
   })
   console.log('ユーザーID:', data.userId)
   if (data.token || data.userId) {
     router.push({ name: 'AccountChangeEmailInput', query: { email, userId: data.userId } })
    } else {
      error.value = '認証に失敗しました。'
    }
  } catch (e) {
      console.log('受信したメール：',email)
      console.log('受信したOTP:',otp.value)
    error.value = e.response?.data?.error || '認証に失敗しました。'
  } finally {
    loading.value = false
  }
}


const resendOtp = async () => {
  loading.value = true
  error.value = ''
  try {
    // await http.post('/request-email-change')
    // await http.post('/request-email-change', { email })
    // await http.post('/auth/request-email-change-otp', { email })
    await http.post('/auth/request-email-change', { email })
    // alert('認証コードを再送信しました。')
    // 再送成功 → カウントダウンを5分にリセット
    startTimer()
  } catch (e) {
    console.log(e)
    error.value = '再送信に失敗しました。'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-error {
  color: red;
  margin-top: 10px;
}

.form-resend {
  margin-top: 20px;
  font-size: 0.9em;
}

.otp-expire{
  margin: 6px 0 8px;
  font-size: 16px;
  color: #374151;
}
/* === SP: ヘッダー分の上余白を足す === */
@media (max-width: 880px){
  .wrap{
    padding-top: var(--sp-header-h, 64px); /* 固定ヘッダーの重なり回避 */
  }
  main{
    margin-top: 12px; /* タイトルとの間を少し空ける（任意） */
  }
  .page-title{
    margin-top: 8px;
  }
}

</style>
