<!-- src/components/news/RelatedFacilityAnnouncements.vue -->
<template>
  <section class="rel-anns">
    <!-- <h2 class="panel-title">関連する「特集」</h2> -->

    <div v-if="loading" class="loading">読み込み中…</div>
    <div v-else>
      <div v-if="items.length === 0" class="empty">関連するお知らせはありません。</div>

      <ul class="card-list" v-else>
        <li v-for="it in items" :key="it.id" class="card">
          <!-- 左上リボン -->
          <div class="ribbon">介護施設情報</div>
          <!-- 右上 施設名 -->
          <div class="org" v-if="facilityName">{{ facilityName }}</div>

          <router-link class="inner" :to="{ name: 'AnnouncementDetail', params: { id: it.id } }">
            <div class="thumb" aria-hidden="true">
              <img :src="imageUrl(it.image_path)" :alt="it.title" @error="onImgError" />
            </div>
            <div class="body">
              <h3 class="headline">{{ it.title }}</h3>
              <p class="date">{{ formatDate(it.published_at || it.created_at) }}</p>
              <p class="excerpt" v-if="it.body">{{ excerpt(it.body) }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { http } from '@/api/http'

const props = defineProps({
  /** 求人のオーナー user_id（announcements.created_by と一致させる） */
  ownerUserId: { type: [Number, String], required: true },
  /** 表示用：施設名（右上に出す） */
  facilityName: { type: String, default: '' },
  /** 取得件数（任意） */
  limit: { type: Number, default: 4 },
})

const items = ref([])
const loading = ref(false)

/** 画像URLを絶対化（/api や / を吸収） */
const RAW_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin
const ORIGIN = String(RAW_BASE).replace(/\/+$/, '').replace(/\/api$/, '')
const FALLBACK = `${import.meta.env.BASE_URL}stock-images/no-image.png`

function imageUrl(p) {
  if (!p) return FALLBACK
  const s = String(p)
  if (/^https?:\/\//i.test(s)) return s
  const path = s.startsWith('/') ? s : `/${s}`
  return `${ORIGIN}${path}`
}
function onImgError(e) { e?.target && (e.target.src = FALLBACK) }

function formatDate(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${dd}`
}
function excerpt(htmlOrText, max = 100) {
  const text = String(htmlOrText || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max) + '…' : text
}

async function load() {
  if (!props.ownerUserId) { items.value = []; return }
  loading.value = true
  try {
    // ① 一覧（公開 & 自分が作成したもの）
    const { data } = await http.get('/announcements', {
      params: { page: 1, per_page: props.limit, scope: 'mine', user_id: props.ownerUserId, public: 1 }
    })
    const rows = Array.isArray(data?.items) ? data.items : []

    // ② 1枚目の画像・本文が必要なので詳細をまとめて取得
    const detailed = await Promise.all(rows.map(async r => {
      try {
        const { data: d } = await http.get(`/announcements/${r.id}`)
        const img = d?.images?.[0]?.url || d?.images?.[0]?.image_path || ''
        return { ...r, image_path: img, body: d?.body ?? '' }
      } catch { return { ...r, image_path: '', body: '' } }
    }))

    // ③ 「施設から」カテゴリ優先で並べ替え（任意）
    items.value = detailed
      .filter(a => a) // 念のため
      .slice(0, props.limit)
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => props.ownerUserId, load)
</script>

<style scoped>
.rel-anns { margin-top: 18px; }
.panel-title { text-align: center; font-weight: 700; margin: 0 0 12px; }
.loading, .empty { text-align: center; color: #64748b; padding: 8px 0; }

.card-list { display: grid; gap: 14px; }
.card {
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 10px rgba(0,0,0,.08);
}
.ribbon {
  position: absolute; left: 12px; top: -10px;
  background: #c79a63; color: #fff;
  padding: 8px 14px; border-radius: 6px 6px 6px 0; font-weight: 700; font-size: 13px;
}
.org { position: absolute; right: 14px; top: 10px; color: #6b7280; font-size: 13px; }

.inner { display: grid; grid-template-columns: 220px 1fr; gap: 16px;
  align-items: start; padding: 14px; text-decoration: none; color: inherit; }
.thumb img { width: 100%; height: 140px; object-fit: cover; border-radius: 8px; display: block; }
.headline { font-size: 18px; font-weight: 700; line-height: 1.5; color: #0f172a; }
.date { margin-top: 8px; color: #475569; font-size: 13px; }
.excerpt { margin-top: 6px; color: #374151; font-size: 14px; line-height: 1.7; }

@media (max-width: 640px) {
  .inner { grid-template-columns: 1fr; }
  .thumb img { height: 180px; }
}
</style>
