<!-- src/views/public/TopPublic.vue -->
<!-- トップページ -->
<template>
  <div class="home">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />

      <!-- ★ フッターナビはキーで再マウント（ログイン状態変化を確実に反映） -->
      <FooterNav :key="footerKey" />

      <!-- スマホTOP -->
      <div class="hero">
        <div class="hero-siteid">
          <img :src="img.siteid" alt="ふくしまち" />
        </div>
        <div class="hero-copy">
          <img :src="img.heroCopy" alt="はなして、わかって、マッチする。あたらしい介護の就活。" />
        </div>
        <div class="hero-house">
          <router-link to="/Jobs">
            <img :src="img.heroHouse" alt="" class="blink-slow" />
          </router-link>
        </div>
        <div class="hero-obj">
          <img :src="img.heroObj" alt="" />
        </div>
        <div class="hero-bg">
          <img :src="img.heroBg" alt="" />
        </div>
      </div>

      <div class="content">
        <main>
          <!-- ★ 追加：SEO用のメイン見出し -->
          <h1 class="home-main-title">福島県の介護就職情報サイト「ふくしまち」</h1>

          <!-- What'sどんなサイト？ -->
          <section class="l-sec home-about">
            <div class="inner">
              <div class="home-sectitle">
                <img :src="img.secTitle01" alt="どんなサイト？" />
              </div>
              <div class="home-about-lead">
                <p>
                  福島県で介護の仕事を探している人と、<br />
                  福島県内の介護施設・事業所を結ぶ<br />
                  介護就職情報サイト「ふくしまち」です。<br />
                  サイトの中に3つのボタン（クリップ・グッド・トーク）があるので、<br />
                  ぜひ使ってみてください!
                </p>
              </div>

              <!-- クリップ -->
              <div class="home-about-item">
                <div class="home-about-item-copy">
                  <img :src="img.itemClipCopy" alt="" />
                </div>
                <div class="home-about-item-detail flex">
                  <div class="home-about-item-ico">
                    <img :src="img.clip" alt="CLIP" />
                  </div>
                  <div class="home-about-item-txt">
                    <div class="home-about-item-name">
                      <img :src="img.clipName" alt="クリップ" />
                    </div>
                    <p>
                      相手とやりとりする前に<br />
                      もう少し検討したい場合、<br />
                      気軽に情報を保存できます
                    </p>
                  </div>
                </div>
              </div>

              <!-- グッド -->
              <div class="home-about-item">
                <div class="home-about-item-copy">
                  <img :src="img.goodCopy" alt="" />
                </div>
                <div class="home-about-item-detail flex">
                  <div class="home-about-item-ico">
                    <img :src="img.good" alt="GOOD" />
                  </div>
                  <div class="home-about-item-txt">
                    <div class="home-about-item-name">
                      <img :src="img.goodName" alt="グッド" />
                    </div>
                    <p>
                      気になる求人情報にグッドを押すと<br />
                      介護施設に通知!会話を始める<br />
                      きっかけを作りましょう。
                    </p>
                  </div>
                </div>
              </div>

              <!-- トーク -->
              <div class="home-about-item">
                <div class="home-about-item-copy">
                  <img :src="img.talkCopy" alt="" />
                </div>
                <div class="home-about-item-detail flex">
                  <div class="home-about-item-ico">
                    <img :src="img.talk" alt="TALK" />
                  </div>
                  <div class="home-about-item-txt">
                    <div class="home-about-item-name">
                      <img :src="img.talkName" alt="トーク" />
                    </div>
                    <p>
                      わからないことや不安なことなど<br />
                      モヤモヤがあったら<br />
                      気軽に質問してみましょう!
                    </p>
                  </div>
                </div>
              </div>

              <div class="btn-more maru">
                <router-link to="/public/howtouse">もっと詳しく使い方をみる</router-link>
              </div>

              <div class="wish-list">
                <p>本サイトをご利用される方へのお願い</p>
                <ul class="sup indent">
                  <li>※本サイトに掲載の求人情報の無断転載はご遠慮ください。</li>
                  <li>※求人を掲載している施設への営業活動はご遠慮願います。</li>
                </ul>
              </div>
            </div>

            <div class="sec-bg">
              <img :src="img.secImg01" alt="" />
            </div>
          </section>

          <!-- お知らせNews -->
          <section class="l-sec home-news">
            <div class="inner">
              <div class="home-sectitle">
                <img :src="img.secTitle02" alt="お知らせ" />
              </div>

              <!-- <div class="news-tabs" role="tablist" aria-label="お知らせカテゴリ">
                <button type="button" class="news-tab is-active" role="tab" aria-selected="true" data-filter="all" tabindex="0">すべて</button>
                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="jobs" tabindex="-1">求人情報</button>
                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="event" tabindex="-1">イベント</button>
                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="office" tabindex="-1">事務局から</button>
                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="facility" tabindex="-1">施設から</button>
              </div> -->

              <ul>
                <!-- お知らせ一覧 -->
              </ul>

              <!-- ニュース（最大5件、タブ付き） -->
              <NewsListInline :limit="5" :use-tabs="true" />

              <div class="btn-more-txt">
                <RouterLink :to="{ name: 'NewsPublic' }">
                  <span class="ico"><img src="/src/assets/images/home/arrow.svg" /></span>
                  <span class="txt">お知らせ一覧</span>
                </RouterLink>
              </div>
            </div>
            <div class="sec-bg">
              <img :src="img.secImg02" alt="" />
            </div>
          </section>

          <!-- 求人情報JOBS -->
          <section class="l-sec home-job">
            <div class="inner">
              <div class="home-sectitle">
                <img :src="img.secTitle03" alt="求人情報" />
              </div>

              <div class="btn-more">
                <RouterLink class="btn-more" :to="{ name: 'Jobs' }">
                  求人情報一覧
                  <span class="ico"><img :src="img.arrow" alt="" /></span>
                </RouterLink>
              </div>
            </div>

            <div class="sec-bg">
              <img :src="img.secImg03" alt="" />
            </div>
          </section>

          <!-- 特集 -->
          <section class="l-sec home-topics">
            <div class="inner">
              <div
                class="home-sectitle"
                style="text-align: center; margin-bottom: 4px; line-height: 0"
              >
                <img
                  src="/src/assets/images/home/sec-title04.svg"
                  style="display: block; margin: 0 auto"
                />
              </div>
              <div class="topics-title-jp maru" style="margin-top: 0">特集</div>

              <!-- ▼ 特集リスト（ランダム2件） -->
              <section v-if="topics.length" class="topics-list">
                <article v-for="(it, idx) in topics" :key="it.id" class="topics-row">
                  <router-link
                    :to="{ name: 'AnnouncementDetail', params: { id: it.id } }"
                    class="topics-row-link"
                  >
                    <header class="topics-row-header">
                      <!-- 左上：施設名ラベル -->
                      <div
                        class="topics-row-facility"
                        :class="{ 'topics-row-facility--second': idx === 1 }"
                      >
                        {{ it.facility_name || "特集" }}
                      </div>
                    </header>

                    <!-- 中央：左に画像、右に本文 -->
                    <div class="topics-row-body">
                      <figure class="topics-row-thumb">
                        <img
                          v-if="hasTopicImage(it)"
                          :src="topicImageUrl(it.image_path)"
                          @error="onTopicImgError"
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        <div v-else class="topics-thumb__ph" aria-hidden="true"></div>
                      </figure>

                      <div class="topics-row-content">
                        <h3 class="topics-row-title">
                          {{ it.title }}
                        </h3>
                        <time class="topics-row-date">
                          {{ formatTopicDate(it.published_at) }}
                        </time>
                      </div>
                    </div>
                  </router-link>
                </article>
              </section>
              <p v-else class="topics-empty">掲載中の特集はありません。</p>
              <!-- ▲ 特集リストここまで -->

              <div class="btn-more-txt">
                <RouterLink :to="{ name: 'OfficeTopics' }">
                  <span class="ico"><img src="/src/assets/images/home/arrow.svg" /></span>
                  <span class="txt">特集</span>
                </RouterLink>
              </div>
            </div>
          </section>

          <!-- お問い合わせ -->
          <section class="l-sec home-contact">
            <div class="inner">
              <div class="home-sectitle">
                <img :src="img.secTitle05" alt="お問い合わせ" />
              </div>
              <div class="btn-more contact">
                <router-link to="/contact/">
                  <span class="ico"
                    ><img :src="img.icoMail" alt="サイトに関するお問い合わせ"
                  /></span>
                  サイトに関するお問い合わせ
                </router-link>
              </div>
              <div class="btn-more faq">
                <router-link :to="{ name: 'Faq' }">
                  <span class="txt">よくある質問</span>
                </router-link>
              </div>
              <div class="btn-more welfare">
                <a href="https://f-fjc.com/" target="_blank">
                  福祉の仕事のご相談は<br class="sp-only" />
                  「福島県福祉人材センター」へ
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AppFooter />
    </div>
  </div>
  <PcModel />
