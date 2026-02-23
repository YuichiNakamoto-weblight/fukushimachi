<!-- src/views/public/howtouseView.vue -->
 <!-- 使い方ページ -->
<template>
  <body class="howtouse is-seeker">
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
                そして、介護の未来を良くするWeb サイトです。
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
                <div class="sec-title maru key-c">まずは求人情報を見てみましょう。</div>
                <p>
                  ふくしまちは、福島県が運営するサイトです。<br />
                  安心して働くことができる<br />
                  福島県内の介護施設の求人情報をご紹介しています。<br />
                  まずは求人情報をチェックして<br />
                  どんな募集があるか見てみましょう。
                </p>
              </div>
            </div>
          </div>

          <!-- ===== sec 02 ===== -->
          <div class="l-about-sec02">
            <div class="l-about-sec02-bg">
              <div class="inner">
                <div class="sec-title maru key-c">求人情報を検索してみましょう。</div>
                <p>
                  あなたが働きたい場所はどこですか？<br />
                  あなたが働きたい施設はどんなところですか？<br />
                  エリアや条件を選択して<br />
                  あなたに合った求人情報を探してください。
                </p>
                <div class="about-ss">
                  <img src="/src/assets/images/howtouse/about-ss.png" alt="" @error="onImgErr" />
                </div>
              </div>
            </div>
          </div>

          <!-- ===== sec 03 ===== -->
          <div class="l-about-sec03">
            <div class="l-about-sec03-bg">
              <div class="inner">
                <div class="sec-title maru key-c">
                  介護施設にあなたの思いを<br />伝えましょう。
                </div>
                <p class="sec-lead">
                  求人情報のページには3つのボタンがあります。<br />
                  ※ボタンは登録後に押すことができます。
                </p>

                <div class="home-about-item">
                  <div class="home-about-item-copy">
                    <img src="/src/assets/images/home/item-clip-copy.svg" alt="気になる求人情報を保存できるボタン" @error="onImgErr" />
                  </div>
                  <div class="home-about-item-detail flex">
                    <div class="home-about-item-ico">
                      <img src="/src/assets/images/home/clip.svg" alt="CLIP" @error="onImgErr" />
                    </div>
                    <div class="home-about-item-txt">
                      <div class="home-about-item-name">
                        <img src="/src/assets/images/home/clip-name.svg" alt="クリップ" @error="onImgErr" />
                      </div>
                      <p>
                        相手とやりとりする前に<br />
                        もう少し検討したい場合、<br />
                        気軽に情報を保存できます。
                      </p>
                    </div>
                  </div>
                </div>

                <div class="home-about-item">
                  <div class="home-about-item-copy">
                    <img src="/src/assets/images/home/good-copy.svg" alt="介護施設に興味があることを伝えるボタン" @error="onImgErr" />
                  </div>
                  <div class="home-about-item-detail flex">
                    <div class="home-about-item-ico">
                      <img src="/src/assets/images/home/good.svg" alt="GOOD" @error="onImgErr" />
                    </div>
                    <div class="home-about-item-txt">
                      <div class="home-about-item-name">
                        <img src="/src/assets/images/home/good-name.svg" alt="グッド" @error="onImgErr" />
                      </div>
                      <p>
                        気になる求人情報にグッドを押すと<br />
                        介護施設に通知！会話を始める<br />
                        きっかけ作りをしましょう。
                      </p>
                    </div>
                  </div>
                </div>

                <div class="home-about-item">
                  <div class="home-about-item-copy">
                    <img src="/src/assets/images/home/talk-copy.svg" alt="介護施設にメッセージが送れるボタン" @error="onImgErr" />
                  </div>
                  <div class="home-about-item-detail flex">
                    <div class="home-about-item-ico">
                      <img src="/src/assets/images/home/talk.svg" alt="TALK" @error="onImgErr" />
                    </div>
                    <div class="home-about-item-txt">
                      <div class="home-about-item-name">
                        <img src="/src/assets/images/home/talk-name.svg" alt="トーク" @error="onImgErr" />
                      </div>
                      <p>
                        わからないことや不安なことなど<br />
                        モヤモヤがあったら<br />
                        気軽に質問してみましょう！
                      </p>
                    </div>
                  </div>
                </div>

                <div class="sec-strong maru key-c">
                  積極的にアクションすることで<br />
                  あなたの理想の就職先が見つかるかも！？<br />
                  どんどん活用してください。
                </div>
              </div>
            </div>
          </div>

          <!-- ===== sec 04 ===== -->
          <div class="l-about-sec04">
            <div class="l-about-sec04-bg">
              <div class="inner">
                <div class="sec-title maru key-c">特集を読んでみましょう。</div>
                <p>
                  特集を読んでみましょう。求人募集をしている介護施設をくわしく紹介する記事や福島県の取組み、イベント情報、資格取得情報など
                  様々な介護にまつわる記事を掲載しています。
                </p>
                <p>
                  介護の仕事への<br />モチベーションUPにつながる特集です。<br />ぜひご覧ください。
                </p>
                <div class="sec03-img">
                  <img src="/src/assets/images/howtouse/about-ill02.png" alt="" @error="onImgErr" />
                </div>
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

    <div class="body-bg pc">
      <img src="/src/assets/images/common/bg-pc.png" alt="" />
    </div>
  </body>
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

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'Home' })
}

// ===== ヘッダー高さ → CSS 変数（スマホの被り対策）=====
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

function onImgErr(e) {
  const t = e?.target
  if (t) { t.onerror = null; t.src = '/stock-images/no-image.png' }
}
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
.l-about-sec03 {
background: #fffcda;
}

.l-about-sec03-bg {
    background: #fff;
    border-radius: 0 0 0 40px;
	padding: 40px 0;
}
.l-about-sec03 p.sec-lead {
font-size: 14px;
	text-align: center;
}
.sec-strong.maru.key-c {
    font-weight: 600;
    text-align: center;
    line-height: 1.6;
    padding-top: 40px;
}
.l-about-sec04 {
background: #fff;
}

.l-about-sec04-bg {
    background: #fffcda;
    border-radius: 0 0 0 40px;
	padding: 40px 0;
}
.l-about-sec04 p {
    font-size: 14px;
    text-align: center;
}
.sec03-img {
    width: 100%;
    margin: 0 auto;
    text-align: right;
}
.sec03-img img {
    display: inline-block;
    width: 40%;
}

/* Responsive */
@media (min-width: 880px){
  .l-about-lead p { font-size: 18px; }
  .home-about-item-detail.flex { justify-content:flex-start; }
  .home-about-item-txt p { text-align:left; }
}

/* ▼ スマホでヘッダーに隠れないよう main を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* 初期値。JS で実測値に上書きされます */
  main{
    padding-top: var(--header-height);
  }
  /* 先頭セクションの相殺マージンを防ぐ保険（必要なら） */
  main > .l-sec:first-child{ margin-top: 0; }
}
</style>
