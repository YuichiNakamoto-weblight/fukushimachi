<!-- src/views/office/OfficeAnnouncementPreviewView.vue -->
<!-- 事務局：お知らせ/特集 プレビュー（未公開） -->
<template>
  <body class="news is-employer is-login">
    <div class="wrap">
      <!-- 事務局画面にヘッダー類が不要なら、ここはコメントアウトしてOK -->
      <!-- <AppHeader />
      <HamburgerMenu />
      <FooterNav /> -->

      <main>
        <section class="l-sec news-detail" :class="{ 'is-feature': isFeature }">
          <!-- ✅ プレビュー中バナー -->
          <div class="preview-banner" role="status" aria-live="polite">
            <div class="preview-banner__inner">
              <span class="pill">プレビュー中</span>
              <span class="txt">（未公開 / 閲覧数は加算されません）</span>
              <div class="spacer"></div>
              <!-- <button type="button" class="btn btn-secondary maru preview-back" @click="goBack">
                編集へ戻る
              </button> -->
            </div>
          </div>

          <!-- ローディング -->
          <div v-if="loading" class="inner">
            <p class="preview-loading">読み込み中...</p>
          </div>

          <!-- エラー -->
          <div v-else-if="error" class="inner">
            <p class="preview-error">{{ error }}</p>
            <!-- <div class="btn-back">
              <a href="#" @click.prevent="goBack">
                <span class="ico"><img src="/src/assets/images/common/ico-back.svg" /></span>
                戻る
              </a>
            </div> -->
          </div>

          <!-- 本体 -->
          <template v-else>
            <!-- ※プレビューでは view_count は出さない（誤解防止） -->
            <div class="inner">
              <!-- タイトル -->
              <h1 class="news-title">{{ ann.title || "お知らせ" }}</h1>

              <!-- 事業所名（必要なら表示） -->
              <div class="news-facility" v-if="facilityText">{{ facilityText }}</div>

              <!-- 日付 / カテゴリー -->
              <div class="news-summary" v-if="dateText || categoryText">
                <span v-if="dateText">{{ dateText }}</span>
                <span v-if="dateText && categoryText" class="sep">/</span>
                <span v-if="categoryText">{{ categoryText }}</span>
              </div>

              <!-- 画像スライダー（最大4枚） -->
              <section v-if="images.length" class="news-body" role="region" aria-label="掲載画像">
                <div
                  class="slides"
                  role="button"
                  tabindex="0"
                  @click="openViewer(current)"
                  @keydown.enter.prevent="openViewer(current)"
                  @keydown.space.prevent="openViewer(current)"
                >
                  <figure
                    v-for="(img, idx) in images"
                    :key="img.url + ':' + idx"
                    class="slide"
                    :class="{ 'is-active': idx === current, 'is-portrait': img.isPortrait }"
                  >
                    <img :src="img.url" alt="" @load="onImgLoad($event, img)" />
                  </figure>
                </div>
              </section>

              <!-- 本文 -->
              <section v-if="ann.body" class="body">
                <!-- 事務局 or 特集は HTML を許可（サニタイズ済み） -->
                <div
                  v-if="ann.category_id === 3 || ann.category_id === 4"
                  class="text"
                  v-html="safeBodyHtml"
                ></div>
                <p v-else class="text">{{ ann.body }}</p>
              </section>

              <!-- 概要（見出し＋内容） -->
              <section v-if="summaries.length" class="summaries">
                <div class="sum" v-for="(s, i) in summaries" :key="i">
                  <h3 class="sum-head" v-if="s.heading">{{ s.heading }}</h3>
                  <p class="sum-body" v-if="s.content">{{ s.content }}</p>
                </div>
              </section>

              <!-- CTA（ボタンラベル/URL） -->
              <section v-if="ann.button_url" class="news-cta">
                <a
                  class="btn btn-primary maru news-cta__btn"
                  :href="ann.button_url"
                  target="_blank"
                  rel="noopener"
                >
                  {{ ann.button_label || "詳しくはこちら" }}
                </a>
              </section>

              <!-- 特集：同一施設の他の求人（表示はするが、プレビューではクリック無効） -->
              <section v-if="isFeature && relatedJobs.length > 0" class="l-sec">
                <div class="page-title maru">{{ relatedTitle }}</div>

                <article
                  v-for="it in relatedJobs"
                  :key="it.id"
                  class="card clickable related-job-card is-disabled"
                  aria-disabled="true"
                  title="プレビューでは遷移できません"
                >
                  <div class="job-list-item__data">
                    <div>
                      <span class="job-list-item__data--begins"
                        >募集開始：{{ formatDate(it.published_date) }}</span
                      >
                      <span class="job-list-item__data--view">
                        <span class="ico">
                          <img src="/src/assets/images/jobs/ico-view.svg" />
                        </span>
                        {{ it.view_count == null ? 0 : it.view_count }}
                      </span>
                    </div>
                  </div>

                  <div class="job-list-item__title">{{ it.title }}</div>

                  <div class="job-list-item__merit">
                    <ul v-if="Array.isArray(it.merits) && it.merits.length">
                      <li v-for="(m, i) in it.merits" :key="i">{{ m }}</li>
                    </ul>
                  </div>

                  <div class="job-list-item__summary flex">
                    <div class="job-list-item__tmb">
                      <img
                        :src="imageUrl(it.image_1 || it.image_2 || it.image_3 || it.image_4, it.id)"
                        @error="onImgError"
                        alt=""
                      />
                    </div>
                    <div class="job-list-item__txtwrap">
                      <div class="job-list-item__companyname">{{ it.facility_name }}</div>
                      <div class="job-list-item__jobtype">
                        <ul>
                          <li>
                            <span class="job-list-item__jobtype--full">{{
                              it.employment_type_name
                            }}</span>
                          </li>
                        </ul>
                      </div>

                      <div class="job-list-item__note flex">
                        <div class="job-list-item__location">
                          <span class="ico"
                            ><img src="/src/assets/images/jobs/ico-location.svg" alt="エリア"
                          /></span>
                          {{ it.city }}
                        </div>
                        <div class="job-list-item__salary">
                          <span class="ico"
                            ><img src="/src/assets/images/jobs/ico-fee.svg" alt="給与"
                          /></span>
                          {{
                            salaryLabel(it.base_salary_type, it.base_salary_min, it.base_salary_max)
                          }}
                        </div>
                      </div>
                    </div>

                    <div class="job-list-item__licence">
                      <span v-if="certImgSrc(it)"><img :src="certImgSrc(it)" alt="認証" /></span>
                    </div>
                  </div>
                </article>
              </section>

              <!-- 戻る -->
              <!-- <div class="btn-back">
                <a href="#" @click.prevent="goBack">
                  <span class="ico"><img src="/src/assets/images/common/ico-back.svg" /></span>
                  戻る
                </a>
              </div> -->
            </div>
          </template>
        </section>

        <!-- 画像拡大ビュー -->
        <div v-if="viewerOpen" class="image-viewer" @click.self="closeViewer">
          <button
            type="button"
            class="image-viewer__close"
            @click="closeViewer"
            aria-label="閉じる"
          >
            ×
          </button>
          <img
            v-if="images[viewerIndex]"
            :src="images[viewerIndex].url"
            alt=""
            class="image-viewer__img"
          />
        </div>
      </main>

      <AppFooter />
    </div>
  </body>
  <!-- <PcModel /> -->
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { http } from "@/api/http";
// import AppHeader from "@/components/layout/AppHeader.vue";
// import AppFooter from "@/components/layout/AppFooter.vue";
// import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
// import FooterNav from "@/components/layout/FooterNav.vue";
// import PcModel from "@/components/layout/PcModel.vue";
import DOMPurify from "dompurify";

