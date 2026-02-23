<!-- src/views/office/OfficeAnnouncementListView.vue -->
<!-- 事務局用お知らせ一覧ページ -->
<template>
  <body>
    <div class="wrap">
      <!-- <AppHeader /> -->
      <!-- <HamburgerMenu /> -->

      <main class="l-sec mypage-detail">
        <div class="page-title maru">お知らせ一覧</div>
        <!-- <button type="button" class="btn btn-ghost logout-btn" @click="logout">ログアウト</button> -->
        <!-- フィルタ -->
        <div class="toolbar">
          <div class="filters">
            <select v-model="categoryFilter" class="input">
              <option value="">すべてのカテゴリー</option>
              <option :value="3">事務局から</option>
              <option :value="4">特集</option>
            </select>

            <select v-model="statusFilter" class="input">
              <option value="all">すべて</option>
              <option value="open">公開</option>
              <option value="draft">ドラフト</option>
              <option value="paused">休止</option>
            </select>

            <!-- <input
              v-model.trim="keyword"
              class="input keyword"
              type="search"
              placeholder="タイトルで検索"
              @keydown.enter="reload"
            />

            <button class="btn btn-primary" :disabled="loading" @click="reload">
              検索
            </button>
            <button class="btn btn-ghost" :disabled="loading" @click="resetFilters">
              クリア
            </button> -->
          </div>

          <div class="actions">
            <RouterLink class="btn btn-accent" :to="{ name: 'OfficeAnnouncementCreate' }">
              新規作成
            </RouterLink>
          </div>
        </div>

        <!-- <div class="actions">
            <RouterLink class="btn btn-accent" :to="{ name: 'OfficeAnnouncementCreate' }">
              新規作成
            </RouterLink>
          </div> -->

        <!-- 一覧 -->
        <section class="list">
          <div v-if="loading" class="loading">読み込み中…</div>
          <div v-else-if="!items.length" class="empty">該当するお知らせはありません。</div>

          <ul v-else class="rows">
            <li v-for="it in items" :key="it.id" class="row">
              <!-- クリックで編集へ -->
              <RouterLink
                class="stretched-link"
                :to="{ name: 'OfficeAnnouncementEdit', params: { id: it.id } }"
              />

              <div class="thumb" v-if="it.image_path">
                <img :src="imageUrl(it.image_path)" alt="" @error="onImgError" />
              </div>

              <div class="meta">
                <span class="badge" :class="badgeClass(it.category_id)">
                  {{ it.category_name || catName(it.category_id) }}
                </span>

                <!-- ★ 追加：ドラフトバッジ -->
                <span v-if="it.is_draft" class="state -draft">ドラフト</span>
                <!-- ★ 追加：休止バッジ -->
                <span v-if="it.is_paused" class="state -paused">休止</span>

                <span class="date">{{ formatDate(it.published_at || it.created_at) }}</span>
              </div>

              <h2 class="title">{{ it.title }}</h2>

              <div class="ops">
                <RouterLink
                  class="btn btn-sm"
                  :to="{ name: 'OfficeAnnouncementEdit', params: { id: it.id } }"
                >
                  編集
                </RouterLink>
                <!-- ✅ 追加：プレビュー（新規ページへ） -->
                <RouterLink
                  class="btn btn-sm btn-ghost"
                  :to="{ name: 'OfficeAnnouncementPreview', params: { id: it.id } }"
                  target="_blank"
                  @click.stop
                >
                  プレビュー
                </RouterLink>
              </div>
            </li>
          </ul>
        </section>

        <!-- ページネーション -->
        <div class="pager" v-if="totalPages > 1">
          <button class="btn" :disabled="page <= 1 || loading" @click="go(page - 1)">前へ</button>
          <span class="page">{{ page }} / {{ totalPages }}</span>
          <button class="btn" :disabled="page >= totalPages || loading" @click="go(page + 1)">
            次へ
          </button>
        </div>
      </main>

      <!-- <AppFooter /> -->
    </div>

    <!-- <div class="body-bg pc">
      <img src="/src/assets/images/common/bg-pc.png" alt />
    </div> -->
  </body>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
