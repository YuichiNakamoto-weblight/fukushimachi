<!-- src/views/Auth/WithdrawIntroView.vue -->
<!-- 退会手順-->
<template>
  <body>
    <div class="wrap">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main>
        <section class="l-sec signout-detail">
          <div class="page-title maru">退会手順</div>
            <div class="inner">
              <div class="signout-flow">
              <div class="sec-subtitle txt-center">下記手順で退会にお進みください。</div>
                <ul class="indent">
                  <li>○下部に表示されている「退会に進む」をタップする</li>
                  <li>○退会理由を選択し、内容を確認のうえチェックする</li>
                  <li>○「上記に同意して退会する」をタップする</li>
                </ul>
              </div>
              <div class="signout-flow">
                <div class="sec-subtitle txt-center">退会の注意点</div>
                  <p>退会後に同じメールアドレス（使用されていない場合）で再登録は可能ですが、履歴は一度リセットされますのでご注意ください。</p>
                <div class="btn-base maru">
                  <a @click="goNext">退会に進む</a>
                </div>
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
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
const router = useRouter()
const goNext = () => router.push({ name: 'WithdrawForm' })
</script>
