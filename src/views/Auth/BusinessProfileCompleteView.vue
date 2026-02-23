<!-- src/views/Auth/BusinessProfileCompleteView.vue -->
<!-- 事業者用プロフィール登録完了画面 -->
<template>
  <div class="wrap">
    <HamburgerMenu />

    <main>
      <section class="l-sec signup-detail">
        <div class="page-title maru">登録ありがとうございます！</div>

        <div class="inner">
          <div class="signup-step flex">
            <div class="signup-step__step step1">アカウント<br>登録</div>
            <div class="signup-step__step step2">ワンタイム<br>パスワード<br>入力</div>
            <div class="signup-step__step step3">プロフィール<br>作成</div>
            <div class="signup-step__step step4 select">完了</div>
          </div>
        </div>

        <div class="inner">
          <div class="txt-center" style="line-height:1.9; margin: 20px 0;">
            <strong class="bold" style="font-size:20px; margin-bottom:16px;">
              ふくしま介護福祉就職情報サイト<br />
              ふくしまちへようこそ！
            </strong>

            <p style="margin-bottom:12px; text-align:left;">
              ふくしまちは、<br />
              介護の仕事に就きたい人と介護施設を結び、<br />
              介護の仕事に役立つ情報を伝え<br />
              そして、介護の未来を良くする Web サイトです。<br />
              どんどん使って御社の採用活動にお役立てください。
            </p>
          </div>

          <div class="form-btn-items-lead txt-center" style="margin-top:8px;">求人を募集したい</div>
          <div class="form-btn-item">
            <router-link class="btn btn-primary maru" :to="{ name: 'JobRegisterForm' }">
              求人情報登録へ
            </router-link>
          </div>

          <div class="form-btn-items-lead txt-center" style="margin-top:8px;">今は求人を募集していない</div>

          <div class="form-btn-item" style="margin-top:8px;">
            <RouterLink class="btn btn-primary maru" :to="{ name: 'BusinessMyPage' }">
              マイページへ
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>

  <PcModel />
</template>

<script setup>
import { onMounted } from 'vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import PcModel from '@/components/layout/PcModel.vue'

// ★ この画面が表示されたタイミングで dataLayer イベント送信（求職者登録完了）
onMounted(() => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'conversion_complete',
    conversion_label: 'wleNCM3r2MsBELO0jJgD' // 任意（GTM側で使うなら残す）
  })
})
</script>

<style>
.form-btn-item {
  display: flex;
  justify-content: center;
}
/* 既存: .btn .btn-primary .maru を上書きして pill 化 */
.form-btn-item .btn.btn-primary.maru {
  writing-mode: horizontal-tb;
  transform: none;

  background: #fff;
  color: #42b2e6;
  border: 2px solid #42b2e6;
  border-radius: 9999px;
  letter-spacing: 0.08em;
  font-weight: 700;
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: min(720px, 80vw) !important;
  margin: 4px auto;
  padding: 0 24px;
}
.signup-step__step.step4.select { background-color: #42b2e6; }
</style>
