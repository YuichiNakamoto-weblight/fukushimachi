<!-- src/views/PolicyView.vue -->
<!-- プライバシーポリシー-->
<template>
  <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />
    <main>
      <section class="l-sec">
        <div class="page-title maru">プライバシーポリシー</div>
        <div class="inner">
          <p>
            福島県（以下「当県」）は、個人情報保護の重要性を認識し、適切な管理体制のもとで個人情報の保護を徹底することを目的として、以下のとおりプライバシーポリシーを定め、これを遵守いたします。
          </p>

          <div class="sec-subtitle">1. 個人情報の管理</div>
          <p>
            当県は、お客様の個人情報を正確かつ最新の状態で管理し、不正アクセス、紛失、破損、改ざん、漏えいなどを防止するために、適切なセキュリティ対策を講じ、個人情報の厳重な管理を実施いたします。
          </p>

          <div class="sec-subtitle">2. 個人情報の利用目的</div>
          <p>取得した個人情報は、以下の目的に限り利用いたします。</p>
          <ul>
            <li>・お問い合わせに対するご回答やご連絡</li>
            <li>・サービスのご案内やご提供</li>
            <li>・資料送付等、当県からのご案内</li>
          </ul>

          <div class="sec-subtitle">3. 個人情報の第三者提供について</div>
          <p>当県は、以下の場合を除き、個人情報を第三者に提供することはありません。</p>
          <ul>
            <li>・ご本人の同意がある場合</li>
            <li>・サービス提供にあたり、業務委託先に必要な範囲で開示する場合</li>
            <li>・法令に基づき開示が必要な場合</li>
          </ul>

          <div class="sec-subtitle">4. 個人情報の安全対策</div>
          <p>
            当県は、個人情報の安全性確保のため、必要かつ適切な安全管理措置を講じ、継続的な見直しと改善に努めております。
          </p>

          <div class="sec-subtitle">5. ご本人による個人情報の開示・訂正・削除等</div>
          <p>
            お客様がご自身の個人情報について、開示・訂正・削除等をご希望される場合には、プロフィールにて編集や退会が可能です。
          </p>

          <div class="sec-subtitle">6. Google Analytics の利用について</div>
          <p>
            当ウェブサイトでは、利用状況の把握およびサービス向上を目的に、Google Analytics を使用してアクセス情報を収集しています。Google Analytics はCookie を使用し、個人を特定する情報は収集いたしません。収集されたデータはGoogle 社のプライバシーポリシーに基づき管理されます。
          </p>
          <ul>
            <li><a href="https://marketingplatform.google.com/" target="_blank">Google アナリティクス利用規約</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank">Google プライバシーポリシー</a></li>
          </ul>

          <div class="sec-subtitle">7. 法令・規範の遵守と見直し</div>
          <p>
            当県は、個人情報の保護に関する日本の法令およびその他の規範を遵守し、本ポリシーの内容を随時見直し、その改善に努めてまいります。
          </p>

          <div class="sec-subtitle">8. 委託管理について</div>
          <p>
            本ウェブサイトの管理業務は、株式会社INTALES が受託し、適切な管理のもとで運営されています。
          </p>
        </div>

        <div class="btn-back">
          <!-- 参考HTMLの挙動をVueで安全に再現 -->
          <a href="#" @click.prevent="$router.back()">
            <span class="ico">
              <img src="/src/assets/images/common/ico-back.svg" alt="" />
            </span>
            戻る
          </a>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
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
/* 既存のデザイン体系に寄せます。必要なら微調整してください。 */
.page-title.maru {
  font-size: 24px;
  font-weight: 700;
  margin: 8px 0 16px;
}

.sec-subtitle {
  font-weight: 700;
  margin: 18px 0 8px;
  font-size: 18px;
}

.inner p {
  line-height: 1.8;
  margin: 0 0 10px;
}

ul {
  margin: 0 0 16px 1.2em;
}

@media (min-width: 820px) {
  .inner {
    max-width: 880px;
    margin: 0 auto;
  }
}

/* スマホでページ先頭がヘッダーに隠れないよう top 余白を付与 */
@media (max-width: 820px) {
  main {
    /* ヘッダー高 56px を既定値に。iOS のノッチ分も考慮 */
    padding-top: calc(var(--app-header-h, 56px) + env(safe-area-inset-top, 0px));
    /* 旧iOS対応（constant）— 上書きされてもOK */
    padding-top: calc(var(--app-header-h, 56px) + constant(safe-area-inset-top));
  }
}

/* タイトルが詰まりすぎないよう微調整（任意） */
.page-title.maru {
  margin-top: 50px; /* ここはお好みで */
}

</style>
