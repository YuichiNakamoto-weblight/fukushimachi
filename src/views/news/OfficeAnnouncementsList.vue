<!-- src/views/news/OfficeAnnouncementsList.vue -->
<!-- 事務局からのお知らせ（カテゴリ4）一覧 -->
<template>
  <div class="news-wrap">
    <AppHeader />
    <HamburgerMenu />

    <main class="page">
      <h1 class="title">事務局からのお知らせ</h1>

      <div v-if="loading" class="loading">読み込み中…</div>
      <div v-else>
        <div v-if="items.length === 0" class="empty">お知らせはありません。</div>

        <ul class="news-list">
          <li
            v-for="it in items"
            :key="it.id"
            class="news-card"
            role="link"
            tabindex="0"
            @click="goDetail(it.id)"
            @keydown.enter="goDetail(it.id)"
          >
            <!-- 左上リボン風ラベル -->
            <div class="ribbon">事務局</div>

            <!-- 施設名など右上に入れるならここ（任意）
            <div class="org">ふくしまちケアセンター</div> -->

            <div class="card-inner">
              <div class="thumb" v-if="it.image_path">
                <img :src="imageUrl(it.image_path)" alt="" />
              </div>
              <div class="body">
                <div class="headline">
                  {{ it.title }}
                </div>

                <p class="date">{{ formatDate(it.published_at) }}</p>

                <p class="excerpt" v-if="it.body">
                  {{ excerpt(it.body) }}
                </p>

                <a
                  v-if="it.button_url && it.button_label"
                  class="btn-link"
                  :href="it.button_url"
                  target="_blank"
                  rel="noopener"
                >
                  {{ it.button_label }}
                </a>
              </div>
            </div>
          </li>
        </ul>

        <!-- ページネーション（最大3件/ページ） -->
        <div v-if="totalPages > 1" class="pager">
          <button class="pg-btn" :disabled="page<=1" @click="go(page-1)">前へ</button>
          <span class="pg-info">{{ page }} / {{ totalPages }}</span>
          <button class="pg-btn" :disabled="page>=totalPages" @click="go(page+1)">次へ</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '@/api/http' // baseURL は VITE_API_BASE_URL ?? '/api'

const router = useRouter()
const route = useRoute()

const goDetail = (id) => {
  router.push({ name: 'AnnouncementDetail', params: { id: Number(id) } })
}

const page = ref(Number(route.query.page || 1))
const loading = ref(false)
const items = ref([])
const totalPages = ref(1)

/** 画像URLを返す（必要ならここで完全URL化などの処理を入れる）
 * @param {string} path
 * @returns {string}
 */
function imageUrl(path) {
  return path
}

/** yyyy.mm.dd で日付表示
 * @param {string} dt
 * @returns {string}
 */
function formatDate(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${dd}`
}

/** 本文から抜粋を生成（タグ除去）
 * @param {string} htmlOrText
 * @param {number} [max=120]
 * @returns {string}
 */
function excerpt(htmlOrText, max = 120) {
  const text = String(htmlOrText).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max) + '…' : text
}

async function load() {
  loading.value = true
  try {
    const { data } = await http.get('/announcements/office', {
      params: { page: page.value, per_page: 3 }
    })
    items.value = data && data.items ? data.items : []
    totalPages.value = data && data.last_page ? data.last_page : 1
  } finally {
    loading.value = false
  }
}

function go(p) {
  router.replace({ query: { page: p } })
}

watch(
  () => route.query.page,
  (v) => {
    page.value = Math.max(1, Number(v || 1))
    load()
  }
)

onMounted(load)
</script>

<style scoped>
.page { padding: 20px; }
.title { font-size: 20px; font-weight: 700; margin: 10px 0 20px; }

/* カード群 */
.news-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
.news-card {
  position: relative;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 10px rgba(0,0,0,.08);
  padding: 14px;
  cursor: pointer;
}
.news-card:focus-visible { outline: 2px solid #c79a63; outline-offset: 2px; }

/* 左上のリボン */
.ribbon {
  position: absolute;
  left: 12px;
  top: -10px;
  background: #c79a63; /* 画像のブラウン寄せ */
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px 6px 6px 0;
  font-weight: 700;
  font-size: 13px;
}

/* 右上の施設名など（必要なら） */
.org {
  position: absolute;
  right: 14px;
  top: 10px;
  color: #6b7280;
  font-size: 13px;
}

.card-inner { display: grid; grid-template-columns: 220px 1fr; gap: 16px; align-items: start; }
.thumb img { width: 100%; height: auto; border-radius: 8px; display: block; object-fit: cover; }
.body .headline {
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: #0f172a;
  text-decoration: none;
}
.body .headline:hover { text-decoration: underline; }

.date { margin-top: 10px; color: #475569; font-size: 13px; }
.excerpt { margin-top: 8px; color: #374151; font-size: 14px; line-height: 1.7; }
.btn-link {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 9999px;
  border: 1px solid #c79a63;
  color: #a7742c;
  text-decoration: none;
  font-size: 13px;
}
.btn-link:hover { background: #fff7ed; }

.pager { display:flex; align-items:center; justify-content:center; gap: 12px; margin: 18px 0; }
.pg-btn { padding: 6px 12px; border: 1px solid #cbd5e1; background: #fff; border-radius: 8px; }
.pg-btn:disabled { opacity: .5; cursor: not-allowed; }
.pg-info { font-size: 13px; color: #64748b; }

/* スマホ */
@media (max-width: 640px) {
  .card-inner { grid-template-columns: 1fr; }
  .thumb img { width: 100%; }
}
</style>
