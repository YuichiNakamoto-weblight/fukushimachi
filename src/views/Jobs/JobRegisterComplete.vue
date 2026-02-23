<!-- src/views/jobs/JobRegisterComplete.vue -->
<template>
  <body class="job-admin is-employer is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main>
        <section class="l-sec mypage-detail">
          <div class="inner">
            <div class="page-title maru">
              あなたの求人情報が<br>
              サイトに掲載されました。
            </div>
            <p>
              募集の終了、求人情報の修正、求人情報の追加
              は【マイページへ】続けて求人情報を登録する場合は【続けて求人情報登録へ】のボタンを推してください。
            </p>
            <div class="back-btn-items">
              <div class="btn-base maru">
                <RouterLink :to="{ name: 'BusinessMyPage' }">マイページへ</RouterLink>
              </div>
              <div class="btn-base maru">
                <RouterLink :to="{ name: 'JobRegisterForm' }">続けて求人情報登録へ</RouterLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>

    <PcModel />
  </body>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

// ★ この画面が表示されたときにコンバージョンを送信 ★
onMounted(() => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-855841331/wleNCM3r2MsBELO0jJgD',
    })
  } else {
    console.warn('gtag is not defined')
  }
})
</script>