// ===== ルータ =====
const route = useRoute();
// const router = useRouter();

// プレビューは常に true（クエリ判定にしたいならここを変更）
// const isPreview = computed(() => true)

// ===== API 定数 =====
const API_BASE = "/announcements";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();
const JOBS_API = "/jobs";

// ===== 状態 =====
const loading = ref(false);
const error = ref("");
const ann = ref({
  title: "",
  category_id: null,
  category_name: "",
  body: "",
  published_at: "",
  job_information_id: null,
  business_profile_id: null,
  view_count: 0,
  user_id: null,
  button_label: "",
  button_url: "",
});
const images = ref([]); // { url, isPortrait }
const summaries = ref([]); // { heading, content }
const current = ref(0);
let timer = null;

const viewerOpen = ref(false);
const viewerIndex = ref(0);

const facilityName = ref("");
const facilityText = computed(() => facilityName.value || "");

const newsId = computed(() => Number(route.params.id));
const isFeature = computed(() => Number(ann.value.category_id) === 4);

const dateText = computed(() => formatDate(ann.value.published_at));
const categoryText = computed(() => ann.value.category_name || ann.value.category?.name || "");

// const safeBodyHtml = computed(() => {
//   const raw = String(ann.value.body || "");
//   const sanitized = DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });

//   // http(s) リンクの <a> に target="_blank" rel="noopener" を付与
//   return sanitized.replace(
//     /<a([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi,
//     (match, before, href, after) => {
//       const attrs = before + after;
//       if (/target\s*=/.test(attrs)) {
//         if (!/rel\s*=/.test(attrs)) return match.replace(/>$/, ' rel="noopener">');
//         return match;
//       }
//       return `<a${before}href="${href}"${after} target="_blank" rel="noopener">`;
//     },
//   );
// });

