<!-- src/views/Contact/BusinessContactForm.vue -->
<!-- 事業者お問い合わせフォーム画面 -->
<template>
  <body class="contact is-employer is-login">
  <div class="wrap">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main class="l-sec contact">
        <div class="inner">
          <div class="page-title maru">介護事業者お問い合わせフォーム</div>

          <p class="lead">
            以下のフォームよりお問い合わせください。
          </p>

          <!-- 入力 -->
          <form v-if="!confirming" class="form" @submit.prevent="startConfirm">
            <div class="panel">
              <div class="form-item">
                <label>事業者名 <span class="req">※必須</span></label>
                <input type="text" v-model.trim="f.business_name" required />
              </div>

              <div class="form-item">
                <label>担当者 姓 <span class="req">※必須</span></label>
                <input type="text" v-model.trim="f.manager_last_name" required />
              </div>
              <div class="form-item">
                <label>担当者 名 <span class="req">※必須</span></label>
                <input type="text" v-model.trim="f.manager_first_name" required />
              </div>

              <div class="form-item">
                <label>担当者 姓カナ <span class="req">※必須</span></label>
                <input type="text" v-model.trim="f.manager_last_name_kana" required />
              </div>
              <div class="form-item">
                <label>担当者 名カナ <span class="req">※必須</span></label>
                <input type="text" v-model.trim="f.manager_first_name_kana" required />
              </div>

              <div class="form-item">
                <label>メールアドレス <span class="req">※必須</span></label>
                <input type="email" v-model.trim="f.email" autocomplete="email" required />
              </div>

              <div class="form-item">
                <label>お問い合わせ内容</label>
                <textarea rows="8" v-model.trim="f.message"></textarea>
              </div>


            <p class="policy-conf-txt">
              <router-link to="/policy" target="_blank">プライバシーポリシー</router-link>
              に同意の上、送信してください。
            </p>
            <div class="checkbox-items policy-consent">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  name="policy[]"
                  value="プライバシーポリシーに同意する"
                  v-model="agree"
                  required
                >
                プライバシーポリシーに同意する
              </label>
            </div>

            <div class="actions">
              <button type="submit" class="btn btn-primary" :disabled="!canConfirm">
                入力内容の確認
              </button>
            </div>
          </div>
            <button class="back" @click="$router.back()">
              <span class="circle">←</span><span>戻る</span>
            </button>
            <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>
          </form>

          <!-- 確認 -->
          <section v-else class="l-sec mypage-detail">
            <div class="form-wrap">
              <div class="inner">

                <div class="conf-item">
                  <div class="contact_name">
                    <span class="label-name">事業者名</span>
                    <span class="dd">{{ f.business_name || '―' }}</span>
                  </div>
                </div>

                <div class="conf-item">
                  <div class="contact_name">
                    <span class="label-name">ご担当者名</span>
                    <span class="dd">{{ f.manager_last_name || '―' }}</span><span class="dd">{{ f.manager_first_name || '―' }}</span>（<span class="dd">{{ f.manager_last_name_kana || '―' }}</span><span class="dd">{{ f.manager_first_name_kana || '―' }}</span>）さま
                  </div>
                </div>

                <div class="conf-item">
                  <div class="contact_name">
                    <span class="label-name">メール</span>
                    <span class="dd">{{ f.email || '―' }}</span>
                  </div>
                </div>

                <div class="conf-item">
                  <div class="contact_name">
                    <span class="label-name">お問い合わせ内容</span>
                    <span class="dd pre">{{ f.message || '―' }}</span>
                  </div>
                </div>

                <div class="back-btn-items">
                  <form @submit.prevent="doSend">
                    <div class="form-btn-item">
                      <button type="submit" class="btn btn-primary maru" :disabled="submitting">
                        {{ submitting ? '送信中…' : 'お問い合わせを送信' }}
                      </button>
                    </div>
                    <div class="form-btn-item">
                      <button type="button" class="btn btn-primary maru" @click="confirming=false" :disabled="submitting">
                        修正する
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
            <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>
          </section>

        </div>
      </main>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
const router = useRouter()

/* API */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

/* モデル */
const f = ref({
  business_name: '',
  manager_last_name: '',
  manager_first_name: '',
  manager_last_name_kana: '',
  manager_first_name_kana: '',
  email: '',
  message: '',
})

/* 状態 */
const confirming = ref(false)
const submitting = ref(false)
const agree = ref(false)
const message = ref('')
const ok = ref(false)

