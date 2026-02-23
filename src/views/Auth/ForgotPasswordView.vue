<!-- src/views/Auth/ForgotPasswordView.vue -->
  <!-- パスワードを忘れたとき -->
<template>
  <body class="login is-guest">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main>
        <section class="l-sec signup-detail">
          <div class="page-title maru">パスワードの再設定</div>

          <div class="form-wrap">
            <div class="inner">
              <p>
                メールアドレスを入力してください。<br />
                ワンタイムパスワードをメールアドレスにお送りします。
              </p>

              <form @submit.prevent="onSubmit" class="space-y-4">
                <div class="form-items">
                  <div class="form-item">
                    <label for="user_email" class="maru">メールアドレス</label>
                    <input
                      id="user_email"
                      v-model.trim="email"
                      type="email"
                      autocomplete="email"
                      class="text-input"
                      required
                    />
                  </div>
                </div>

                <p v-if="msg" class="note" :class="ok ? 'text-emerald-600' : 'text-red-600'">{{ msg }}</p>

                <button type="submit" class="btn-submit maru" :disabled="loading">
                  {{ loading ? '送信中…' : 'ワンタイムパスををメールに送信' }}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>

    <!-- 背景など（既存のまま） -->
    <!-- <div class="body-bg pc"><img src="/src/assets/images/common/bg-pc.png" alt /></div>
    <div class="hero-copy pc">
      <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。" />
    </div>
    <div class="pc">
      <h1 class="sitelogo guest-content">
        <a href="/"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」" /></a>
      </h1>
      <h1 class="sitelogo user-content">
        <a href="/user"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」" /></a>
      </h1>
      <h1 class="sitelogo employer-content">
        <a href="/employer"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」" /></a>
      </h1>
    </div>
    <div class="pc">
      <div class="user-content login-content">
        <div class="mypage-link">
          <a href="/user/mypage">
            <div class="mypage-link-tmb"><img src="/src/assets/images/common/ico-user.svg" alt="マイページ" /></div>
            <span class="mypage-link-txt">マイページ</span>
          </a>
        </div>
      </div>
      <div class="employer-content login-content">
        <div class="mypage-link">
          <a href="/employer/mypage">
            <div class="mypage-link-tmb"><img src="/src/assets/images/common/ico-user.svg" alt="マイページ" /></div>
            <span class="mypage-link-txt">マイページ</span>
          </a>
        </div>
      </div>
    </div> -->

    <PcModel />
  </body>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { forgotPassword } from '@/api/auth'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const email = ref('')
const loading = ref(false)
const msg = ref('')
const ok = ref(false)
const router = useRouter()

async function onSubmit () {
  msg.value = ''
  ok.value = false
  loading.value = true
  try {
    // 存在の有無は伏せたメッセージで返ってくる想定
    const res = await forgotPassword(email.value)
    msg.value = res?.message || 'もし登録があれば、リセットコードを送信しました。'
    ok.value = true

    // ★ ここでリセット画面へ進む（メールをクエリで渡す）
    router.push({ name: 'ResetPassword', query: { email: email.value } })
  } catch (e) {
    msg.value = e?.response?.data?.error || '送信に失敗しました。'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 入力ボックス：他ページと同じ雰囲気（丸み・太めの高さ・薄いグレー枠） */
.text-input{
  width: 100%;
  height: 56px;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.4;
  color: #111827;            /* gray-900 */
  background: #fff;
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 12px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
  box-sizing: border-box;
}

/* .text-input:focus{
  border-color: #fb6a50;
  box-shadow: 0 0 0 4px rgba(251,106,80,.15);
} */

/* ラベルを太字＆余白 */
.form-item > label{
  display:block;
  margin: 16px 0 8px;
  font-weight: 700;
  color:#111827;
}

/* メッセージ（既存） */
.note {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
  text-align: center;
}

</style>
