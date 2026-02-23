<!-- src/views/biz/TopBusiness.vue -->
<!-- 事業者用TOPページ -->
<template>
  <body class="home is-employer is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <!-- スマホTOP -->
      <div class="hero">
        <div class="hero-siteid">
          <img src="/src/assets/images/home/siteid.svg" />
        </div>
        <div class="hero-copy">
          <img src="/src/assets/images/home/hero-copy3.svg" />
        </div>
        <!-- <div class="hero-house blink">
                    <a href="/jobs/">
                        <img src="/src/assets/images/home/hero-house.png">
                    </a>
                </div> -->
        <div class="hero-house blink">
          <router-link :to="{ name: 'Jobs' }">
            <img src="/src/assets/images/home/hero-house.png" />
          </router-link>
        </div>
        <div class="hero-obj">
          <img src="/src/assets/images/home/hero-obj.png" />
        </div>
        <div class="hero-bg">
          <img src="/src/assets/images/home/hero-bg2.png" />
        </div>
      </div>

      <div class="content">
        <main>
          <!-- お知らせNews -->
          <section class="l-sec home-news">
            <div class="inner">
              <div class="home-sectitle">
                <img src="/src/assets/images/home/sec-title02.svg" />
              </div>
              <!-- <div class="news-tabs" role="tablist" aria-label="お知らせカテゴリ">
                                <button type="button" class="news-tab is-active" role="tab" aria-selected="true" data-filter="all" tabindex="0">すべて</button>
                                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="jobs" tabindex="-1">求人情報</button>
                                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="event" tabindex="-1">イベント</button>
                                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="office" tabindex="-1">事務局から</button>
                                <button type="button" class="news-tab" role="tab" aria-selected="false" data-filter="facility" tabindex="-1">施設から</button>
                            </div> -->
              <!-- ニュース（最大5件、タブ付き） -->
              <NewsListInline :limit="5" :use-tabs="true" />
              <ul>
                <!-- ここにお知らせ情報を掲載 -->
              </ul>

              <!-- お知らせ一覧遷移ボタン -->
              <div class="btn-more-txt">
                <RouterLink :to="{ name: 'NewsPublic' }">
                  <span class="ico"><img src="/src/assets/images/home/arrow.svg" /></span>
                  <span class="txt">お知らせ一覧</span>
                </RouterLink>
              </div>
            </div>
            <div class="sec-bg">
              <img src="/src/assets/images/home/sec-img02.png" />
            </div>
          </section>

          <!-- 求人情報JOBS -->
          <section class="l-sec home-job">
            <div class="inner">
              <div class="home-sectitle">
                <img src="/src/assets/images/home/sec-title03.svg" />
              </div>
              <!-- 求人情報画面遷移ボタン -->
              <div class="btn-more">
                <RouterLink :to="{ name: 'Jobs' }">
                  <span class="ico"><img src="/src/assets/images/home/arrow.svg" /></span>
                  <span class="txt">求人情報一覧</span>
                </RouterLink>
              </div>
            </div>
            <div class="sec-bg">
              <img src="/src/assets/images/home/sec-img03.png" />
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

              <!-- 特集サイト画面遷移ボタン -->
              <div class="btn-more-txt">
                <RouterLink :to="{ name: 'OfficeTopics' }">
                  <span class="ico"><img src="/src/assets/images/home/arrow.svg" /></span>
                  <span class="txt">特集</span>
                </RouterLink>
              </div>
            </div>
          </section>

          <!-- What'sどんなサイト？ -->
          <section class="l-sec home-about">
            <div class="inner">
              <div class="home-sectitle">
                <img src="/src/assets/images/home/sec-title01.svg" />
              </div>
              <div class="home-about-lead">
                <p>
                  介護の仕事を探している人と介護施設を結ぶ<br />
                  就活情報サイトです。<br />
                  求人情報の登録だけでなく、<br />
                  施設のお知らせを発信することや<br />
                  求職者とのメッセージのやり取りができます。<br />
                  ぜひ活用ください。
                </p>
              </div>

              <div class="home-about-item">
                <div class="home-about-item-copy">
                  <img src="/src/assets/images/home/employer-item-copy01.svg" />
                </div>
                <div class="home-about-item-detail">
                  <p>
                    マイページから求人の登録や更新、求人終了や停止など、情報の編集作業を行うことができます。
                  </p>
                </div>
              </div>

              <div class="home-about-item">
                <div class="home-about-item-copy">
                  <img src="/src/assets/images/home/employer-item-copy02.svg" />
                </div>
                <div class="home-about-item-detail">
                  <p>
                    サイト内のお知らせコーナーであなたの施設のイベントなどさまざまな情報を配信することができます。
                  </p>
                </div>
              </div>
              <!-- トーク -->
              <div class="home-about-item">
                <div class="home-about-item-copy">
                  <img src="/src/assets/images/home/employer-item-copy03.svg" />
                </div>
                <div class="home-about-item-detail flex">
                  <div class="home-about-item-ico">
                    <img src="/src/assets/images/home/talk-employer.svg" />
                  </div>
                  <div class="home-about-item-txt">
                    <div class="home-about-item-name">
                      <img src="/src/assets/images/home/talk-name-employer.svg" />
                    </div>
                    <p>
                      あなたの施設に興味を持った求職者からグッドが届いたら、<br />
                      トーク画面で求職者の方と直接メッセージのやりとりができます。
                    </p>
                  </div>
                </div>
              </div>
              <!-- 使い方画面遷移ボタン -->
              <div class="btn-more maru">
                <router-link to="/biz/howtouse">もっと詳しく使い方をみる</router-link>
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
              <img src="/src/assets/images/home/sec-img01.png" />
            </div>
          </section>

          <!-- お問い合わせCONTACT -->
          <section class="l-sec home-contact">
            <div class="inner">
              <div class="home-sectitle">
                <img src="/src/assets/images/home/sec-title05.svg" />
              </div>
              <!-- お問い合わせフォーム画面遷移ボタン -->
              <div class="btn-more contact">
                <RouterLink :to="{ name: 'BusinessContact' }">
                  <span class="ico"><img src="/src/assets/images/home/ico-mail.svg" /></span>
                  <span class="txt">サイトに関するお問い合わせ</span>
                </RouterLink>
              </div>
              <!-- よくあるお問い合わせ画面遷移ボタン -->
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

      <PopupAnimModal
        v-model:open="popupOpen"
        popupKey="topbusiness-welcome"
        :files="popupFiles"
        @close="onPopupClose"
      />

      <AppFooter />
    </div>
  </body>
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
import PopupAnimModal from "@/components/PopupAnimModal.vue";

