<!-- src/components/news/NewsListInline.vue -->
<!-- お知らせ（news）一覧 -->
<template>
  <div class="news-inline">
    <!-- タブ（任意） -->
    <div v-if="useTabs" class="tabs" role="tablist" aria-label="お知らせカテゴリ">
      <button
        v-for="t in TABS"
        :key="t.slug"
        class="tab"
        :class="{ 'is-active': active === t.slug }"
        role="tab"
        :aria-selected="active === t.slug ? 'true' : 'false'"
        :tabindex="active === t.slug ? 0 : -1"
        @click="select(t.slug)"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- 一覧（最大 limit 件） -->
    <section class="list">
      <AnnouncementItem
        v-for="it in limitedItems"
        :key="`${it.type}:${it.id}`"
        :title="it.title"
        :date="it.date"
        :categories="it.cats"
        :facility-name="it.facilityName"
        :to="it.to"
      />
      <div v-if="!loading && !limitedItems.length" class="empty">お知らせはありません。</div>
      <div v-if="loading" class="loading">読み込み中…</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { http } from "@/api/http";
import AnnouncementItem from "@/components/news/AnnouncementItem.vue";
import { useRouter } from "vue-router";

const router = useRouter();

// このプロジェクトは localStorage の userId で認証判定（メモリの前提）
const isAuthed = computed(() => !!localStorage.getItem("userId"));

function jobTo(id) {
  // ログイン後に戻したい場合（任意）
  // JobDetail の実URLを作って redirect に入れておく
  const redirect = router.resolve({ name: "JobDetail", params: { id } }).fullPath;

  return isAuthed.value
    ? { name: "JobDetail", params: { id } }
    : { name: "RegisterChoice", query: { redirect } }; // Login側で query.redirect を見て戻す
}

/** props: 表示件数とタブの有無を切替 */
const props = defineProps({
  limit: { type: Number, default: 5 },
  useTabs: { type: Boolean, default: true },
});

/** タブ定義（一覧ページと揃える） */
const TABS = [
  { slug: "all", label: "すべて" },
  { slug: "jobs", label: "求人情報" },
  { slug: "facility", label: "施設から" },
  { slug: "event", label: "　特集　" },
  { slug: "office", label: "事務局から" },
  // { slug: 'event',   label: '事務局から' },
];

const active = ref("all");
const items = ref([]); // 正規化済みの全アイテム（タブ適用済み）
const loading = ref(false);

onMounted(load);
watch(active, load);

/** タブ切替 */
function select(slug) {
  if (!TABS.some((t) => t.slug === slug)) return;
  if (slug !== active.value) active.value = slug;
}

/** 表示は常に最大 props.limit 件 */
const limitedItems = computed(() => items.value.slice(0, Math.max(0, props.limit)));

/** 読み込み（一覧ページと同等のロジック・ただしページング無し） */
async function load() {
  loading.value = true;
  items.value = [];
  try {
    const slug = props.useTabs ? active.value : "all";

    if (slug === "jobs") {
      items.value = await fetchJobs();
    } else if (["event", "office", "facility"].includes(slug)) {
      items.value = await fetchAnnouncements(slug);
    } else {
      const [jobs, anns] = await Promise.all([fetchJobs(), fetchAnnouncements("all")]);
      items.value = [...jobs, ...anns].sort(sortByDateDesc);
    }
  } catch (e) {
    console.error("[news:inline] load failed", e);
  } finally {
    loading.value = false;
  }
}

/** ===== API 呼び出し（一覧ページと同じ正規化） ===== */
async function fetchJobs() {
  const { data } = await http.get("/jobs", {
    params: { page: 1, per_page: 200, status: "open" },
  });
  const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return rows.map((j) => ({
    id: j.id,
    type: "job",
    title: j.title || j.job_title || j.name || "求人情報",
    date: pickDate(j, [
      "published_date",
      "publishedDate",
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
    // to: { name: "JobDetail", params: { id: j.id } },
    to: jobTo(j.id),
  }));
}

async function fetchAnnouncements(slug) {
  const { data } = await http.get("/announcements", { params: { page: 1, per_page: 200 } });
  const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  const filtered = rows.filter((a) => {
    if (slug === "all") return true;
    const name = (a.category_name || a.category?.name || "").trim();
    const s = (a.category_slug || a.category?.slug || "").trim().toLowerCase();
    if (slug === "event") return name === "特集" || s === "event";
    if (slug === "office") return name === "事務局から" || s === "office";
    if (slug === "facility") return name === "施設から" || s === "facility";
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

/** ユーティリティ（一覧ページから移植） */
function sortByDateDesc(a, b) {
  const ta = Date.parse(a.date || "") || 0;
  const tb = Date.parse(b.date || "") || 0;
  return tb - ta;
}
function pickDate(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  margin: 8px 0 12px;
  flex-wrap: wrap;
}
.tab {
  appearance: none;
  background: none;
  border: none;
  padding: 8px 6px 6px;
  cursor: pointer;
  color: #374151;
  font-weight: 700;
  border-bottom: 3px solid transparent;
  white-space: nowrap; /* ← ボタン内の改行を禁止（“施設から”が折れない） */
  line-height: 1.2;
  font-size: clamp(12px, 3.5vw, 14px); /* 端末幅に応じて自動縮小（上限14px/下限12px） */
}
.tab.is-active {
  border-bottom-color: #fa9f31;
  color: #6b7280;
}
.tab:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}
.list {
  display: grid;
  gap: 10px;
}
.empty,
.loading {
  text-align: center;
  color: #6b7280;
  padding: 8px 0;
}

/* モバイルでさらに詰める */
@media (max-width: 480px) {
  .tabs {
    gap: 10px;
  }
  .tab {
    padding: 6px 4px 5px;
    font-size: 13px;
  }
}
@media (max-width: 360px) {
  .tabs {
    gap: 8px;
  }
  .tab {
    padding: 6px 3px 5px;
    font-size: 12px;
  }
}
</style>
