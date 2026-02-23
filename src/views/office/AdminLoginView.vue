<!-- src/views/office/AdminLoginView.vue -->
<!-- 事務局用ログインページ -->
<template>
  <div class="admin-login">
    <h1 class="title">管理者ログイン</h1>

    <form class="card" @submit.prevent="onSubmit">
      <div class="form-item">
        <label class="label">ID（メールアドレス）</label>
        <input v-model="email" type="email" class="input" placeholder="admin@fukushimachi.com" />
      </div>

      <div class="form-item">
        <label class="label">パスワード</label>
        <input v-model="password" type="password" class="input" placeholder="••••••••" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="btn" type="submit" :disabled="submitting">
        {{ submitting ? 'ログイン中…' : 'ログイン' }}
      </button>

      <!-- <p class="hint">
        テスト用 固定ID/PW：<br />
        ID: <code>admin@fukushimachi.com</code><br />
        PW: <code>admin123</code>
      </p> -->
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const error = ref('')

const FIXED_ID = 'admin@fukushimachi.com'
const FIXED_PW = 'admin123'

// 事務局の代表ユーザーID（必要なら .env の VITE_OFFICE_USER_ID で上書き）
// const OFFICE_USER_ID =
//   Number(import.meta.env.VITE_OFFICE_USER_ID || 100) || 100

async function onSubmit () {
  error.value = ''
  submitting.value = true
  try {
    if (email.value.trim() !== FIXED_ID || password.value !== FIXED_PW) {
      error.value = 'ID またはパスワードが正しくありません'
      return
    }
    // 認証OK → フラグ & userId を保存
    // localStorage.setItem('admin_is_logged_in', '1')
    // localStorage.setItem('admin_email', email.value.trim())
    // localStorage.setItem('userId', String(OFFICE_USER_ID))

    // リダイレクト先（クエリの redirect 優先）
    const to = route.query.redirect?.toString() || '/office/announcements'
    router.replace(to)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.admin-login { min-height: 100vh; display:grid; place-items:center; background:#f3f4f6; padding:24px; }
.title { margin-bottom: 16px; font-size: 20px; font-weight: 800; text-align:center; }
.card { width: 100%; max-width: 440px; background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:20px; }
.form-item { margin-bottom: 14px; }
.label { display:block; margin-bottom: 6px; font-weight: 700; }
.input { width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px; }
.btn { width:100%; margin-top: 8px; padding:10px 12px; border:none; border-radius:10px; background:#2563eb; color:#fff; font-weight:700; cursor:pointer; }
.btn:disabled { opacity:.7; cursor:not-allowed; }
.error { margin: 8px 0; color:#b91c1c; font-weight:600; }
.hint { margin-top:12px; font-size:12px; color:#6b7280; }
code { background:#f3f4f6; padding:2px 6px; border-radius:6px; }
</style>