/* バリデーション */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''))
const canConfirm = computed(() =>
  agree.value &&
  isEmail(f.value.email) &&
  !!f.value.business_name &&
  !!f.value.manager_last_name &&
  !!f.value.manager_first_name &&
  !!f.value.manager_last_name_kana &&
  !!f.value.manager_first_name_kana
)

function startConfirm () {
  message.value = ''
  ok.value = false
  if (!canConfirm.value) {
    message.value = '必須項目を入力し、プライバシーポリシーに同意してください。'
    return
  }
  confirming.value = true
}

async function doSend () {
  submitting.value = true
  message.value = ''
  ok.value = false
  try {
   await API.post('/contacts', {
     // 任意: ログイン中なら user_id を付与（なくてもOK）
     user_id: Number(localStorage.getItem('userId')) || null,
     contact_type: 'employer', // サーバは 'seeker' | 'employer' を期待
     business_name: f.value.business_name,
     last_name: f.value.manager_last_name,
     first_name: f.value.manager_first_name,
     last_name_kana: f.value.manager_last_name_kana,
     first_name_kana: f.value.manager_first_name_kana,
     email: f.value.email,
     body: f.value.message || '',
     privacy_agreed: agree.value ? 1 : 0,
   })
   // 送信成功 → 完了ページへ
   router.replace({ name: 'BusinessContactComplete' })
  } catch (err) {
    message.value = err?.response?.data?.error || '送信に失敗しました。時間をおいて再度お試しください。'
  } finally {
    submitting.value = false
  }
}

/* 可能ならプロフィールから自動補完（任意） */
onMounted(async () => {
  try {
    // 事業者プロフィールがある場合の軽いプレフィル
    const raw = localStorage.getItem('auth_user')
    const uid = (() => {
      if (!raw) return null
      try {
        const o = JSON.parse(raw)
        return Number(o?.id ?? o?.userId ?? o?.user?.id ?? 0) || null
      } catch { return null }
    })()
    if (uid) {
      try {
        const { data } = await API.get(`/business/profile/${uid}`)
        const p = data?.profile || data?.item || data
        if (p) {
          f.value.business_name = p.business_name || f.value.business_name
          f.value.manager_last_name = p.manager_last_name || f.value.manager_last_name
          f.value.manager_first_name = p.manager_first_name || f.value.manager_first_name
          f.value.manager_last_name_kana = p.manager_last_name_kana || f.value.manager_last_name_kana
          f.value.manager_first_name_kana = p.manager_first_name_kana || f.value.manager_first_name_kana
          f.value.email = p.contact_email || f.value.email
        }
      } catch { /* 取得できない環境では無視 */ }
    }
  } catch { /* noop */ }
})
</script>

<style scoped>
.contact .inner{ max-width: 720px; margin: 0 auto; }
.page-title{ text-align:center; font-size:26px; font-weight:700; margin: 6px 0 16px; }
.lead{ color:#444; line-height:1.9; margin-bottom:14px; }
.panel{ background:#f5f7fa; border:1px solid #e5e7eb; border-radius:12px; padding:14px; }
.form-item{ margin: 10px 0; }
.form-item label{ display:block; font-weight:600; margin-bottom:6px; }
.form-item input, .form-item textarea{ width:100%; background:#fff; border:1px solid #d1d5db; border-radius:8px; padding:10px 12px; }
.pre{ white-space:pre-wrap; }
.req{ color:#d92d20; margin-left:.35em; }
.policy-note{ margin:12px 0 6px; }
.agree{ display:flex; align-items:center; gap:.5rem; margin-bottom:10px; }
.actions{ display:flex; gap:10px; justify-content:center; margin-top:14px; }
.btn{ padding:12px 20px; border-radius:999px; border:0; cursor:pointer; font-weight:700; }
.btn-primary{ background:#42b2e6; color:#fff; }
.btn-back{ background:#81b7c1; color:#fff; }
.msg-error{ color:#d92d20; text-align:center; margin-top:10px; }
.msg-success{ color:#0ea5e9; text-align:center; margin-top:10px; }
.back{margin-top:24px;display:flex;align-items:center;gap:10px;border:none;background:none;cursor:pointer;}
.circle{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#ff0;}
/* 固定ヘッダーの下にタイトルが潜らないように上マージンを付与（スマホ） */
@media (max-width: 768px){
  .contact .page-title {
    /* ヘッダーの実高さに合わせて 56px/64px など調整してください */
    margin-top: calc(64px + env(safe-area-inset-top, 0));
  }
}
</style>
