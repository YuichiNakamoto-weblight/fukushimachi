<!-- src/views/settings/AccountSettingView.vue -->
 <!-- メールアドレス・パスワードの再設定 -->
 <template>
  <div class="wrap">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec signup-detail">
        <div class="page-title maru">メールアドレス・パスワード設定</div>

        <div class="form-wrap">
          <div class="inner">
            <div class="form-items">
              <div class="form-item">
                <label for="user_new_email" style="text-align:center">現在のメールアドレス</label>
                <p class="form-text"  style="text-align:center">{{ email }}</p>
              </div>
<a>「変更する」ボタンを押すと現在のメールアドレス宛に</a><br>
<a>ワンタイムパスワードが送信されます。</a><br>
              <div class="form-btn-item">
                <div v-if="error" class="error">{{ error }}</div>
                  <button @click="sendEmailOtp" type="submit" class="btn-submit maru">メールアドレスを変更する</button>
              </div>
              <!-- ▼ 追加：パスワード変更ボタン -->
              <div class="form-btn-item">
                <div v-if="pwMsg" :class="['msg', pwOk ? 'ok' : 'error']">{{ pwMsg }}</div>
                <button
                  @click="sendPasswordReset"
                  type="submit"
                  class="btn-submit maru"
                  :disabled="pwLoading"
                >
                  {{ pwLoading ? '送信中…' : 'パスワードを変更する' }}
                </button>
              </div>
              <!-- ▲ 追加ここまで -->
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/http'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const email = ref('')
const userId = localStorage.getItem('userId')
const error = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    const { data } = await http.get('/auth/user-profile', {
      params: { userId }
    })
    email.value = data.email
    console.log('ユーザー情報:', data)
  } catch (e) {
    console.error('ユーザー情報の取得に失敗しました', e)
  }
})

// メールアドレス変更
const sendEmailOtp = async () => {
  error.value = ''
  try {
    const { data } = await http.post('/auth/request-email-change', {
      email: email.value
    })
    console.log('[OTP送信] 成功:', data)
    console.log('送信したメール：',email.value)
    router.push({ name: 'AccountOtpVerify', query: { email: email.value } })


  } catch (e) {
    error.value = e.response?.data?.error || 'OTPの送信に失敗しました'
    console.error('[OTP送信] 失敗:', e)
  }
}

// パスワード変更フロー
// 現在のメールアドレス宛にリセット用6桁コードを送信 → ResetPasswordViewへ遷移
const pwLoading = ref(false)
const pwMsg = ref('')
const pwOk = ref(false)

const sendPasswordReset = async () => {
  pwMsg.value = ''
  pwOk.value = false
  pwLoading.value = true
  try {
    await http.post('/auth/forgot-password', { email: email.value })
    pwOk.value = true
    pwMsg.value = 'パスワード再設定用のコードを送信しました。メールをご確認ください。'

    router.push({ name: 'ResetPassword', query: { email: email.value } })
  } catch (e) {
    pwMsg.value = e?.response?.data?.error || 'パスワード再設定メールの送信に失敗しました。'
    console.error('[request-password-reset] 失敗:', e)
  } finally {
    pwLoading.value = false
  }
}
</script>

<style scoped>
.form-text { font-size: 16px; margin-bottom: 20px; }
.form-btn-item { margin-top: 16px; text-align: center; }
.error { color: #d00; margin: 6px 0; }
.ok { color: #059669; margin: 6px 0; }
.msg { font-size: 14px; }
</style>
