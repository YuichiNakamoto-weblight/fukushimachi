<!-- src/views/settings/BizNoticeEmail.vue -->
<!-- 事業者：メール通知 -->
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import PrefRow from '@/components/PrefRow.vue'
import { useAuthLocal } from '@/stores/authLocal'
import { fetchEmailPrefs, saveEmailPref } from '@/api/notifications'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const m = reactive({
  // ▼ employer/email 用キー
  good_received:      false, // 求職者からグッドが届く
  good_target_update: false, // グッドされた求職者の情報更新
  talk_received:      false, // 求職者からトークが届く
  talk_actor_update:  false, // トークをした求職者の情報更新
  news_new_job:       false, // 新規求人情報
  news_update:        false, // 新着NEWS情報の更新
  news_feature_update:false, // 特集記事の更新
})

const auth = useAuthLocal()
auth.restore()
const userId = auth.userId

onMounted(async () => {
  if (!userId) return
  const items = await fetchEmailPrefs('employer', userId) // ← 事業者ロール
  items.forEach(({ pref_key, enabled }) => {
    if (Object.prototype.hasOwnProperty.call(m, pref_key)) {
      m[pref_key] = !!enabled
    }
  })
})

// ===== スマホのヘッダー被り対策：実測高さ → CSS変数 =====
const headerH = ref(72) // 初期値（AppHeader描画後に上書き）
function updateHeaderHeight () {
  const headerEl =
    document.querySelector('[data-app-header]') ||
    document.querySelector('header')
  if (!headerEl) return
  const h = Math.round(headerEl.getBoundingClientRect().height)
  if (h > 0) {
    headerH.value = h
    document.documentElement.style.setProperty('--header-height', `${h}px`)
  }
}
onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})

async function onToggle (key, nextVal) {
  if (!userId) {
    m[key] = !nextVal
    return
  }
  const prev = m[key]
  m[key] = nextVal
  try {
    await saveEmailPref('employer', key, nextVal, userId) // ← 事業者ロール
  } catch (e) {
    m[key] = prev
    console.error('saveEmailPref failed:', e)
  }
}
</script>

<template>
  <div class="wrap">

    <AppHeader data-app-header />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main>
        <div class="l-sec">
          <div class="page-title maru">メール通知</div>
          <p class="note">オフにすると通知されません</p>
          <div class="inner">
            <section class="group">
              <h3>グッド</h3>
              <PrefRow
                label="求職者からグッドが届く"
                v-model="m.good_received"
                @changed="val => onToggle('good_received', val)"
              />
              <PrefRow
                label="グッドされた求職者の情報更新"
                v-model="m.good_target_update"
                @changed="val => onToggle('good_target_update', val)"
              />
            </section>

            <section class="group">
              <h3>トーク</h3>
              <PrefRow
                label="求職者からトークが届く"
                v-model="m.talk_received"
                @changed="val => onToggle('talk_received', val)"
              />
              <PrefRow
                label="トークをした求職者の情報更新"
                v-model="m.talk_actor_update"
                @changed="val => onToggle('talk_actor_update', val)"
              />
            </section>

            <section class="group">
              <h3>お知らせ</h3>
              <PrefRow
                label="新規求人情報"
                v-model="m.news_new_job"
                @changed="val => onToggle('news_new_job', val)"
              />
              <PrefRow
                label="新着NEWS情報の更新"
                v-model="m.news_update"
                @changed="val => onToggle('news_update', val)"
              />
              <PrefRow
                label="特集記事の更新"
                v-model="m.news_feature_update"
                @changed="val => onToggle('news_feature_update', val)"
              />
            </section>

            <button class="back" @click="$router.back()">
              <span class="circle">←</span><span>戻る</span>
            </button>
          </div>
        </div>
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
  </div> -->

  <!-- <div class="pc">
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



<style scoped>
.title{text-align:center;font-size:22px;font-weight:700;margin-bottom:24px;}
.group{margin:24px 0;} .group h3{font-weight:700;margin:0 0 8px;}
.back{margin-top:24px;display:flex;align-items:center;gap:10px;border:none;background:none;cursor:pointer;}
.circle{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#ff0;}
.note{margin:-8px 0 12px;font-size:13px;color:#666;text-align:right;}

/* ▼ スマホでヘッダーに隠れないよう .content を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* JS が実測で上書きします */
  .content{
    padding-top: var(--header-height);
  }
  /* 先頭セクションの相殺マージン対策（保険） */
  .content > main > .l-sec:first-child{ margin-top: 0; }
}
</style>

