<!-- src/views/Auth/RegisterChoiceView.vue -->
<!-- ログイン前アカウント登録画面 -->
<template>
  <body class="singup is-guest">
    <div class="wrap">
      <div class="content">
        <AppHeader />
        <HamburgerMenu />
        <FooterNav />

        <main>
          <section class="l-sec signup-detail">
            <div class="page-title maru">アカウント登録</div>

            <h1 class="mypage-title">
              マイページ登録しませんか？<br />
              <span class="mypage-title__sub">（無料登録／約１〜2分）</span>
            </h1>

            <!-- ✅ 求職者向け案内文（最下部に「求職者の方」ボタン） -->
            <div class="seeker-info" aria-label="求職者向けの案内">
              <p class="seeker-info__lead">
                給与や施設の方からのメッセージなど求人情報の詳細が閲覧できる他、<br />
                気になる求人の保存、施設とグッドやトークでやりとりできる<br />
                コミュニケーション機能を利用できます。<br />
                まずは情報収集からでも大歓迎！
              </p>

              <!-- <ul class="seeker-info__list">
                <li>・給与や勤務条件の詳しい内容</li>
                <li>・職場の雰囲気</li>
                <li>・ここにしか載っていない情報</li>
              </ul> -->

              <!-- <p class="seeker-info__sub">
                無料登録（約1〜2分）で、すべて閲覧できます。<br />
                応募は後からでOK。まずは情報収集だけでも歓迎です。
              </p> -->

              <!-- ✅ 最下部に配置（サイズはpill共通なので事業者ボタンと同じ） -->
              <div class="seeker-info__cta">
                <RouterLink
                  :to="{ name: 'RegisterSeeker' }"
                  class="pill btn-seeker"
                  aria-label="求職者の方はこちらから"
                >
                  求職者の方はこちらから
                </RouterLink>
              </div>
            </div>

            <!-- ✅ 事業者向け（枠） -->
            <div class="choice-frame">
              <!-- <div class="choice-frame__title">事業者の方の登録はこちらから</div> -->

              <div class="btn-stack">
                <RouterLink
                  :to="{ name: 'RegisterFacility' }"
                  class="pill btn-facility"
                  aria-label="事業者の方の登録はこちらから"
                >
                  事業者の方の登録はこちらから
                </RouterLink>
              </div>
            </div>

            <p class="note">
              既にアカウントをお持ちの方は
              <RouterLink to="/login">ログイン</RouterLink>
              してください。
            </p>
          </section>
        </main>
        <div class="btn-back">
          <a href="#" onclick="history.back()" return="false;=">
            <span class="ico">
              <img src="/src/assets/images/common/ico-back.svg" />
            </span>
            戻る
          </a>
        </div>
        <AppFooter />
      </div>
    </div>
  </body>
  <PcModel />
</template>

<script setup>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
import FooterNav from "@/components/layout/FooterNav.vue";
import PcModel from "@/components/layout/PcModel.vue";
</script>

<style scoped>
.auth-register {
  display: grid;
  place-items: center;
  padding: 48px 16px;
}
.container {
  width: 100%;
  max-width: 520px;
  text-align: center;
}
.title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-bottom: 24px;
  color: #222;
}
.btn-stack {
  display: grid;
  gap: 14px;
}
.pill {
  display: block;
  width: 100%;
  border-radius: 9999px;
  padding: 14px 20px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  text-decoration: none;
  transition:
    transform 0.06s ease,
    filter 0.2s ease,
    opacity 0.2s ease;
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.06),
    0 6px 20px rgba(0, 0, 0, 0.06);
}
.pill:active {
  transform: translateY(1px) scale(0.995);
}
.btn-seeker {
  background: #ff836b;
} /* スクショのコーラル系 */
.btn-facility {
  background: #46a7e8;
} /* スクショのブルー系 */
.pill:hover {
  filter: brightness(1.03);
}

.note {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
  text-align: center;
}
.note a {
  color: #1f74c9;
  text-decoration: underline;
}

.btn-back {
  margin-top: -20px;
  margin-bottom: 50px;
}

/* ===== 求職者向け案内文 ===== */
.seeker-info {
  width: 100%;
  max-width: 520px;
  margin: 14px auto 16px;
  padding: 16px 16px 14px;
  border-radius: 14px;
  background: #fff7f5;
  border: 1px solid rgba(255, 131, 107, 0.35);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.seeker-info__lead {
  margin: 0 0 10px;
  padding: 0 30px 5px 30px;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
  color: #2b2b2b;
}

.seeker-info__list {
  margin: 0 auto 10px;
  padding-left: 1.2em;
  line-height: 1.8;
  color: #333;
  max-width: 420px;
}

.seeker-info__sub {
  margin: 0;
  text-align: center;
  line-height: 1.7;
  color: #444;
  font-size: 14px;
}

/* ===== ボタン枠（求職者向け文言と区切る） ===== */
.choice-frame {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 14px 14px 16px;
  border-radius: 16px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.92);
}

.choice-frame__title {
  text-align: center;
  font-weight: 800;
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
}

/* seeker-info 内のCTAボタン配置 */
.seeker-info__cta {
  display: flex;
  justify-content: center;
  margin-top: 14px;
}

.mypage-title {
  margin: 0 0 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.6;
  color: #2b2b2b;
}

.mypage-title__sub {
  font-size: calc(1em - 2pt);
}
</style>
