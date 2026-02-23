<!-- src/views/Auth/WithdrawDoneView.vue -->
<!-- 退会完了-->
<template>
  <body class="signout">
    <div class="wrap">

      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <div class="content">
        <main>
          <div class="l-sec signout-detail">
            <div class="page-title maru">退会しました。</div>
            <div class="inner">
              <p class="txt-center">ご利用ありがとうございました。</p>
      	      <div class="btn-base maru">
                <a href="/">トップページへ</a>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AppFooter />
    </div>
  </body>

  <!-- <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png">
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
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

/** 退会完了時に確実にログアウトさせる */
onMounted(() => {
  const KEYS = ['token', 'userId', 'userType']
  try {
    KEYS.forEach(k => localStorage.removeItem(k))
    // ほかに認証関連で保存しているキーがあればここへ追加
  } catch (e) {
    if (import.meta?.env?.DEV) console.debug('[withdraw:logout] localStorage remove failed:', e)
  }
})
</script>
