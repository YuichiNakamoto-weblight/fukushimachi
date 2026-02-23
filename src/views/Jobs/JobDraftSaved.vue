<!-- src/views/jobs/JobDraftSaved.vue -->
<!-- 下書き保存後の完了ページ -->
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
              下書きが保存されました。<br>
              続きはいつでも編集できます。
            </div>
            <p>
              下書きの編集・公開は【マイページへ】から行えます。<br>
              すぐに別の求人を作成する場合は【続けて求人情報登録へ】を押してください。
            </p>

            <div class="back-btn-items">
              <div class="btn-base maru">
                <RouterLink :to="{ name: 'BusinessMyPage' }">マイページへ</RouterLink>
              </div>

              <!-- 直前に作った下書きがある場合だけ編集リンクを出す（?id=xxx 受け取り） -->
              <div v-if="jobId" class="btn-base maru">
                <RouterLink :to="{ name: 'JobEditForm', params: { id: jobId } }">
                  この下書きを編集する
                </RouterLink>
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

    <!-- 背景など（公開完了ページと同じ構成） -->
    <div class="body-bg pc">
      <img src="/src/assets/images/common/bg-pc.png" alt="">
    </div>

    <div class="hero-copy pc">
      <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
    </div>

    <div class="pc">
      <h1 class="sitelogo guest-content">
        <a href="/"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」"></a>
      </h1>

      <h1 class="sitelogo user-content">
        <a href="/user"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」"></a>
      </h1>

      <h1 class="sitelogo employer-content">
        <a href="/employer"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」"></a>
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
  </body>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'

const route = useRoute()
// Job登録APIが返す id を ?id=xxx で受け取り、編集ボタンの表示に使う
const jobId = route.query.id
</script>
