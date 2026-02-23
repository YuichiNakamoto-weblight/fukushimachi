<!-- src/views/settings/AccountChangeEmailInputView.vue -->
<!-- メールアドレス変更-->
<template>
  <div class="wrap is-guest">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec signup-detail">
        <div class="page-title maru">新しいメールアドレスの入力</div>

        <div class="form-wrap">
          <div class="inner">
            <form @submit.prevent="submit">
              <!-- 新しいメールアドレス -->
              <div class="form-item">
                <label for="email" class="form-label">新しいメールアドレス</label>
                <div class="input-wrap">
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="password-input"
                    required
                  />
                </div>
              </div>

              <!-- 確認用メールアドレス -->
              <div class="form-item">
                <label for="emailConfirm" class="form-label">確認用メールアドレス</label>
                <div class="input-wrap">
                  <input
                    id="emailConfirm"
                    v-model="emailConfirm"
                    type="email"
                    class="password-input"
                    required
                  />
                </div>
              </div>

              <div class="form-btn-item">
                <button type="submit" class="btn btn-primary maru" :disabled="loading">
                  {{ loading ? '送信中…' : 'メールアドレスを変更する' }}
                </button>
              </div>

              <div v-if="error" class="form-error">{{ error }}</div>
              <div v-if="success" class="form-success">{{ success }}</div>
            </form>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>

  <!-- 背景やPC用補助要素（他ページと同一） -->
  <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt />
  </div>

  <div class="hero-copy pc">
    <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo user-content">
      <a href="/user">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo employer-content">
      <a href="/employer">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
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
import { useRouter, useRoute } from 'vue-router'
import { http } from '@/api/http'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const email = ref('')
const emailConfirm = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const router = useRouter()
const route = useRoute()
const userId = ref(null)

onMounted(() => {
  // クエリから userId を取得
  userId.value = route.query.userId
  if (!userId.value) {
    error.value = 'ユーザー情報が取得できません。'
  }
})

const submit = async () => {
  error.value = ''
  success.value = ''

  if (email.value !== emailConfirm.value) {
    error.value = 'メールアドレスが一致しません。'
    return
  }

  if (!userId.value) {
    error.value = 'ユーザー情報がありません。'
    return
  }

  loading.value = true
  try {
    await http.post('/auth/update-email', {
      userId: userId.value,
      newEmail: email.value
    })

// ✅ 更新成功時は完了画面に遷移
    router.push({ name: 'AccountChangeEmailComplete' })  // ← ここで遷移
  } catch (e) {
    error.value = e.response?.data?.error || '送信に失敗しました。'
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
.form-success {
  color: green;
  margin-top: 10px;
}
</style>
