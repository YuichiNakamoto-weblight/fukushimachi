<!-- src/views/Account/AccountChangeEmailCompleteView.vue -->
 <!-- メールアドレス変更完了画面 -->
<template>
  <div class="wrap">
    <!-- 共通ヘッダー -->
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec signup-detail">
        <div class="page-title maru">メールアドレス変更完了</div>

        <div class="inner">
          <p class="txt-center" style="line-height: 2;">
            メールアドレスの変更が完了しました。<br />
            次回からは新しいメールアドレスでログインしてください。
          </p>

          <div class="form-btn-item" style="margin-top: 40px;">
            <RouterLink to="/login" class="btn-outline-orange">
              ログイン画面へ戻る
            </RouterLink>
          </div>

        </div>
      </section>
    </main>

    <!-- 共通フッター -->
    <AppFooter />
  </div>

  <!-- ページ下層の固定背景たち（他ページと同じ構成） -->
  <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt />
  </div>

  <div class="hero-copy pc">
    <img
      src="/src/assets/images/home/hero-copy.svg"
      alt="はなして、わかって、マッチする。あたらしい介護の就活。"
    />
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/">
        <img
          src="/src/assets/images/common/sitelogo.svg"
          alt="ふくしま介護福祉就職情報サイト「ふくしまち」"
        />
      </a>
    </h1>

    <h1 class="sitelogo user-content">
      <a href="/user">
        <img
          src="/src/assets/images/common/sitelogo.svg"
          alt="ふくしま介護福祉就職情報サイト「ふくしまち」"
        />
      </a>
    </h1>

    <h1 class="sitelogo employer-content">
      <a href="/employer">
        <img
          src="/src/assets/images/common/sitelogo.svg"
          alt="ふくしま介護福祉就職情報サイト「ふくしまち」"
        />
      </a>
    </h1>
  </div>

  <div class="pc">
    <div class="user-content login-content">
      <div class="mypage-link">
        <a href="/user/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ" />
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <a href="/employer/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ" />
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>
  </div>

  <PcModel />
</template>

<script setup>
// 共通ヘッダー／フッター
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
// 完了画面なのでロジックなし
</script>

<style scoped>
.page-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 30px;
}

/* アウトラインのオレンジ丸ボタン（画像のイメージに合わせる） */
.btn-outline-orange{
  display: inline-block;
  padding: 12px 28px;
  border: 2px solid #F2663A;    /* オレンジの枠 */
  color: #F2663A;               /* 文字もオレンジ */
  background: #fff;             /* 透明/白背景 */
  border-radius: 9999px;        /* まん丸 */
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, box-shadow .2s ease;
}
.btn-outline-orange:hover{
  background: rgba(242,102,58,0.08);  /* うっすら橙 */
}
.btn-outline-orange:active{
  background: rgba(242,102,58,0.15);
}
.btn-outline-orange:focus{
  outline: none;
  box-shadow: 0 0 0 3px rgba(242,102,58,.25);
}

/* 既存の .form-btn-item で中央寄せされますが保険で */
.form-btn-item{ display:flex; justify-content:center; }
</style>
