<!-- src/views/news/NewsListPublicView.vue -->
<!-- 誰でも閲覧できるお知らせ一覧 -->
<template>
  <body class="news">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <div class="content">
        <main>
          <section class="l-sec news-detail">
            <div class="page-title maru">お知らせ</div>
            <div class="inner">
              <!-- タブ（テキスト下の罫線だけのシンプルデザイン） -->
              <div class="news-tabs" role="tablist" aria-label="お知らせカテゴリ">
                <button
                  v-for="t in TABS"
                  :key="t.slug"
                  class="news-tab"
                  :class="{ 'is-active': active === t.slug }"
                  role="tab"
                  :aria-selected="active === t.slug ? 'true' : 'false'"
                  :tabindex="active === t.slug ? 0 : -1"
                  @click="select(t.slug)"
                >
                  {{ t.label }}
                </button>
              </div>

              <!-- リスト -->
              <section class="news-list">
                <AnnouncementItem
                  class="news-item"
                  v-for="it in pagedItems"
                  :key="`${it.type}:${it.id}`"
                  :title="it.title"
                  :date="it.date"
                  :categories="it.cats"
                  :facility-name="it.facilityName"
                  :to="it.to"
                />

                <div v-if="!loading && !items.length" class="empty">
                  該当するお知らせはありません。
                </div>
                <div v-if="loading" class="loading">読み込み中…</div>
              </section>

              <!-- ページネーション（1ページ10件） -->
              <nav
                v-if="!loading && pageCount > 1"
                class="pagination"
                role="navigation"
                aria-label="ページナビゲーション"
              >
                <!-- 前へ -->
                <a
                  href="#"
                  class="prev"
                  :class="{ 'is-disabled': page <= 1 }"
                  @click.prevent="page > 1 && setPage(page - 1)"
                  aria-label="前へ"
                  :aria-disabled="page <= 1"
                ></a>

                <!-- ページ番号 -->
                <a
                  v-for="n in pageCount"
                  :key="n"
                  href="#"
                  class="page-number"
                  :class="{ select: n === page }"
                  @click.prevent="setPage(n)"
                  :aria-current="n === page ? 'page' : null"
                  >{{ n }}</a
                >

                <!-- 次へ -->
                <a
                  href="#"
                  class="next"
                  :class="{ 'is-disabled': page >= pageCount }"
                  @click.prevent="page < pageCount && setPage(page + 1)"
                  aria-label="次へ"
                  :aria-disabled="page >= pageCount"
                ></a>
              </nav>
            </div>
          </section>
        </main>
      </div>
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
  </body>
  <PcModel />
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { http } from "@/api/http";
import AnnouncementItem from "@/components/news/AnnouncementItem.vue";

import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
import FooterNav from "@/components/layout/FooterNav.vue";
import PcModel from "@/components/layout/PcModel.vue";
/** タブ定義 */
const TABS = [
  { slug: "all", label: "すべて" },
  { slug: "jobs", label: "求人情報" },
  { slug: "facility", label: "施設から" },
  { slug: "event", label: "　特集　" },
  { slug: "office", label: "事務局から" },
];

/** 表示件数（固定で10件） */
const VIEW_PER_PAGE = 10;

/** ルーティング（#event などで直接タブ指定できるように） */
const route = useRoute();
const router = useRouter();
const active = ref(resolveSlugFromHash(route.hash));
watch(
  () => route.hash,
  (h) => {
    active.value = resolveSlugFromHash(h);
  },
);

/** 表示データ＆ページング状態 */
const items = ref([]); // 正規化済みの全アイテム
const loading = ref(false);
const page = ref(1);

const pageCount = computed(() => Math.max(1, Math.ceil(items.value.length / VIEW_PER_PAGE)));
const pagedItems = computed(() => {
  const start = (page.value - 1) * VIEW_PER_PAGE;
  const end = start + VIEW_PER_PAGE;
  return items.value.slice(start, end);
});

/** 初期ロード */
onMounted(load);

/** タブ切替 */
function select(slug) {
  if (!TABS.some((t) => t.slug === slug)) return;
  if (slug === resolveSlugFromHash(route.hash)) return;
  router.replace({ hash: slug === "all" ? "" : `#${slug}` });
  // hash 変更 -> watch が active を更新 -> watch(active, load) が走る
}

