<!-- src/views/Contact/SeekerContactComplete.vue -->
<!-- 求職者お問い合わせフォーム確認画面 -->
<template>
  <body class="contact is-user is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main>
        <section class="l-sec contact-detail">
          <div class="inner">
            <div class="page-title maru">お問い合わせを送信しました</div>

            <p>お問い合わせをふくしまち事務局に送信しました。
              返信は、ご登録されたメールアドレスにお送りします。
              返信まで3 営業日程度かかる場合がありますので
              ご了承ください。
            </p>

            <div class="btn-base maru">
              <router-link :to="{ name: 'Top' }">トップページ</router-link>
            </div>

          </div>
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

<style scoped>
.contact .inner{ max-width:720px; margin:0 auto; }
.page-title{ text-align:center; font-size:26px; font-weight:700; margin:6px 0 16px; }
.panel{ background:#f5f7fa; border:1px solid #e5e7eb; border-radius:12px; padding:16px; }
.lead{ color:#444; line-height:1.9; text-align:center; }
.lead .em{ font-weight:700; }
.actions{ display:flex; justify-content:center; margin-top:18px; }
.btn{ padding:12px 20px; border-radius:999px; border:0; cursor:pointer; font-weight:700; }
.btn-primary{ background:#42b2e6; color:#fff; text-decoration:none; }

/* 固定ヘッダーの下にタイトルが潜らないように上マージンを付与（スマホ） */
@media (max-width: 768px){
  .contact .page-title {
    /* ヘッダーの実高さに合わせて 56px/64px など調整してください */
    margin-top: calc(64px + env(safe-area-inset-top, 0));
  }
}
</style>
