<!-- src/views/settings/SeekerNoticeIndex.vue -->
 <!-- 求職者：お知らせ機能（一覧） -->
<template>
  <body class="setting-notice is-user is-login">
    <div class="wrap">

    <AppHeader data-app-header />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main>
        <section class="l-sec">
        <div class="page-title maru">お知らせ機能</div>
        <div class="inner">
          <div class="user-list__activity">
            <ul>
              <li @click="$router.push({ name: 'SeekerNoticeEmail' })">
                <a>メール通知
                  <span class="ico-arrow02">
                    <img src="/src/assets/images/common/ico-arrow02.svg">
                  </span>
                </a>
              </li>
              <li @click="$router.push({ name: 'SeekerNoticePush' })">
                <a>プッシュ通知
                  <span class="ico-arrow02">
                    <img src="/src/assets/images/common/ico-arrow02.svg">
                  </span>
                </a>
              </li>
            </ul>
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
          </section>
      </main>
    </div>
      <AppFooter />
    </div>
  </body>
  <PcModel />
</template>



<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

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

</script>

<style scoped>
.title{text-align:center;font-size:22px;font-weight:700;margin-bottom:24px;}
.menu{list-style:none;padding:0;margin:0;}
.menu li{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid #e5e5e5;cursor:pointer;}
.menu .chev{opacity:.6}
.back{margin-top:24px;display:flex;align-items:center;gap:10px;border:none;background:none;cursor:pointer;}
.circle{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#ff0;}


/* ▼ スマホでヘッダーに隠れないよう .content を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* JS 実測で上書きされます */
  .content{
    padding-top: var(--header-height);
  }
  /* 先頭セクションの相殺マージンを無効化（保険） */
  .content > main > .l-sec:first-child{ margin-top: 0; }
}
</style>
