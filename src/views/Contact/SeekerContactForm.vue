<!-- src/views/Contact/SeekerContactForm.vue -->
 <!-- 求職者用問合わせページ -->
<template>
  <body class="contact is-user is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main class="l-sec contact">
        <div class="inner">
          <div class="page-title maru">求職者お問い合わせフォーム</div>

          <p class="lead">
            以下のフォームよりお問い合わせください。
          </p>

          <!-- 編集フォーム -->
          <form v-if="!confirming" class="form" @submit.prevent="startConfirm">
            <div class="panel">
              <div class="form-item">
                <label>姓（全角）</label>
                <input type="text" v-model.trim="f.last_name" />
              </div>
              <div class="form-item">
                <label>名（全角）</label>
                <input type="text" v-model.trim="f.first_name" />
              </div>

              <div class="form-item">
                <label>姓カナ（全角）</label>
                <input type="text" v-model.trim="f.last_name_kana" />
              </div>
              <div class="form-item">
                <label>名カナ（全角）</label>
                <input type="text" v-model.trim="f.first_name_kana" />
              </div>

              <div class="form-item">
                <label>メールアドレス <span class="req">※必須</span></label>
                <input
                  type="email"
                  v-model.trim="f.email"
                  autocomplete="email"
                  required
                  ref="emailEl"
                  @change="normalizeEmail()"
                  @blur="normalizeEmail()"
                />
              </div>

              <div class="form-item">
                <label>お問い合わせ内容</label>
                <textarea rows="8" v-model.trim="f.message"></textarea>
              </div>

              <p class="policy-conf-txt">
                <a href="../../policy/">プライバシーポリシー</a>に同意の上、送信してください。
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
                <button type="submit" class="btn btn-primary maru" :disabled="!canConfirm">
                  入力内容の確認
                </button>
              </div>
            </div>
            <button class="back" @click="$router.back()">
              <span class="circle">←</span><span>戻る</span>
            </button>
            <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>
          </form>

          <!-- 確認画面 -->
          <section v-else class="confirm">
            <div class="conf-items">
              <div class="conf-item"><span class="label-name">お名前</span><span class="dd">{{ f.last_name || '―' }}</span><span class="dd">{{ f.first_name || '―' }}</span>（<span class="dd">{{ f.last_name_kana || '―' }}</span><span class="dd">{{ f.first_name_kana || '―' }}</span>）さま</div>
              <div class="conf-item"><span class="label-name">メール</span><span class="dd">{{ f.email || '―' }}</span></div>
              <div class="conf-item"><span class="label-name">お問い合わせ内容</span><span class="dd pre">{{ f.message || '―' }}</span></div>
            </div>

            <!-- <form @submit.prevent="doSend" class="actions"> -->
            <form @submit.prevent="doSend" class="actions actions-col">
            <div class="form-btn-item">
              <button type="submit" class="btn btn-primary maru" :disabled="submitting">
                {{ submitting ? '送信中…' : 'お問い合わせを送信' }}
              </button>
            </div>
            <div class="form-btn-item">
              <button type="button" class="btn btn-primary maru btn-narrow" @click="confirming=false" :disabled="submitting">
                修正する
              </button>
            </div>
            </form>

            <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>
          </section>
        </div>
      </main>
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

/* API クライアント */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

/* モデル */
const f = ref({
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
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
const canConfirm = computed(() => agree.value && isEmail(f.value.email))

function startConfirm () {
  message.value = ''
  ok.value = false
  if (!canConfirm.value) {
    message.value = 'メールアドレスを入力し、プライバシーポリシーに同意してください。'
    return
  }
  confirming.value = true
}

async function doSend () {
  submitting.value = true
  message.value = ''
  ok.value = false
  try {
    // 既存API（/api/contacts）に合わせる
    await API.post('/contacts', {
      contact_type: 'seeker',                   // ← ココが 'seeker'
      last_name: f.value.last_name || '',
      first_name: f.value.first_name || '',
      last_name_kana: f.value.last_name_kana || '',
      first_name_kana: f.value.first_name_kana || '',
      email: f.value.email,
      body: f.value.message || '',
      privacy_agreed: !!agree.value,            // ← 同意フラグを送る
    })
    // 完了画面へ
    router.replace({ name: 'SeekerContactComplete' })
  } catch (err) {
    message.value = err?.response?.data?.error || '送信に失敗しました。時間をおいて再度お試しください。'
  } finally {
    submitting.value = false
  }
}

/* 既存プロフィールからの簡易プレフィル（任意） */
onMounted(async () => {
  // よくある保存形式からメールだけでも補完
  try {
    const raw = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
    if (raw) {
      const u = JSON.parse(raw)
      const em = String(u?.email || u?.user?.email || '').trim()
      if (em) f.value.email = em
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
/* <style scoped> に追記 */
.actions-col{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.actions-col .btn{
  width: 320px;       /* 任意：同じ幅にしたい場合 */
  max-width: 100%;
}
/* 送信ボタンなど既定幅（必要なら） */
.actions-col .btn{
  width: 320px;
  max-width: 100%;
}

/* 修正するだけ細く */
.actions-col .btn.btn-narrow{
  width: 130px;       /* お好みで 180〜240px などに調整可 */
  text-align: center;
  margin-right: 180px;
}

/* 固定ヘッダーの下にタイトルが潜らないように上マージンを付与（スマホ） */
@media (max-width: 768px){
  .contact .page-title {
    /* ヘッダーの実高さに合わせて 56px/64px など調整してください */
    margin-top: calc(64px + env(safe-area-inset-top, 0));
  }
}
</style>