/** ページ変更 */
function setPage(n) {
  const clamped = Math.min(Math.max(1, n), pageCount.value);
  if (clamped !== page.value) {
    page.value = clamped;
    // 上に戻す
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/** タブ変更時にロード＆1ページ目へ */
watch(active, async () => {
  page.value = 1;
  await load();
});

/** 読み込み（タブごとにデータ源を切替） */
async function load() {
  loading.value = true;
  items.value = [];
  try {
    const slug = active.value;

    if (slug === "jobs") {
      // 求人情報だけ
      const jobs = await fetchJobs();
      items.value = jobs;
    } else if (["event", "office", "facility"].includes(slug)) {
      // お知らせの特定カテゴリだけ
      const anns = await fetchAnnouncements(slug);
      items.value = anns;
    } else {
      // すべて＝求人 + お知らせ全カテゴリ
      const [jobs, anns] = await Promise.all([fetchJobs(), fetchAnnouncements("all")]);
      items.value = [...jobs, ...anns].sort(sortByDateDesc);
    }
  } catch (e) {
    console.error("[news:list] failed", e);
  } finally {
    loading.value = false;
  }
}

/** 求人情報（jobs）を取得してカード形式に正規化 */
async function fetchJobs() {
  // NOTE: 公開日カラムは jobs テーブルだと `published_date`
  const { data } = await http.get("/jobs", {
    params: { page: 1, per_page: 200, status: "open" }, // ← 多めに取得
  });
  const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return rows.map((j) => ({
    id: j.id,
    type: "job",
    title: j.title || j.job_title || j.name || "求人情報",
    date: pickDate(j, [
      "published_date",
      "publishedDate", // 最優先（テーブル定義に準拠）
      "published_at",
      "publishedAt",
      "posted_on",
      "postedOn",
      "posted_at",
      "postedAt",
      "open_date",
      "openDate",
      "opened_at",
      "openedAt",
      "publication_date",
      "publicationDate",
      "created_at",
      "createdAt",
      "updated_at",
      "updatedAt",
    ]),
    cats: "求人情報",
    facilityName: (j.facility_name || j.facilityName || "").trim(),
    to: { name: "JobDetail", params: { id: j.id } },
  }));
}

/** お知らせ（announcements）を取得し、カテゴリに応じて絞り込んで正規化 */
async function fetchAnnouncements(slug) {
  // サーバが /announcements?page&per_page を持っていても、ここではクライアントでページングするため多めに取る
  const { data } = await http.get("/announcements", { params: { page: 1, per_page: 200 } });
  const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  // クライアント側でカテゴリ名/スラッグを判定
  const want = slug;
  const filtered = rows.filter((a) => {
    if (want === "all") return true;
    const name = (a.category_name || a.category?.name || "").trim();
    const s = (a.category_slug || a.category?.slug || "").trim().toLowerCase();
    if (want === "event") return name === "特集" || s === "event";
    if (want === "office") return name === "事務局から" || s === "office";
    if (want === "facility") return name === "施設から" || s === "facility";
    return true;
  });

  return filtered
    .map((a) => ({
      id: a.id,
      type: "ann",
      title: a.title || "お知らせ",
      date: pickDate(a, [
        "published_at",
        "publishedAt",
        "created_at",
        "createdAt",
        "updated_at",
        "updatedAt",
      ]),
      cats: a.category_name || a.category?.name || "お知らせ",
      to: { name: "AnnouncementDetail", params: { id: a.id } },
    }))
    .sort(sortByDateDesc);
}

/** 共通：日付で降順 */
function sortByDateDesc(a, b) {
  const ta = Date.parse(a.date || "") || 0;
  const tb = Date.parse(b.date || "") || 0;
  return tb - ta;
}

/** 任意キー配列の先頭で見つかった日付を返す（文字列のまま返す） */
function pickDate(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
}

/** hash → slug の正規化 */
function resolveSlugFromHash(h) {
  const s = String(h || "").replace(/^#/, "");
  return TABS.some((t) => t.slug === s) ? s : "all";
}
</script>

<style scoped>
.news-public {
  padding: 18px 0 36px;
}
.inner {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 16px;
}
.page-title {
  font-size: 24px;
  font-weight: 800;
  margin: 0 14px;
}

/* タブ（テキスト下に罫線） */
.tabs {
  display: flex;
  gap: 18px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.tab {
  appearance: none;
  background: none;
  border: none;
  padding: 10px 6px 8px;
  cursor: pointer;
  color: #374151;
  font-weight: 700;
  border-bottom: 3px solid transparent;
}
.tab.is-active {
  border-bottom-color: #2563eb;
  color: #111827;
}
.tab:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}

/* リスト */
.list {
  display: grid;
  gap: 12px;
}
.empty,
.loading {
  text-align: center;
  color: #6b7280;
  padding: 12px 0;
}

/* ページネーション */
.pagination {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
}
.pager,
.pagebtn {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 700;
}
.pager:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagebtn.is-active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.news-tab {
  padding: 8px 4px 6px; /* ← 左右パディングを 4px にして両サイドを詰める */
}

/* スマホ時：ヘッダー実寸で .content を下げる（マージン相殺を避ける） */
@media (max-width: 768px) {
  :root {
    --header-height: 72px;
  } /* JS で実測値に上書きされます */
  .content {
    padding-top: var(--header-height);
  }
  /* 先頭セクションの上マージンを明示的に潰す（安全策） */
  .content > main > .l-sec:first-child {
    margin-top: 50px;
  }
}

.btn-back {
  margin-bottom: 50px;
}
</style>
