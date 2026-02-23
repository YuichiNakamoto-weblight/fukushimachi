<!-- src/setting/MailReceiveSettingView.vue -->
<template>
  <div class="wrap signup is-guest signup-setting">
    <!-- 共通ヘッダー -->
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec signup-detail">
        <!-- タイトル -->
        <div class="page-title maru">メールの受信設定</div>

        <!-- 説明 -->
        <div class="inner signup-lead">
          <p>
            アカウント作成後、確認メールをお送りします。受信できない場合、迷惑メールフォルダに
            振り分けられている可能性がございます。
          </p>
          <p>
            【@fukushimachi.com】からのメールを受信できるよう、事前に設定のご確認をお願いいたします。
          </p>
        </div>

        <!-- 戻る（左矢印＋テキスト） -->
        <div class="btn-back">
          <a href="#" @click.prevent="goBack">
            <span class="ico"><img :src="icoBack" alt="" /></span>
            戻る
          </a>
        </div>

        <!-- 下部リンク（必要なら） -->
        <div class="inner" style="margin-top: 40px;">
          <router-link class="btn-mini" to="/privacy">プライバシーポリシー</router-link>
        </div>
      </section>
    </main>

    <!-- 共通フッター -->
    <AppFooter />

  </div>

  <div class="body-bg pc">
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
  </div>
    <PcModel />
</template>


<script setup>
import { useRouter } from 'vue-router'

/* 画像は必ず import して :src で渡す */
import icoBack from '@/assets/images/common/ico-back.svg'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()
const goBack = () => router.back()
</script>