</template>

<script setup>
import { http } from "@/api/http";
import { ref, onMounted, onBeforeUnmount } from "vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
import FooterNav from "@/components/layout/FooterNav.vue";
import NewsListInline from "@/components/news/NewsListInline.vue";
import PcModel from "@/components/layout/PcModel.vue";
/** 画像は import して :src に渡す（/src/assets 直指定はNG） */
import heroHouse from "@/assets/images/home/hero-house.png";
import siteid from "@/assets/images/home/siteid.svg";
import heroCopy from "@/assets/images/home/hero-copy3.svg";
import heroObj from "@/assets/images/home/hero-obj.png";
import heroBg from "@/assets/images/home/hero-bg2.png";
import secTitle01 from "@/assets/images/home/sec-title01.svg";
import secTitle02 from "@/assets/images/home/sec-title02.svg";
import secTitle03 from "@/assets/images/home/sec-title03.svg";
import secTitle04 from "@/assets/images/home/sec-title04.svg";
import secTitle05 from "@/assets/images/home/sec-title05.svg";
import itemClipCopy from "@/assets/images/home/item-clip-copy.svg";
import clip from "@/assets/images/home/clip.svg";
import clipName from "@/assets/images/home/clip-name.svg";
import goodCopy from "@/assets/images/home/good-copy.svg";
import good from "@/assets/images/home/good.svg";
import goodName from "@/assets/images/home/good-name.svg";
import talkCopy from "@/assets/images/home/talk-copy.svg";
import talk from "@/assets/images/home/talk.svg";
import talkName from "@/assets/images/home/talk-name.svg";
import arrow from "@/assets/images/home/arrow.svg";
import secImg01 from "@/assets/images/home/sec-img01.png";
import secImg02 from "@/assets/images/home/sec-img02.png";
import secImg03 from "@/assets/images/home/sec-img03.png";
import icoMail from "@/assets/images/home/ico-mail.svg";
import bgPc from "@/assets/images/common/bg-pc.png";
import siteLogo from "@/assets/images/common/sitelogo.svg";
import icoUser from "@/assets/images/common/ico-user.svg";

