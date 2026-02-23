<template>
  <!-- 共通フッター -->
  <footer>
    <div class="footer-inner">
      <div class="footer-img01">
        <img :src="footerImg01" alt="" />
      </div>
      <div class="footer-img02">
        <img :src="footerImg02" alt="" />
      </div>
      <div class="fukushima-mark">
        <img :src="fukushimaMark" alt="" />
      </div>
      <div class="operation">
        <p>
          【運営】<br />
          株式会社INTALES
        </p>
      </div>
      <div class="consignor">
        <p>
          【委託元】<br />
          福島県保健福祉部 社会福祉課
        </p>
      </div>
      <div class="btn-footer">
        <router-link to="/policy">プライバシーポリシー</router-link>
        <a
          href="http://wwwcms.pref.fukushima.jp/sec/01010d/koho-chosakuken.html"
          target="_blank"
          rel="noopener noreferrer"
        >リンク・著作権・免責事項</a>
      </div>
      <p class="copyright">© Fukushima Prefecture. All Rights Reserved。</p>
    </div>
  </footer>
</template>

<script setup>
/* 画像は import 方式（Vite推奨） */
import footerImg01 from '@/assets/images/common/footer-img01.png'
import footerImg02 from '@/assets/images/common/footer-img02.png'
import fukushimaMark from '@/assets/images/common/fukushim-jitsugen.png'
</script>

<style scoped>
/* サイト共通CSSに依存。必要ならここに微調整を追加 */
</style>