const safeBodyHtml = computed(() => {
  const raw = String(ann.value.body || "");
  const sanitized = DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });

  // http(s) リンクの <a> に target="_blank" rel="noopener" を付与
  const withLinks = sanitized.replace(
    /<a([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi,
    (match, before, href, after) => {
      const attrs = before + after;
      if (/target\s*=/.test(attrs)) {
        if (!/rel\s*=/.test(attrs)) return match.replace(/>$/, ' rel="noopener">');
        return match;
      }
      return `<a${before}href="${href}"${after} target="_blank" rel="noopener">`;
    },
  );

  // ✅ figure の直前・直後にある「改行だけの空白」を消す（ここが効く）
  return withLinks.replace(/\s*(<figure\b[^>]*>)/gi, "$1").replace(/(<\/figure>)\s*/gi, "$1");
});

// ===== 関連求人（特集用） =====
const relatedJobs = ref([]);
const relatedTitle = computed(() =>
  facilityText.value ? `${facilityText.value} の求人情報` : "この施設の求人情報",
);

async function loadRelatedJobs() {
  const cat = Number(ann.value.category_id);
  const jid = Number(ann.value.job_information_id);

  if (cat !== 4 || !jid) {
    relatedJobs.value = [];
    return;
  }

  try {
    const res = await http.get(`${JOBS_API}/related`, { params: { job_id: jid, perPage: 6 } });
    relatedJobs.value = Array.isArray(res?.data?.items) ? res.data.items : [];
  } catch {
    relatedJobs.value = [];
  }
}

// 事業所名（必要なら）
// ※あなたの既存APIに合わせている
async function getBusinessNameFromProfileId(userId) {
  const id = Number(userId) || 0;
  if (id <= 0) return "";
  try {
    const { data } = await http.get(`/business/profile/${id}`);
    return data?.profile?.business_name || "";
  } catch {
    return "";
  }
}

// ===== データ取得 =====
async function loadDetail() {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await http.get(`${API_BASE}/${newsId.value}`);

    ann.value = {
      title: data.title || "",
      category_id: Number(data.category_id ?? data.category?.id ?? 0),
      category_name: data.category_name || data.category?.name || "",
      body: data.body || "",
      published_at: data.published_at || data.created_at || "",
      job_information_id: Number(data.job_information_id ?? 0),
      business_profile_id: Number(data.business_profile_id ?? 0),
      view_count: data.view_count ?? 0,
      user_id: data.user_id ?? null,
      button_label: data.button_label || "",
      button_url: data.button_url || "",
    };

    facilityName.value =
      data.business_name ||
      (await getBusinessNameFromProfileId(ann.value.business_profile_id)) ||
      "";

    images.value = (data.images || []).slice(0, 4).map((it) => {
      const p = it.image_path || it.url || "";
      return { url: resolveUrl(p), isPortrait: false };
    });

    summaries.value = (data.summaries || data.summary || []).map((s) => ({
      heading: s.heading || "",
      content: s.content || "",
    }));

    current.value = 0;
  } catch (e) {
    error.value = "プレビューの取得に失敗しました。IDや権限をご確認ください。";
    if (import.meta.env.DEV) console.error("[office-preview] failed", e);
  } finally {
    loading.value = false;
  }
}

async function reloadAll() {
  stopAuto();
  await loadDetail();
  await loadRelatedJobs();
  startAuto();

  // ✅ プレビューでは閲覧記録しない（重要）
  // if (!isPreview.value) await recordAnnouncementView(newsId.value)
}

