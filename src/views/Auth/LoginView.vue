<!-- src/views/Auth/LoginView.vue -->
<template>
  <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="page-title maru">ログイン</div>

    <div class="form-wrap">
      <div class="inner">
        <form @submit.prevent="onSubmit" class="space-y-4" novalidate>
          <div class="form-items">
            <!-- メール -->
            <div class="form-item">
              <label class="user_email" for="user-email">登録メールアドレス</label>
              <input
                v-model.trim="email"
                id="user-email"
                type="email"
                name="user_email"
                required
                autocomplete="email"
                :disabled="loading"
                inputmode="email"
              />
            </div>

            <!-- パスワード -->
            <div class="form-item">
              <label class="user_password" for="user_password">パスワード</label>
              <div class="input-wrap">
                <input
                  :type="show ? 'text' : 'password'"
                  v-model="password"
                  id="user_password"
                  name="user_password"
                  class="password-input"
                  required
                  minlength="6"
                  maxlength="100"
                  autocomplete="current-password"
                  placeholder=""
                  :disabled="loading"
                />
                <button
                  type="button"
                  class="toggle-password"
                  :aria-pressed="String(show)"
                  :title="show ? '非表示にする' : '表示する'"
                  @click="show = !show"
                  :disabled="loading"
                >
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
              <ul class="note indent">
                <!-- ルールがあればここに -->
              </ul>
            </div>
          </div>

          <!-- エラー表示 -->
          <p v-if="error" class="text-red-600 text-sm" role="alert">{{ error }}</p>

          <!-- 送信ボタン -->
          <button
            type="submit"
            class="w-full rounded py-2 bg-gray-800 text-white disabled:opacity-50"
            :disabled="disabled || loading"
          >
            {{ loading ? '処理中...' : 'ログイン' }}
          </button>
        </form>

        <div class="password-reset">
          <router-link to="/forgot-password" class="text-sm underline">
            パスワードを忘れた方はこちら
          </router-link>
        </div>
      </div>
    </div>
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

  <!-- PC 装飾など（必要に応じて復活可） -->

  <PcModel />
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthLocal } from '@/stores/authLocal'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthLocal()

/** 初期復元（直アクセス対策） */
if (auth.userId == null) auth.restore?.()

/** 入力状態 */
const email = ref('')
const password = ref('')
const show = ref(false)
const error = ref('')

/** ローディング・バリデーション */
const loading  = computed(() => !!auth.loading)
const disabled = computed(() => !email.value || !password.value || password.value.length < 6)

/** 役割正規化（business -> employer） */
function normalizeRole (raw) {
  const t = String(raw ?? '').trim().toLowerCase()
  if (t === 'business') return 'employer'
  if (t === 'employer') return 'employer'
  if (t === 'admin')    return 'admin'
  if (t === 'seeker')   return 'seeker'
  return ''
}

/** ログイン後の遷移先決定 */
function resolveHomeRoute () {
  const raw = auth.userType ?? localStorage.getItem('userType') ?? ''
  const t = normalizeRole(raw)
  if (t === 'seeker') return { name: 'TopSeeker' }
  if (t === 'employer' || t === 'admin') return { name: 'TopBusiness' }
  return { name: 'TopPublic' }
}

/** 既ログインなら即リダイレクト（任意） */
onMounted(() => {
  if (auth.isAuthed) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    if (redirect && redirect.startsWith('/')) {
      router.replace(redirect)
    } else {
      router.replace(resolveHomeRoute())
    }
  }
})

/** 送信 */
const onSubmit = async () => {
  error.value = ''
  try {
    await auth.login(email.value, password.value) // /api/auth/login を使用（ストア実装）
    // ストアの反映が非同期になる場合があるので nextTick で念のため同期
    await nextTick()

    if (auth.isAuthed) {
      // ?redirect=/xxx があれば最優先（内部パスのみ許可）
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
      if (redirect && redirect.startsWith('/')) {
        router.replace(redirect)
        return
      }
      // ロール別トップへ
      router.replace(resolveHomeRoute())
    } else {
      error.value = 'ログインに失敗しました。メールアドレスとパスワードをご確認ください。'
    }
  } catch (e) {
    error.value =
      e?.response?.data?.error ||
      e?.message ||
      'ログインに失敗しました。時間をおいて再度お試しください。'
  }
}
</script>

<style scoped>
/* 入力の共通見た目 */
.form-item input[type="text"],
.form-item input[type="password"],
.form-item input[type="email"],
.form-item textarea {
  width: 100%;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  box-sizing: border-box;
}

/* パスワードの目アイコン */
.input-wrap { position: relative; }
.toggle-password {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: transparent; border: 0; cursor: pointer; padding: 4px;
}
.icon-eye, .icon-eye-off { display: none; }
.toggle-password[aria-pressed="false"] .icon-eye-off { display: block; }
.toggle-password[aria-pressed="true"]  .icon-eye     { display: block; }

/* ボタン */
.w-full { width: 100%; }
.rounded { border-radius: 8px; }
.py-2 { padding-top: .5rem; padding-bottom: .5rem; }
.bg-gray-800 { background: #1f2937; }
.text-white { color: #fff; }
.disabled\:opacity-50:disabled { opacity: .5; cursor: not-allowed; }

/* エラーテキスト */
.text-red-600 { color: #dc2626; }
.text-sm { font-size: 0.875rem; }

/* 小物 */
.password-reset { margin-top: 12px; }
.underline { text-decoration: underline; }
.space-y-4 > * + * { margin-top: 1rem; }

.btn-back{
  margin-bottom: 50px;
}
</style>
