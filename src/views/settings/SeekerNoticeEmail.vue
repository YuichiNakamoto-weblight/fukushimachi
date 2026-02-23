<!-- src/views/settings/SeekerNoticeEmail.vue -->
<!-- 求職者：メール通知 -->
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
  good_target_update: false,
  talk_received:      false,
  clip_target_update:  false,
  news_new_job:       false,
  news_update:        false,           // これは「NEWSの更新」
  news_new:           false,           // ★ 追加：NEWSの新規
  news_feature_update:false,
  news_feature_new:   false,           // ★（分けるなら）追加
})

const auth = useAuthLocal()
auth.restore() // localStorage → userId / userType を復元
const userId = auth.userId // null の可能性があるのでチェックする

onMounted(async () => {
  // 未ログインなら表示は可能でも保存はできない想定なので早期return
  if (!userId) return
  const items = await fetchEmailPrefs('seeker', userId)
  // {pref_key, enabled: 0|1} を反映（キーが存在するものだけ）
  items.forEach(({ pref_key, enabled }) => {
    if (Object.prototype.hasOwnProperty.call(m, pref_key)) {
      m[pref_key] = !!enabled
    }
  })
})

// ===== スマホでヘッダーに隠れないための対策 =====
const headerH = ref(72) // 初期値（描画後に実測で上書き）
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

async function onToggle(key, nextVal) {
  if (!userId) {
    // 未ログイン時のガード（UIを戻すなどの処理を入れても良い）
    m[key] = !nextVal
    return
  }
  const prev = m[key]
  m[key] = nextVal // 楽観的更新
  try {
    await saveEmailPref('seeker', key, nextVal, userId)
  } catch (e) {
    m[key] = prev   // 失敗時ロールバック
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
                label="グッドを押した事業者の更新"
                v-model="m.good_target_update"
                @changed="val => onToggle('good_target_update', val)"
              />
            </section>

            <section class="group">
              <h3>トーク</h3>
              <PrefRow
                label="事業者からトークが届く"
                v-model="m.talk_received"
                @changed="val => onToggle('talk_received', val)"
              />
            </section>

            <section class="group">
              <h3>クリップ</h3>
              <PrefRow
                label="クリップした事業者の更新"
                v-model="m.clip_target_update"
                @changed="val => onToggle('clip_target_update', val)"
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
                label="新規特集記事"
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
      <PcModel />
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
    <PcModel />
</template>



<style scoped>
.title{text-align:center;font-size:22px;font-weight:700;margin-bottom:24px;}
.group{margin:24px 0;} .group h3{font-weight:700;margin:0 0 8px;}
.back{margin-top:24px;display:flex;align-items:center;gap:10px;border:none;background:none;cursor:pointer;}
.circle{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#ff0;}
/* 追記（scoped のままでOK） */
.note{
  margin: -8px 0 12px;
  font-size: 13px;
  color: #666;
  text-align: right; /* ← 右寄せ */
}


/* ▼ スマホでヘッダーに隠れないよう .content を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* JSで実測値に置き換わります */
  .content{
    padding-top: var(--header-height);
  }
  /* 先頭セクションの上マージン相殺を予防（保険） */
  .content > main > .l-sec:first-child{
    margin-top: 0;
  }
}
</style>
