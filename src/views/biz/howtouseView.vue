<!-- src/views/biz/howtouseView.vue -->
 <!-- 事業者用使い方ページ -->
<template>
  <body class="howtouse is-employer">
    <div class="wrap">
      <AppHeader data-app-header />
      <HamburgerMenu />
      <FooterNav />

      <main>
        <section class="l-sec howtouse">

          <!-- ===== lead ===== -->
          <div class="l-about-lead">
            <div class="inner">
              <div class="about-title-img">
                <img src="/src/assets/images/howtouse/about-title.svg" alt="" @error="onImgErr" />
              </div>
              <div class="page-title maru">ふくしまちとは</div>
              <p>
                福島県のどこかにある、<br />
                介護の仕事をしている人と<br />
                介護の仕事を探している人が集まる街。
              </p>
              <p>
                介護の仕事に就きたい人と介護施設を結び<br />
                介護の仕事に役立つ情報を伝え<br />
                そして、介護の未来を良くするWebサイトです。
              </p>
              <p>
                あなたの施設に興味を持った方から連絡が届いたら<br />
                積極的にコミュニケーションを取ってみましょう。
              </p>
              <p>
                あなたの施設の採用活動にお役立てください。
              </p>
            </div>
            <div class="about-lead-bg">
              <img src="/src/assets/images/howtouse/about-bg01.png" alt="" @error="onImgErr" />
            </div>
          </div>

          <!-- ===== sec 01 ===== -->
          <div class="l-about-sec01">
            <div class="l-about-sec01-bg">
              <div class="inner">
                <div class="sec01-img">
                  <img src="/src/assets/images/howtouse/about-ill01.png" alt="" @error="onImgErr" />
                </div>

                <div class="sec-title maru key-c">求人情報を<br>登録・公開しましょう。</div>
                <!-- <div class="mv">
                  <img src="/src/assets/images/howtouse/comingsoon.png" alt="" @error="onImgErr" />
                </div> -->
                   <div class="mv">
                    <video
                      class="mv-video"
                      :src="jobResistUrl"
                      :poster="comingSoon"
                      autoplay
                      muted
                      playsinline
                      loop
                      preload="auto"
                    ></video>
                  </div>


                <div class="sec-title maru key-c">お知らせコーナーで<br>あなたの施設について<br>配信をしましょう。</div>
                <!-- <div class="mv">
                  <img src="/src/assets/images/howtouse/comingsoon.png" alt="" @error="onImgErr" />
                </div> -->
                  <div class="mv">
                    <video
                      class="mv-video"
                      :src="jobNewstUrl"
                      :poster="comingSoon"
                      autoplay
                      muted
                      playsinline
                      loop
                      preload="auto"
                    ></video>
                  </div>
              </div>
            </div>
          </div>

          <!-- ===== sec 02 ===== -->
          <div class="l-about-sec02">
            <div class="l-about-sec02-bg">
              <div class="inner">
                <div class="sec-title maru key-c">
                  トークで求職者とのやりとりを<br />
                  積極的に行いましょう。
                </div>
                <p>
                  あなたの施設に興味を持った求職者から<br />
                  グッドが届いたら、<br />
                  トーク画面で求職者の方と直接メッセージの<br />
                  やりとりができます。
                </p>
                <p>
                  また、施設の情報を見て質問したいと思った求職者から<br />
                  トーク画面に質問が届くことがあります。<br />
                  トーク画面に新着があるかチェックしてください。
                </p>
              </div>
            </div>
          </div>

          <!-- back -->
          <div class="btn-back">
            <a href="#" @click.prevent="goBack">
              <span class="ico">
                <img src="/src/assets/images/common/ico-back.svg" alt="" @error="onImgErr" />
              </span>
              戻る
            </a>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>

    <!-- 背景画像（PC用） -->
    <!-- <div class="body-bg pc">
      <img src="/src/assets/images/common/bg-pc.png" alt="" />
    </div> -->
  </body>

  <!-- モデルビュー -->
  <PcModel />
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

import jobResistUrl from '@/assets/images/common/JobResistTutorial.mp4?url'
import jobNewstUrl from '@/assets/images/common/NewsResistTutorial.mp4?url'
import comingSoon   from '@/assets/images/howtouse/comingsoon.png?url'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'Home' })
}

function onImgErr(e) {
  const t = e?.target
  if (t) {
    t.onerror = null
    t.src = '/stock-images/no-image.png'
  }
}

// ===== スマホのヘッダー被り対策：実測高さ → CSS変数 =====
function updateHeaderHeight () {
  const headerEl =
    document.querySelector('[data-app-header]') ||
    document.querySelector('header')
  if (!headerEl) return
  const h = Math.round(headerEl.getBoundingClientRect().height)
  if (h > 0) {
    document.documentElement.style.setProperty('--header-height', `${h}px`)
  }
}
onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})
</script>


<style scoped>
.about-title-img {
  width: 120px;
  margin: 0 auto;
  padding-top: 44px;
}
.page-title {
  font-size: 26px;
}
.l-about-lead {
  background: #fffcda;
}
.l-about-lead p {
  font-size: 14px;
  text-align: center;
}
.l-about-sec01 {
  background: #f2f2f2;
}
.l-about-sec01-bg {
  background: #fff;
  border-radius: 0 0 0 40px;
  padding-bottom: 30px;
}
.sec01-img {
  width: 200px;
  margin: 0 auto;
  padding-bottom: 40px;
}
.key-c {
  color: #fe8365;
}
.l-about-sec01 p {
  font-size: 14px;
  text-align: center;
}
.l-about-sec02 {
  background: #fff;
}
.l-about-sec02-bg {
  background: #f2f2f2;
  border-radius: 0 0 0 40px;
  padding: 40px 0;
}
.l-about-sec02 p {
  font-size: 14px;
  text-align: center;
}
.howtouse .sec-title {
  line-height: 1.5em;
}
.mv {
  margin-bottom: 30px;
}
/* .btn-back {
  margin: 40px 0;
  text-align: center;
} */
.btn-back a {
  display: inline-flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-size: 16px;
}
.btn-back .ico {
  margin-right: 8px;
}

/* 追加 */
.mv-video{
  width: 100%;
  max-width: 960px;
  display: block;
  margin: 0 auto;
  border-radius: 12px;
  background: #000;
  aspect-ratio: 16 / 9;      /* 16:9 の枠を維持 */
  object-fit: cover;         /* 枠にフィットさせる */
}


/* ▼ スマホでヘッダーに隠れないよう main を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* 初期値。JSの実測で上書きされます */
  main{
    padding-top: var(--header-height);
  }
  /* 先頭セクションの相殺マージンを防ぐ保険（必要なら） */
  main > .l-sec:first-child{ margin-top: 0; }
}
</style>
