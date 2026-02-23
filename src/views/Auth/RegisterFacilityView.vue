<!-- src/views/Auth/RegisterFacilityView.vue -->
 <!-- アカウント登録（事業者用） -->
<template>
  <!-- <div class="wrap" :class="[{ 'is-employer': defaultUserType==='employer', 'is-guest': true }, pageSlug]"> -->
  <body class="is-employer">
  <div class="wrap" :class="is-employer">
     <!-- 共通ヘッダー -->
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec signup-detail">

        <!-- ワイヤー上部タイトル -->
        <div class="page-title maru">アカウント登録（事業者用）</div>

        <!-- ステップ -->
        <div class="inner">
          <div class="signup-step flex">
            <div class="signup-step__step step1 select">アカウント<br>登録</div>
            <div class="signup-step__step step2">ワンタイム<br>パスワード<br>入力</div>
            <div class="signup-step__step step3">プロフィール<br>作成</div>
            <div class="signup-step__step step4">完了</div>
          </div>
        </div>

        <!-- リード文＋受信設定 -->
        <div class="inner signup-lead">
          <p>
            ご登録完了後、ご入力いただいたメールアドレスにご登録の確認メールをお送りします。<br>
            ご登録前に、メールの受信設定のご確認をお願いします。
          </p>
          <div class="btn-mini">
            <RouterLink :to="{ name: 'MailReceiveSetting' }">メールの受信設定</RouterLink>
          </div>
        </div>

        <!-- フォーム -->
        <div class="form-wrap">
          <div class="inner">
            <form action="javascript:void(0)" method="post" class="form" @submit.prevent="onSubmit" novalidate>
              <div class="form-items">
                <!-- ユーザー名 -->
                <div class="form-item" :class="{ error: !form.username && triedSubmit }">
                  <label for="user_name">ユーザー名<span class="req">※必須</span></label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    placeholder="ふくしま太郎"
                    v-model.trim="form.username"
                    minlength="3"
                    required
                  />
                  <p v-if="!form.username && triedSubmit" class="error-message">ユーザー名を入力してください。</p>
                </div>

                <!-- メール -->
                <div class="form-item" :class="{ error: (!form.email && triedSubmit) || emailMismatch }">
                  <label for="user_email">メールアドレス<span class="req">※必須</span></label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    placeholder="XXX@fukushimachi.com"
                    v-model.trim="form.email"
                    required
                  />
                  <p v-if="!form.email && triedSubmit" class="error-message">メールアドレスを入力してください。</p>
                </div>

                <!-- メール（確認） -->
                <div class="form-item" :class="{ error: emailMismatch }">
                  <label for="user_email_conf">メールアドレス（確認用）<span class="req">※必須</span></label>
                  <input
                    type="email"
                    id="user_email_conf"
                    name="user_email_conf"
                    placeholder="XXX@fukushimachi.com"
                    v-model.trim="emailConfirm"
                    required
                  />
                  <p v-if="emailMismatch" class="error-message">メールが一致しません。</p>
                </div>

                <!-- パスワード -->
                <div class="form-item field password-field"
                      :data-visible="pw1Visible"
                      :class="{ error: triedSubmit && !validPassword }">

                  <label for="user_password">パスワード<span class="req">※必須</span></label>
                  <div class="input-wrap">
                    <input
                      id="user_password"
                      name="user_password"
                      class="password-input"
                      :type="pw1Visible ? 'text' : 'password'"
                      autocomplete="new-password"
                      inputmode="text"
                      v-model="form.password"
                      placeholder="パスワードを入力してください。"
                      minlength="7"
                      maxlength="64"
                      pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,64}$"
                      @keydown.space.prevent
                      required
                    />
                    <button type="button" class="toggle-password"
                      :aria-pressed="String(pw1Visible)"
                      :title="pw1Visible ? '非表示にする' : '表示する'"
                      @click="pw1Visible = !pw1Visible">
                      <!-- eye -->
                      <svg class="icon-eye-off" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <!-- eye-off -->
                      <svg class="icon-eye" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M2 4l18 18-1.5 1.5L17 19.9A12 12 0 0 1 2 12c.6-1.5 1.7-3.1 3.2-4.6L.5 5.5 2 4zm20 8c-.8 2-3 4.8-6.2 6.3l-2.1-2.1a5 5 0 0 0-6-6L5.7 7.2C7.7 6 9.8 5.2 12 5.2c5 0 9 4 10 6.8z"/>
                      </svg>
                    </button>
                  </div>
                  <!-- ワイヤーの注意書き（□表示） -->
                  <ul class="note indent">
                  <li>※7〜64文字で入力してください。</li>
                  <li>※半角英字と半角数字を必ず含めてください（記号・全角は不可）。</li>
                  </ul>
                    <p v-if="triedSubmit && !validPassword" class="error-message">
                      7〜64文字で、半角英字と半角数字を必ず含めてください（記号・全角は不可）。
                    </p>
                  <p v-if="!form.password && triedSubmit" class="error-message">パスワードを入力してください。</p>
                </div>

                <!-- パスワード（確認） -->
                <div class="form-item field password-field" :data-visible="pw2Visible" :class="{ error: passwordMismatch }">
                  <label for="user_password_conf">パスワード（確認用）<span class="req">※必須</span></label>
                  <div class="input-wrap">
                    <input
                      id="user_password_conf"
                      name="user_password_conf"
                      class="password-input"
                      :type="pw2Visible ? 'text' : 'password'"
                      autocomplete="new-password"
                      inputmode="text"
                      v-model="passwordConfirm"
                      placeholder="パスワードを入力してください。"
                      required
                    />
                    <button type="button" class="toggle-password"
                      :aria-pressed="String(pw2Visible)"
                      :title="pw2Visible ? '非表示にする' : '表示する'"
                      @click="pw2Visible = !pw2Visible">
                      <!-- eye -->
                      <svg class="icon-eye-off" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <!-- eye-off -->
                      <svg class="icon-eye" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M2 4l18 18-1.5 1.5L17 19.9A12 12 0 0 1 2 12c.6-1.5 1.7-3.1 3.2-4.6L.5 5.5 2 4zm20 8c-.8 2-3 4.8-6.2 6.3l-2.1-2.1a5 5 0 0 0-6-6L5.7 7.2C7.7 6 9.8 5.2 12 5.2c5 0 9 4 10 6.8z"/>
                      </svg>
                    </button>
                  </div>
                  <p v-if="passwordMismatch" class="error-message">パスワードが一致しません。</p>
                </div>

                <!-- 送信 -->
                <div class="form-group">
                  <button type="submit" class="btn-submit maru" :disabled="disabled">
                    ワンタイムパスをメールに送信
                  </button>
                  <p v-if="message" class="error-msg" role="status">{{ message }}</p>
                </div>

              </div>
            </form>
          </div>
        </div>

      </section>
    </main>
            <div class="btn-back">
              <a href="#" onclick="history.back()" return="false;=">
                <span class="ico">
                  <img src="/src/assets/images/common/ico-back.svg">
                </span>
                戻る
              </a>
            </div>
    <AppFooter />
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
  </body>
  <PcModel />
