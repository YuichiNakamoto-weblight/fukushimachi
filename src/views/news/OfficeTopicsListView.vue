<!-- src/views/news/OfficeTopicsListView.vue -->
<!-- 特集（カテゴリー：4）一覧ページ -->
<template>
  <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main>
        <section class="l-sec mypage-detail">
          <div class="page-title maru">特集</div>

          <div class="inner">
            <template v-if="items.length">
              <section class="cards">
                <article v-for="it in items" :key="it.id" class="card">
                  <router-link :to="{ name: 'AnnouncementDetail', params: { id: it.id } }">
                    <!-- 画像領域：常に一定サイズで確保。画像なしはプレースホルダーを描画 -->
                    <figure class="thumb">
                      <img
                        v-if="hasImage(it)"
                        :src="imageUrl(it.image_path)"
                        @error="onImgError"
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <div v-else class="thumb__ph" aria-hidden="true"></div>
                    </figure>

                    <div class="meta">
                      <span class="badge">特集</span>
                      <time class="date">{{ formatDate(it.published_at) }}</time>
                    </div>
                    <h3 class="title">{{ it.title }}</h3>
                  </router-link>
                </article>
              </section>
              <!-- ページネーション（itemsがあるときだけ出す） -->
              <nav v-if="lastPage > 1" class="pager" aria-label="ページネーション">
                <button class="pager__btn" :disabled="page <= 1 || loading" @click="go(page - 1)">
                  前へ
                </button>

                <button
                  v-for="p in pages"
                  :key="p.key"
                  class="pager__num"
                  :class="{ 'is-active': p.num === page, 'is-ellipsis': p.ellipsis }"
                  :disabled="p.ellipsis || loading"
                  @click="!p.ellipsis && go(p.num)"
                >
                  {{ p.label }}
                </button>

                <button
                  class="pager__btn"
                  :disabled="page >= lastPage || loading"
                  @click="go(page + 1)"
                >
                  次へ
                </button>
              </nav>
            </template>

            <p v-else class="empty">掲載中の特集はありません。</p>
          </div>

          <div class="btn-back">
            <a
              href="#"
              onclick="
                history.back();
                return false;
              "
            >
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
  </div>

  <PcModel />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { http } from "@/api/http";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
import FooterNav from "@/components/layout/FooterNav.vue";
import PcModel from "@/components/layout/PcModel.vue";

const route = useRoute();
const router = useRouter();

const items = ref([]);
const loading = ref(false);

const PER_PAGE = 20;

const page = ref(Number(route.query.page ?? 1) || 1);
const total = ref(0);
const lastPage = ref(1);

/* ========== 画像URLユーティリティ（既存のまま） ========== */
const strip = (s = "") => String(s).replace(/^\/+|\/+$/g, "");
const originOf = (s) => {
  try {
    return s ? new URL(s).origin : "";
  } catch {
    return "";
  }
};

const APP_ORIGIN =
  originOf(import.meta.env.VITE_PUBLIC_BASE_URL) ||
  originOf(import.meta.env.VITE_API_BASE_URL) ||
  window.location.origin;
const ORIGIN = String(APP_ORIGIN)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const FALLBACK = `${import.meta.env.BASE_URL}stock-images/no-image.png`;
const hasImage = (it) => !!String(it?.image_path || "").trim();

const imageUrl = (p) => {
  if (!p) return FALLBACK;
  const raw = String(p).trim();
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (/^\/uploads\//i.test(raw)) return `${ORIGIN}${raw}`;
  if (/^\/upload\//i.test(raw)) return `${ORIGIN}${raw.replace(/^\/upload\//i, "/uploads/")}`;
  return `${ORIGIN}/${strip(raw)}`;
};
const onImgError = (e) => {
  if (e?.target) e.target.src = FALLBACK;
};
const formatDate = (dt) => (dt ? new Date(dt).toLocaleDateString("ja-JP") : "");

/* ========== データ取得 ========== */
const fetchPage = async (p) => {
  loading.value = true;
  try {
    const safePage = Math.max(1, Number(p) || 1);

    const { data } = await http.get("/announcements/office", {
      params: { page: safePage, per_page: PER_PAGE },
    });

    items.value = Array.isArray(data?.items) ? data.items : [];
    total.value = Number(data?.total ?? 0);
    lastPage.value = Math.max(1, Number(data?.last_page ?? 1));
    page.value = Math.min(safePage, lastPage.value); // 念のため上限補正
  } finally {
    loading.value = false;
  }
};

/* ========== 画面操作 ========== */
const go = async (p) => {
  const next = Math.max(1, Math.min(Number(p) || 1, lastPage.value));
  // クエリに page を載せる（戻る/共有/リロード対応）
  await router.replace({ query: { ...route.query, page: String(next) } });
  await fetchPage(next);
};

/* ========== ページ番号の配列（…付き） ========== */
const pages = computed(() => {
  const cur = page.value;
  const last = lastPage.value;
  const res = [];

  const push = (num) => res.push({ key: `p-${num}`, num, label: String(num), ellipsis: false });
  const dots = (k) => res.push({ key: `d-${k}`, num: null, label: "…", ellipsis: true });

  if (last <= 7) {
    for (let i = 1; i <= last; i++) push(i);
    return res;
  }

  push(1);

  const start = Math.max(2, cur - 1);
  const end = Math.min(last - 1, cur + 1);

  if (start > 2) dots("l");

  for (let i = start; i <= end; i++) push(i);

  if (end < last - 1) dots("r");

  push(last);
  return res;
});

onMounted(async () => {
  await fetchPage(page.value);
});
</script>

<style scoped>
.news-list {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

/* 画像領域：最初から固定高さを確保して“ゆらぎ”防止 */
.thumb {
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.thumb__ph {
  width: 100%;
  height: 100%;
  background: #f3f4f6; /* グレーのプレースホルダー */
  /* 必要なら薄いアイコンなど：
     background:#f3f4f6 url(/src/assets/images/common/no-image.svg) center/64px no-repeat; */
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 12px;
  color: #6b7280;
}
.badge {
  background: #111827;
  color: #fff;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
}
.title {
  padding: 0 12px 14px;
  font-size: 16px;
  line-height: 1.5;
  color: #111827;
}
.empty {
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
}

/* デスクトップではカードを1列に固定（デザインの意図に合わせて残す） */
@media (min-width: 1024px) {
  .cards {
    grid-template-columns: 1fr !important;
    max-width: 800px;
    margin: 0 auto;
  }
}

/* スマホ：ヘッダー実寸で .content を下げる（相殺防止） */
@media (max-width: 768px) {
  :root {
    --header-height: 72px;
  } /* JS が上書きします */
  .content {
    padding-top: var(--header-height);
  }
  .content > main > .l-sec:first-child {
    margin-top: 50px;
  }
}

.pager {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin: 18px 0 6px;
}

.pager__btn,
.pager__num {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1;
}

.pager__btn:disabled,
.pager__num:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pager__num.is-active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.pager__num.is-ellipsis {
  border-color: transparent;
  background: transparent;
  padding: 8px 6px;
}
</style>
