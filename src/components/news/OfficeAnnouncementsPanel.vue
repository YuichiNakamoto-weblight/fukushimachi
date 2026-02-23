<!-- src/components/news/OfficeAnnouncementsPanel.vue -->
<!-- 事務局からのお知らせ表示用コンポーネント -->
<template>
  <div class="topics-item" style="margin-bottom:0">
    <!-- ヘッダーは飾り、リンクにしない -->
    <div class="topics-item-head flex">
      <div class="topics-cat employer">介護施設情報</div>
      <div class="topics-autor">ふくしまちケアセンター</div>
    </div>

    <div v-if="items.length">
      <RouterLink
        v-for="it in items"
        :key="it.id"
        class="topics-item-summary flex"
        :to="{ name: 'AnnouncementDetail', params: { id: it.id } }"
      >
        <div class="topics-item-tmb" v-if="it.image_path">
          <img :src="imageUrl(it.image_path)" alt="">
        </div>
        <div class="topics-item-txt">
          <div class="topics-item-title">{{ it.title }}</div>
          <div class="date">{{ formatDate(it.published_at) }}</div>
        </div>
      </RouterLink>
    </div>

    <div v-else class="empty">お知らせはありません</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { http } from '@/api/http'

const props = defineProps({ limit: { type: Number, default: 3 } })
const items = ref([])
const imageUrl = (p) => p

const formatDate = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${dd}`
}

onMounted(async () => {
  const { data } = await http.get('/announcements/office', {
    params: { page: 1, per_page: props.limit },
  })
  items.value = Array.isArray(data?.items) ? data.items : []
})
</script>


<style scoped>
.office-ann-panel { margin-top: 18px; }
.panel-title { font-size: 18px; font-weight: 700; margin: 0 0 10px; }
.cards { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.card {
  display: grid; grid-template-columns: 120px 1fr; gap: 12px;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px;
  cursor: pointer;
}
.card:focus-visible { outline: 2px solid #c79a63; outline-offset: 2px; }
.thumb img { width: 100%; height: 80px; object-fit: cover; border-radius: 8px; }
.body .title { font-weight: 700; line-height: 1.5; }
.date { margin-top: 4px; color: #64748b; font-size: 12px; }
.excerpt { margin-top: 6px; color: #374151; font-size: 13px; line-height: 1.6; }
.empty { color: #6b7280; font-size: 14px; }
@media (max-width: 640px) {
  .card { grid-template-columns: 1fr; }
  .thumb img { width: 100%; height: 140px; }
}
</style>