</template>





<script setup>
/**
 * デザイナー提供クラスをそのまま使った版
 * - /auth/register を叩いて OTP へ遷移
 * - history.state に { password, userId, userType } を渡す
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as api from '@/api/auth'

/* 共通ヘッダー／フッター */
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

// 7〜64文字、半角英字と半角数字を各1つ以上含む（記号・全角は不可）
const PW_RE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,64}$/
const validPassword = computed(() => PW_RE.test(form.value.password))


const props = defineProps({
  defaultUserType: {
    type: String,
    default: 'employer',
    validator: (v) => ['seeker', 'employer'].includes(v),
  },
})

const router = useRouter()
const store = useUserStore()

const form = ref({ username: '', email: '', password: '' })
const emailConfirm = ref('')
const passwordConfirm = ref('')
const message = ref('')
const triedSubmit = ref(false)

const emailMismatch = computed(
  () => !!form.value.email && !!emailConfirm.value && form.value.email !== emailConfirm.value
)
const passwordMismatch = computed(
  () => !!form.value.password && !!passwordConfirm.value && form.value.password !== passwordConfirm.value
)
const disabled = computed(() =>
  emailMismatch.value ||
  passwordMismatch.value ||
  !validPassword.value ||
  !form.value.username ||
  !form.value.email ||
  !form.value.password
)

const pw1Visible = ref(false)
const pw2Visible = ref(false)

// bodyクラスの代替（レイアウトCSSが参照）
// const pageSlug = 'signup'

async function onSubmit () {
  triedSubmit.value = true
  message.value = ''

 if (!validPassword.value) {
   message.value = 'パスワード要件を満たしていません（7〜64文字、半角英字と半角数字を必ず含む）。'
   return
 }

  if (disabled.value) return

  const payload = {
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    user_type: 'employer',
  }
  console.log('[UI] register payload', { ...payload, password: '***' })

  try {
    const res = await api.register(payload)
    // 以後の画面から参照するペンディング情報
    store.setPendingEmail(res.email, res.user_id)

    router.push({
      name: 'BusinessEmailVerifyView',
      query: { uid: String(res.user_id), email: res.email },
      state: {
        password: form.value.password,
        userId: res.user_id,
        userType: props.defaultUserType,
      },
    })
  } catch (e) {
    const data = e?.response?.data
    console.error('[UI] register failed', { status: e?.response?.status, data })
    message.value = data?.error || data?.message || '登録に失敗しました。'
  }
}
</script>

<style scoped>
/* 提供CSSの“クラス名”は変更しない前提。型セレクタの抜けを補完する最小の上書きだけ。 */

/* email/password 型にも同じ見た目を当てる（提供CSSが user_email / user_password を使っているため） */
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  font-size: var(--font-size-md);
  border: 2px solid #ccc;
  border-radius: 6px;
  background: #fff;
}

/* 送信ボタンがdisabledのときの視覚 */
button[disabled] { opacity: .6; cursor: not-allowed }

/* エラーテキスト（既存 .error-message を補強） */
.error-message { color: #d92d20; font-size: var(--font-size-sm); margin-top: 6px }
.btn-back{
  margin-top: -20px;
  margin-bottom: 50px;
}
</style>