function onImgError(e) {
  const t = e?.target;
  if (t) {
    t.onerror = null;
    t.src = "/stock-images/no-image.png"; // 既存のno-imageに合わせてOK
  }
}

// 認証バッジが未実装なら空文字でOK（表示しない）
function certImgSrc() {
  return "";
}

// ===== スライダー =====
function startAuto() {
  stopAuto();
  if (images.value.length <= 1) return;
  timer = setInterval(next, 8000);
}
function stopAuto() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
function next() {
  current.value = (current.value + 1) % images.value.length;
}

function openViewer(idx) {
  viewerIndex.value = idx ?? 0;
  viewerOpen.value = true;
  stopAuto();
}
function closeViewer() {
  viewerOpen.value = false;
  startAuto();
}
function onImgLoad(event, img) {
  const el = event.target;
  if (!el || !el.naturalWidth || !el.naturalHeight) return;
  img.isPortrait = el.naturalHeight > el.naturalWidth;
}

// ===== util =====
function resolveUrl(p) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const rel = p.startsWith("/") ? p : `/${p}`;
  return new URL(rel, API_ORIGIN).toString();
}
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${da}`;
}

// ===== 画像URL正規化（既存詳細に合わせて持ってくる） =====
const strip = (s = "") => String(s).replace(/^\/+|\/+$/g, "");
const origin = computed(() => {
  const b = String(
    import.meta.env.VITE_PUBLIC_BASE_URL || import.meta.env.VITE_API_BASE_URL || "",
  ).replace(/\/+$/, "");
  if (!b) return typeof window !== "undefined" ? window.location.origin : "";
  try {
    return new URL(b.replace(/\/api$/, ""), window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
});
const IMAGE_BASE = computed(() => `${origin.value}/uploads/images/jobs`);

function imageUrl(p, idForFallback) {
  if (!p) return "";
  const raw = String(p).trim();
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  const s = raw.startsWith("/") ? raw : `/${raw}`;

  if (/^\/uploads\/images\/jobs\//i.test(s)) return `${origin.value}${s}`;
  if (/^\/upload\/jobs\//i.test(s))
    return `${origin.value}${s.replace(/^\/upload\/jobs\//i, "/uploads/images/jobs/")}`;
  if (/^\/uploads\/jobs\//i.test(s))
    return `${origin.value}${s.replace(/^\/uploads\/jobs\//i, "/uploads/images/jobs/")}`;

  let rel = strip(raw);
  rel = rel
    .replace(/^uploads\/(?:images\/)?jobs\/+/i, "")
    .replace(/^images\/+/i, "")
    .replace(/^jobs\/+/i, "");

  const m = rel.match(/^(\d{1,10})\/(.+)$/);
  if (m) return `${IMAGE_BASE.value}/${m[1]}/${m[2]}`;

  const id = Number(idForFallback ?? 0);
  if (id > 0) return `${IMAGE_BASE.value}/${id}/${rel}`;
  return "";
}

// function onImgError (e) {
//   // 必要なら代替画像を設定
//   // e.target.src = '/src/assets/images/common/noimage.png'
// }

// // 認証バッジ画像（既存実装があるなら差し替え）
// function certImgSrc (job) {
//   // 例：job.certification_type 等に応じて返す設計ならここに実装
//   return ''
// }

// 給与ラベル
const formatMoney = (v) =>
  v == null || v === "" || Number.isNaN(Number(v)) ? "-" : Number(v).toLocaleString("ja-JP");
function salaryLabel(type, min, max) {
  const prefix = type === "hourly" ? "時給 " : type === "monthly" ? "月給 " : "";
  const minStr = formatMoney(min);
  const hasMax = max != null && max !== "" && !Number.isNaN(Number(max));
  const maxStr = hasMax ? `〜${formatMoney(max)}` : "";
  return `${prefix}${minStr}${maxStr}`;
}

onMounted(reloadAll);
onBeforeUnmount(() => stopAuto());

watch(
  () => route.params.id,
  async () => {
    await reloadAll();
  },
);
</script>

<style scoped>
.news-detail {
  padding: 18px 0 36px;
}
.inner {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ✅ プレビュー中バナー */
.preview-banner {
  position: sticky;
  top: 0;
  z-index: 1200;
  background: rgba(255, 244, 219, 0.96);
  border-bottom: 1px solid #f1d7a0;
  backdrop-filter: blur(6px);
}
.preview-banner__inner {
  max-width: 920px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.preview-banner .pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ff8f70;
  color: #fff;
  font-weight: 800;
  font-size: 12px;
}
.preview-banner .txt {
  font-size: 12px;
  color: #6b7280;
}
.preview-banner .spacer {
  flex: 1;
}
.preview-back {
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e5e7eb;
  font-weight: 700;
}
.news-summary {
  color: #6f7071;
  font-size: 20px;
  margin-bottom: 14px;
}
.news-summary .sep {
  margin: 0 6px;
  color: #9ca3af;
}

/* スライダー */
.slides {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 12px;
  overflow: hidden;
}
.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.6s ease;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.slide.is-active {
  opacity: 1;
}
.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  object-position: center center;
}
.slide.is-portrait img {
  object-position: top center;
}

/* 本文 */
.body {
  margin: 18px 0;
}
.text {
  white-space: pre-wrap;
  line-height: 1.9;
  color: #111827;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  font-size: 16px;
}

.body :deep(img) {
  border-radius: 12px;
  display: block;
  max-width: 100%;
  height: auto;
  margin: 16px 0;
}
.body :deep(a) {
  color: #0ea5e9;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.body :deep(a:hover) {
  filter: brightness(0.9);
}

/* 概要 */
.summaries {
  margin: 20px 0;
}
.sum {
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}
.sum-head {
  font-weight: 800;
  margin: 0 0 6px;
}
.sum-body {
  white-space: pre-wrap;
  line-height: 1.9;
}

/* CTA */
.news-cta {
  margin: 24px 0;
  text-align: center;
}
.news-cta__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
}

/* 戻る */
.btn-back {
  margin-top: 26px;
}
.btn-back a {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

/* 特集本文 微調整（必要なら） */
.news-detail.is-feature .body :deep(h2) {
  font-size: 20px;
  line-height: 1.4;
  font-weight: 700;
  color: #111827;
  margin: 0px -5px -5px;
}
.news-detail.is-feature .body :deep(h2 + p) {
  margin-top: 6px;
}
.news-detail.is-feature .body :deep(.text > h2:first-child) {
  margin-top: 6px;
}

/* 画像ビューワ */
.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
}
.image-viewer__img {
  max-width: 96vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}
.image-viewer__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}
.image-viewer__close:hover {
  background: rgba(0, 0, 0, 0.85);
}

