<!-- src/views/Auth/SeekerProfileEditComplete.vue -->
<template>
  <body class="mypage-profle is-user is-login">
  <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="complete">
        <h1 class="title">プロフィールを更新しました</h1>
        <p class="lead">プロフィールを更新しました</p>

        <button class="btn-outline" @click="goMypage">
          マイページへ
        </button>
      </section>
    </main>

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
        <a href="/seeker/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <a href="/seeker/mypage">
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
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

function goMypage () {
  const candidates = [
    // { name: 'SeekerDashboard' },
    { name: 'SeekerMyPage' },
    { path: '/seeker/mypage' },
    { path: '/' }
  ]

  ;(async () => {
    for (const to of candidates) {
      try {
        await router.push(to)
        return
      } catch (e) {
        // 失敗したら次の候補へ（no-op を入れて no-empty を回避）
        void e
      }
    }
  })()
}
</script>

<style scoped>
.complete{
  min-height: 52vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 40px 16px 64px;
}
.title{
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 700;
  letter-spacing: .06em;
  margin: 0 0 12px;
  color: #111827;
}
.lead{
  color: #6b7280;
  margin: 0 0 24px;
}
.btn-outline{
  appearance: none;
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}
.btn-outline:hover{ background: rgba(239,68,68,.06); }
</style>
