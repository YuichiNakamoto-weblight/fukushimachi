<!-- src/views/Auth/SeekerProfileCompleteView.vue -->
<template>
  <div class="wrap">

    <!-- 共通ヘッダー -->
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

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

        <div class="inner signup-lead">
          <strong>詳しい求人情報が<br>
            閲覧できるようになりました。
          </strong>
          <p>
            登録いただいたあなたのプロフィールはあなたがトークした施設、<br />
            グッドボタンを押した施設へお知らせします。<br /><br />
            ふくしまちは、<br />
            介護の仕事に就きたい人と介護施設を結び、<br />
            介護の仕事に役立つ情報を伝え、<br />
            そして、介護の未来を良くする Web サイトです。<br /><br />
            どんどん使ってあなたの就活にお役立てください。
          </p>
        </div>

        <div class="inner">
          <div class="form-btn-item">
            <RouterLink class="btn btn-primary maru" :to="{ name: 'SeekerMyPage' }">
              マイページへ
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <!-- 共通フッター -->
    <AppFooter />
  </div>
  <PcModel />
</template>

<script setup>
import { onMounted } from 'vue'

/* 共通ヘッダー／フッター */
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
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

<style scoped>
.form-btn-item {
  display: flex;
  justify-content: center;
}
/* 既存: .btn .btn-primary .maru を上書きして pill 化 */
.form-btn-item .btn.btn-primary.maru {
  writing-mode: horizontal-tb;
  transform: none;

  background: #fff;
  color: #fe8266;
  border: 4px solid #fe8266;
  border-radius: 9999px;
  letter-spacing: .08em;
  font-weight: 700;
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: min(720px, 80vw) !important;
  margin: 24px auto;
  padding: 0 24px;
}

.form-btn-item .btn.btn-primary.maru:hover {
  background: rgba(254,130,102,.06);
}
.form-btn-item .btn.btn-primary.maru:focus-visible {
  outline: 3px solid rgba(254,130,102,.35);
  outline-offset: 2px;
}
</style>