// import { useRouter } from 'vue-router'
import { http } from "@/api/http";

// import AppHeader from '@/components/layout/AppHeader.vue'
// import AppFooter from '@/components/layout/AppFooter.vue'
// import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'

// 事務局の代表ユーザーID（必要なら .env の VITE_OFFICE_USER_ID で上書き）
const OFFICE_USER_ID = Number(import.meta.env.VITE_OFFICE_USER_ID || 100) || 100;

/* ===== 設定 ===== */
const API_BASE = "/announcements";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();

localStorage.setItem("userId", String(OFFICE_USER_ID));

/* ===== 状態 ===== */
const items = ref([]); // 一覧
const page = ref(1);
const perPage = ref(20);
const total = ref(0);
const loading = ref(false);

const categoryFilter = ref(""); // '', 3, 4
const keyword = ref("");

const statusFilter = ref("all"); // 'open' | 'draft' | 'all' | 'ended'

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)));
// const router = useRouter()

/* ===== 初期ロード ===== */
onMounted(async () => {
  await reload();
});

/* ===== 監視（フィルタ変更で1ページ目から） ===== */
watch([categoryFilter, keyword, statusFilter], () => {
  page.value = 1;
  reload();
});

/* ===== 取得 ===== */
async function reload() {
  loading.value = true;
  try {
    const cat = Number(categoryFilter.value || 0);
    const params = {
      page: page.value,
      per_page: perPage.value, // ★ perPage → per_page
      status: statusFilter.value,
      category_ids: cat ? String(cat) : "3,4",
      ...(cat ? { category_id: cat } : {}),
    };

    if (keyword.value) params.q = keyword.value;

    let data;
    try {
      // まずは category_ids 対応 API を試す
      const res = await http.get(API_BASE, { params });
      data = res?.data;
    } catch (e) {
      // フォールバック：category_id 2回呼び出して手でマージ（3/4）
      if (!categoryFilter.value) {
        const [r3, r4] = await Promise.all([
          http.get(API_BASE, {
            params: { page: 1, per_page: perPage.value, category_id: 3, q: keyword.value || "" },
          }),
          http.get(API_BASE, {
            params: { page: 1, per_page: perPage.value, category_id: 4, q: keyword.value || "" },
          }),
        ]);
        const list = [...(r3?.data?.items || []), ...(r4?.data?.items || [])].sort(
          (a, b) =>
            new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at),
        );
        data = {
          page: 1,
          per_page: perPage.value,
          total: list.length,
          items: list.slice((page.value - 1) * perPage.value, page.value * perPage.value),
        };
      } else {
        // 片方のみならそのまま失敗を投げる
        throw e;
      }
    }

    // 受け取った配列を正規化
    let list = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];
    list = list.map(nrmAnn);

    // ここで「3/4以外（例: 5）」を強制カット
    console.log("list:", list);
    list = list.filter((it) => Number(it.category_id) === 3 || Number(it.category_id) === 4);
    // 単独指定があればさらに絞る
    if (cat) list = list.filter((it) => Number(it.category_id) === cat);

    items.value = list;
    total.value = Number(data?.total ?? data?.cnt ?? list.length);
  } catch (err) {
    console.error("[office:ann:list] failed", err);
    items.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

function go(to) {
  if (to < 1 || to > totalPages.value || loading.value) return;
  page.value = to;
  reload();
}

/* ===== 表示ヘルパ ===== */
function nrmAnn(row) {
  const cidRaw =
    row.category_id ?? row.categoryId ?? row.category_code ?? row.category?.id ?? row.category ?? 0;
  const cid = Number(cidRaw);

  return {
    id: Number(row.id),
    title: String(row.title || ""),
    category_id: Number.isFinite(cid) ? cid : 0,
    category_name: row.category_name || row.category?.name || "",
    image_path: row.image_path || row.imageUrl || row.images?.[0]?.image_path || "",
    published_at: row.published_at || row.created_at || "",
    created_at: row.created_at || "",
    view_count: row.view_count ?? 0,

    // ★ 追加（DBの値をそのまま反映）
    is_draft: Number(row.is_draft ?? 0) === 1,
    is_published: Number(row.is_published ?? 0) === 1,
    is_paused: Number(row.is_paused ?? 0) === 1,
  };
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

function imageUrl(p) {
  if (!p) return "";
  const rel = String(p).trim().replace(/^\/+/, "");
  if (/^https?:\/\//i.test(rel)) return rel;
  return `${ORIGIN}/${rel}`;
}
function onImgError(e) {
  const t = e?.target;
  if (t) {
    t.onerror = null;
    t.src = "/stock-images/no-image.png";
  }
}

function catName(id) {
  return Number(id) === 3 ? "事務局から" : Number(id) === 4 ? "特集" : "その他";
}

function badgeClass(id) {
  return Number(id) === 3 ? "-office" : Number(id) === 4 ? "-feature" : "";
}

// function resetFilters () {
//   categoryFilter.value = ''
//   keyword.value = ''
//   page.value = 1
//   reload()
// }
</script>

<style scoped>
.mypage-detail {
  padding: 20px 40px;
}
.page-title {
  text-align: center;
  margin: 6px 0 16px;
}

/* ツールバー */
.toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.filters {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
}
.input.keyword {
  min-width: 220px;
}
.btn {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.btn-ghost {
  background: #fff;
  color: #374151;
}
.btn-accent {
  background: #10b981;
  color: #fff;
  border-color: #10b981;
}
.btn-sm {
  padding: 6px 10px;
}

/* 一覧 */
.list {
  margin-top: 28px;
}
.loading,
.empty {
  padding: 18px;
  text-align: center;
  color: #6b7280;
}
.rows {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}
.row {
  position: relative;
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 12px;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}
.stretched-link {
  position: absolute;
  inset: 0;
  border-radius: 12px;
}

.thumb img {
  width: 96px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.meta {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #6b7280;
  font-size: 12px;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 800;
  color: #fff;
}
.badge.-office {
  background: #6366f1;
}
.badge.-feature {
  background: #f59e0b;
}
.date {
  color: #6b7280;
}
.views {
  display: flex;
  align-items: center;
  gap: 4px;
}
.views .ico {
  width: 16px;
  height: 16px;
}

.title {
  font-weight: 800;
  font-size: 16px;
  color: #111827;
  line-height: 1.35;
}

.ops {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 2; /* ✅ stretched-link より前面 */
  align-items: flex-end; /* 右寄せのまま */
}

/* ボタン幅を揃えたい場合（任意） */
.ops .btn {
  min-width: 86px;
  text-align: center;
}

.pager {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.page {
  font-weight: 700;
}

/* カテゴリ名バッジを読みやすく（幅・行高・中央寄せ） */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px; /* 少し広め */
  min-width: 96px; /* ★ 幅を確保（お好みで 88〜112px 程度） */
  white-space: nowrap; /* ★ 1行に収める */
  line-height: 1.2; /* 行高を詰めて見やすく */
  font-weight: 800;
  color: #fff;
  border-radius: 999px;
}

/* メタ情報の詰まり防止（バッジを広げても崩れないように） */
.meta {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap; /* 余白が足りないときは折返しOK */
}
.date {
  white-space: nowrap;
} /* 日付は折り返さない */

.state {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}

.state.-draft {
  border-color: #f59e0b;
  color: #b45309;
  background: #fffbeb;
}

/* モバイルで少しだけコンパクトに */
@media (max-width: 480px) {
  .badge {
    min-width: 84px;
    padding: 6px 10px;
    font-size: 12px;
  }
}

.state.-paused {
  border-color: #ef4444;
  color: #b91c1c;
  background: #fef2f2;
}
</style>