/* 関連求人カード：プレビューではクリック不可の見た目に */
.card {
  position: relative;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px 12px 16px;
  margin: 16px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.clickable {
  cursor: default;
}
.is-disabled {
  opacity: 0.78;
  filter: grayscale(0.1);
}
.is-disabled::after {
  content: "プレビューでは遷移できません";
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  border-radius: 999px;
}

/* スマホ時：固定ヘッダーぶんの余白 */
@media (max-width: 768px) {
  .news-detail {
    padding-top: calc(18px + 72px);
  }
  .news-title {
    margin-top: 0;
  }
}

/* ローディング/エラー */
.preview-loading {
  padding: 24px 0;
  color: #6b7280;
}
.preview-error {
  padding: 24px 0;
  color: #b91c1c;
  font-weight: 700;
}

/* ✅ figure のデフォルト余白を消す（特集/事務局の本文内） */
.body :deep(figure) {
  margin: 0; /* ブラウザ既定の余白を消す */
}

/* ✅ ann-img はさらに明示（必要なら） */
.body :deep(figure.ann-img) {
  margin: 0 !important;
}

/* ✅ 既存の .body :deep(img){ margin:16px 0 } を ann-img の中だけ無効化 */
.body :deep(figure.ann-img img) {
  margin: 0 !important; /* ← これが効くと「画像の上下スペース」が消えます */
  border-radius: 12px;
  display: block;
  max-width: 100%;
  height: auto;
}

/* ✅ figcaption の余白を整える（好みで調整） */
.body :deep(figure.ann-img figcaption) {
  margin-top: 10px; /* キャプション上の余白 */
  font-size: 1rem;
  color: #111827;
  line-height: 1.5;
}

.news-detail.is-feature .body :deep(figure.ann-img) {
  margin: -20px 0 !important;
}
.news-detail.is-feature .body :deep(figure.ann-img img) {
  margin: 0 !important;
}
.news-detail.is-feature .body :deep(figure.ann-img figcaption) {
  margin-top: -50px;
}
</style>