/** テンプレートで参照しやすいようまとめる */
const img = {
  heroHouse,
  siteid,
  heroCopy,
  heroObj,
  heroBg,
  secTitle01,
  secTitle02,
  secTitle03,
  secTitle04,
  secTitle05,
  itemClipCopy,
  clip,
  clipName,
  goodCopy,
  good,
  goodName,
  talkCopy,
  talk,
  talkName,
  arrow,
  secImg01,
  secImg02,
  secImg03,
  icoMail,
  bgPc,
  siteLogo,
  icoUser,
};

// ---------- 特集（Topics）用 ---------- //
const topics = ref([]);

/* 画像URLユーティリティ（OfficeTopicsListView と同じ仕様） */
const strip = (s = "") => String(s).replace(/^\/+|\/+$/g, "");
const originOf = (s) => {
  try {
    return s ? new URL(s).origin : "";
  } catch {
    return "";
  }
};

// ORIGIN（/api を剥がして末尾スラッシュ除去）
const APP_ORIGIN =
  originOf(import.meta.env.VITE_PUBLIC_BASE_URL) ||
  originOf(import.meta.env.VITE_API_BASE_URL) ||
  window.location.origin;
const TOPIC_ORIGIN = String(APP_ORIGIN)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");
// no-image
const TOPIC_FALLBACK = `${import.meta.env.BASE_URL}stock-images/no-image.png`;