const popupOpen = ref(false);
const ENABLE_POPUP_ANIM = false; // ← trueに戻せば即復活

const base = import.meta.env.BASE_URL; // 例: '/' または '/staging/'
const popupFiles = {
  ios: `${base}animations/popup_ios.json`,
  android: `${base}animations/popup_android.json`,
  other: `${base}animations/popup_default.json`,
};

function isSuppressed(popupKey) {
  return localStorage.getItem(`popup:dontshow:${popupKey}`) === "1";
}

function openPopupIfNeeded() {
  if (!ENABLE_POPUP_ANIM) return; // ★一時停止
  const key = "topbusiness-welcome";
  console.log("[popup] openPopupIfNeeded", { key, suppressed: isSuppressed(key) });
  if (isSuppressed(key)) return;
  popupOpen.value = true;
  console.log("[popup] popupOpen => true");
}

function onPopupClose(payload) {
  console.log("popup closed:", payload);
}

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
    console.log("topics:", topics.value);
  } catch (e) {
    console.error("特集の取得に失敗しました", e);
    topics.value = [];
  }
};

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
  refreshFooterKeyAndBodyClass();
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onFocus);
  // 特集を取得してランダム2件に絞る
  fetchTopics();
  openPopupIfNeeded(); // ★追加
});
onBeforeUnmount(() => {
  document.body.classList.remove("is-user", "is-employer", "is-login");
  window.removeEventListener("storage", onStorage);
  window.removeEventListener("focus", onFocus);
});
</script>

<style scoped>
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
