<!-- src/views/jobs/JobEditComplete.vue -->
<template>
  <body class="job-admin is-employer is-login">
    <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />
    <div class="content">
      <main>
        <section class="l-sec mypage-detail">
          <div class="inner">
            <div class="page-title maru">求人情報の編集が完了しました。</div>
            <p>
              求人募集の終了、求人情報の修正、求人情報の追加は【マイページ】<br />
              続けて求人情報を登録する場合は【続けて求人情報登録へ】のボタンを押してください。
            </p>
            <div class="back-btn-items">
              <div class="btn-base maru">
                <RouterLink :to="{ name: 'BusinessMyPage' }">マイページへ</RouterLink>
              </div>
              <div class="btn-base maru">
                <RouterLink :to="{ name: 'BizJobsOpen' }">募集一覧へ</RouterLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
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
  </body>
    <PcModel />
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
</script>