// 画像あり判定
const hasTopicImage = (it) => !!String(it?.image_path || "").trim();

// 画像URL正規化
const topicImageUrl = (p) => {
  if (!p) return TOPIC_FALLBACK;
  const raw = String(p).trim();
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (/^\/uploads\//i.test(raw)) return `${TOPIC_ORIGIN}${raw}`;
  if (/^\/upload\//i.test(raw)) return `${TOPIC_ORIGIN}${raw.replace(/^\/upload\//i, "/uploads/")}`;
  return `${TOPIC_ORIGIN}/${strip(raw)}`;
};

// 画像エラー時フォールバック
const onTopicImgError = (e) => {
  if (e?.target) e.target.src = TOPIC_FALLBACK;
};

// 日付整形
const formatTopicDate = (dt) => (dt ? new Date(dt).toLocaleDateString("ja-JP") : "");

// ランダムに最大2件を抽出
const pickRandomTopics = (list) => {
  const src = Array.isArray(list) ? [...list] : [];
  for (let i = src.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [src[i], src[j]] = [src[j], src[i]];
  }
  return src.slice(0, 2);
};

// APIから特集取得
const fetchTopics = async () => {
  try {
    // OfficeTopicsListView と同じエンドポイントを利用
    const { data } = await http.get("/announcements/office", {
      params: { page: 1, per_page: 12 }, // 必要に応じて件数は調整可
    });
    const items = Array.isArray(data?.items) ? data.items : [];
    topics.value = pickRandomTopics(items);
  } catch (e) {
    console.error("特集の取得に失敗しました", e);
    topics.value = [];
  }
};

function setTopMeta() {
  // タイトル
  document.title = "福島県の介護就職情報サイト「ふくしまち」｜介護求人・転職支援";

  // description
  const content =
    "福島県の介護就職情報サイト「ふくしまち」は、福島県内の介護施設・事業所と介護の仕事を探している方をつなぐ就職情報サイトです。介護職・看護職・ケアマネジャーなどの求人をスマホから簡単に検索できます。";

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

/* ----------------- 認証状態の参照（重複定義回避のため関数名は normStr） ----------------- */
function normStr(v) {
  return (v ?? "")
    .replace(/^['"]|['"]$/g, "")
    .trim()
    .toLowerCase();
}
function readUserId() {
  try {
    const cands = [
      localStorage.getItem("auth_user"),
      sessionStorage.getItem("auth_user"),
      localStorage.getItem("userId"),
      sessionStorage.getItem("userId"),
    ];
    for (const v of cands) {
      if (!v) continue;
      if (/^\s*\d+\s*$/.test(v)) return Number(v);
      try {
        const o = JSON.parse(v);
        const n = Number(o?.id ?? o?.userId ?? o?.user?.id);
        if (Number.isFinite(n) && n > 0) return n;
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
  return 0;
}
function currentRole() {
  const uid = readUserId();
  if (!uid) return "";
  const t = normStr(localStorage.getItem("userType"));
  if (["seeker", "user", "1", "求職者"].includes(t)) return "seeker";
  if (["employer", "business", "facility", "2", "事業者"].includes(t)) return "employer";
  return "";
}

/* ----------------- FooterNav 再マウント用キー ----------------- */
const footerKey = ref("0:");
function refreshFooterKeyAndBodyClass() {
  const uid = readUserId();
  const ut = normStr(localStorage.getItem("userType") || "");
  footerKey.value = `${uid}:${ut}`;

  // body の状態クラス（必要ならデザイン側で利用）
  document.body.classList.remove("is-user", "is-employer", "is-login");
  const role = currentRole();
  if (role === "seeker") {
    document.body.classList.add("is-user", "is-login");
  } else if (role === "employer") {
    document.body.classList.add("is-employer", "is-login");
  }
}

/* ----------------- ストレージ変化で反映 ----------------- */
const onStorage = (e) => {
  const k = String(e && e.key);
  if (k === "userType" || k === "userId" || k === "auth_user") refreshFooterKeyAndBodyClass();
};
const onFocus = () => refreshFooterKeyAndBodyClass();

onMounted(() => {
  setTopMeta();
  refreshFooterKeyAndBodyClass();
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onFocus);
  // 特集を取得してランダム2件に絞る
  fetchTopics();
});
onBeforeUnmount(() => {
  document.body.classList.remove("is-user", "is-employer", "is-login");
  window.removeEventListener("storage", onStorage);
  window.removeEventListener("focus", onFocus);
});
</script>

<style scoped>
.home-main-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 16px 16px 8px;
  color: rgb(73, 73, 73);
}

/* ゆっくり点滅（フェード） */
.blink-slow {
  animation: heroBlink 2.8s ease-in-out infinite;
  will-change: opacity;
}
@keyframes heroBlink {
  0% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.45;
  }
}
@media (prefers-reduced-motion: reduce) {
  .blink-slow {
    animation: none;
    opacity: 1;
  }
}

br.sp-only {
  display: none; /* PCでは改行しない */
}

@media screen and (max-width: 767px) {
  br.sp-only {
    display: inline; /* スマホ幅のときだけ改行させる */
  }
}

/* 特集カード用 */

/* .topics-empty {
  margin-top: 12px;
  text-align:center;
  color:#6b7280;
  font-size: 14px;
} */

/* スマホでは 1 列でOK */
@media (max-width: 768px) {
  .topics-cards {
    max-width: 100%;
  }
}
/* ==== 特集リスト（トップページ） ==== */

.topics-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 1カード全体 */
.topics-row {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
}

/* 全体をリンクに */
.topics-row-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

/* 上部ヘッダー（左：施設名、右：発信元など） */
.topics-row-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 20px 0;
  background: #fff;
}

/* 左上の施設名ラベル（右側を斜めに） */
.topics-row-facility {
  position: relative;
  display: inline-block;
  margin: -12px -22px;
  padding: 10px 36px 16px 20px;
  background: #b58b4a; /* 1件目の色（茶色） */
  color: #fff;
  border-radius: 18px 0 0 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

/* 右側の斜め部分 */
.topics-row-facility::after {
  content: "";
  position: absolute;
  top: 0;
  right: -32px;
  width: 0;
  height: 0;
  border-top: 0 solid transparent;
  border-bottom: 40px solid transparent;
  border-left: 32px solid #b58b4a; /* ← ラベルと同じ色 */
}

/* ★ 2個目用の色（例：紫系） */
.topics-row-facility--second {
  background: #7f8bcf; /* 好きな色に変更OK */
}

/* ★ 2個目用の斜め部分の色も揃える */
.topics-row-facility--second::after {
  border-left-color: #7f8bcf;
}

/* 右上のテキスト（ふくしまちケアセンター など） */
/* .topics-row-owner {
  font-size: 14px;
  color: #374151;
  margin-top: 8px;
} */

/* 本文エリア：画像＋テキストを横並び */
.topics-row-body {
  display: flex;
  gap: 24px;
  padding: 0px 20px 20px;
  align-items: flex-start;
}

/* 画像部分 */
.topics-row-thumb {
  flex: 0 0 260px; /* 画像幅 */
  height: 180px;
  overflow: hidden;
  border-radius: 10px;
}
.topics-row-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.topics-thumb__ph {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
}

/* テキスト部分 */
.topics-row-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.topics-row-title {
  font-size: 18px;
  line-height: 1.6;
  color: #111827;
  margin: 4px 0 12px;
}
.topics-row-date {
  font-size: 14px;
  color: #6b7280;
}

.topics-empty {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

/* スマホ：画像の下にテキストを縦並びに */
@media (max-width: 768px) {
  .topics-row-body {
    flex-direction: column;
  }
  .topics-row-thumb {
    width: 100%;
    flex-basis: auto;
  }
}
</style>
