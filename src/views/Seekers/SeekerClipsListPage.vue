<!-- src/views/Seekers/SeekerClipsListPage.vue ※未使用？-->
<!-- 求職者用クリップ一覧 -->
<template>
  <body class="is-user is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main class="clips-list">
        <div class="page-title maru">クリップ一覧</div>

        <section v-if="loading" class="loading">読み込み中…</section>

        <section v-else>
          <article
            v-for="it in list"
            :key="`${it.job_id}-${it.clip_at || it.created_at || it.id}`"
            class="card clickable"
          >
            <!-- カード全面をクリック可能にするストレッチリンク -->
            <router-link
              class="stretched-link"
              :to="{ name: 'JobDetail', params: { id: it.job_id } }"
              aria-label="求人詳細へ"
            />

            <header class="card-head">
              <div class="dt">{{ formatDateTime(it.clip_at || it.created_at) }}</div>
              <div class="msg">この求人をクリップしました</div>
              <div class="meta">{{ it.facility_name || '-' }}</div>
            </header>

            <h2 class="job-title">{{ it.job_title }}</h2>

            <div class="body">
              <div class="thumb">
                <img :src="imageUrl(it.image_1)" @error="onImgError" alt="" />
              </div>
              <div class="info">
                <div class="fac">{{ it.facility_name }}</div>

                <div class="row">
                  <span v-if="it.employment_type_name" class="badge">
                    {{ it.employment_type_name }}
                  </span>
                </div>

                <ul class="rows">
                  <li>📍 {{ it.job_city || it.city || '-' }}</li>
                  <li>
                    💴
                    {{ salaryLabel(it.base_salary_type, it.base_salary_min, it.base_salary_max) }}
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <div v-if="!list.length" class="empty">まだクリップした求人はありません。</div>

          <!-- ページネーション -->
          <nav class="pager" aria-label="ページネーション" v-if="totalPages > 1 || hasNextFallback">
            <button class="pg-btn" :disabled="page<=1" @click="goPrev">前へ</button>
            <span class="pg-stat">Page {{ page }} <span v-if="totalPages">/ {{ totalPages }}</span></span>
            <button class="pg-btn" :disabled="!hasNext" @click="goNext">次へ</button>
          </nav>

          <div class="btn-back">
            <a href="#" @click.prevent="goBack">
              <span class="ico"><img src="/src/assets/images/common/ico-back.svg" /></span>
              戻る
            </a>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  </body>

  <!-- 背景など（装飾） -->
  <!-- <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt />
  </div>
  <div class="hero-copy pc">
    <img
      src="/src/assets/images/home/hero-copy.svg"
      alt="はなして、わかって、マッチする。あたらしい介護の就活。"
    />
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしまち" /></a>
    </h1>
    <h1 class="sitelogo user-content">
      <a href="/user"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしまち" /></a>
    </h1>
  </div> -->
    <PcModel />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

/* ------ ログインユーザーIDの取得（安全版） ------ */
function readSeekerId () {
  try {
    const cands = [
      localStorage.getItem('auth_user'),
      sessionStorage.getItem('auth_user'),
      localStorage.getItem('userId'),
      sessionStorage.getItem('userId'),
    ]
    for (const v of cands) {
      if (!v) continue
      if (/^\s*\d+\s*$/.test(v)) return Number(v)
      try {
        const o = JSON.parse(v)
        const n = Number(o?.id ?? o?.userId ?? o?.user?.id)
        if (Number.isFinite(n) && n > 0) return n
      } catch {/* noop */}
    }
  } catch {/* noop */}
  return 0
}
const seekerId = readSeekerId()

/* ------ API クライアント（必ず認証ヘッダを付ける） ------ */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  if (seekerId) config.headers['X-User-Id'] = String(seekerId)
  config.headers['X-User-Type'] = 'seeker'
  return config
})

/* ------ 画像URL＆表示ユーティリティ ------ */
const RAW_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  window.location.origin
const ORIGIN = String(RAW_BASE).replace(/\/+$/,'').replace(/\/api$/,'')
const fallback = '/stock-images/no-image.png'
function imageUrl (p) {
  if (!p) return fallback
  const rel = String(p).trim().replace(/^\/+/, '')
  if (/^https?:\/\//i.test(rel)) return rel
  if (/^(jobs|images)\//i.test(rel)) return `${ORIGIN}/uploads/${rel}`
  return `${ORIGIN}/uploads/jobs/${rel}`
}
function onImgError (e) { const t=e?.target; if (t){ t.onerror=null; t.src=fallback } }

function formatDateTime (s){
  if (!s) return ''
  const d = new Date(s); if (Number.isNaN(+d)) return ''
  const Y=d.getFullYear(), M=String(d.getMonth()+1).padStart(2,'0'), D=String(d.getDate()).padStart(2,'0')
  const h=String(d.getHours()).padStart(2,'0'), m=String(d.getMinutes()).padStart(2,'0')
  return `${Y}.${M}.${D} ${h}:${m}`
}
const formatMoney = (v) => (v==null||v===''||Number.isNaN(Number(v))) ? '-' : Number(v).toLocaleString()
function salaryLabel (type, min, max) {
  const prefix = type === 'hourly' ? '時給 ' : type === 'monthly' ? '月給 ' : ''
  const minStr = formatMoney(min)
  const hasMax = max != null && max !== '' && !Number.isNaN(Number(max))
  const maxStr = hasMax ? `〜${formatMoney(max)}` : ''
  return `${prefix}${minStr}${maxStr}`
}

/* ------ 20件ページング + 3段フォールバック取得 ------ */
const list = ref([])
const loading = ref(false)
const page = ref(1)
const perPage = 20
const total = ref(0)

const totalPages = computed(() =>
  total.value > 0 ? Math.max(1, Math.ceil(total.value / perPage)) : 0
)
const hasNext = computed(() =>
  totalPages.value ? page.value < totalPages.value : list.value.length === perPage
)

function normalizeResponse(res){
  const d = res?.data ?? {}
  return {
    items: Array.isArray(d.items) ? d.items
         : Array.isArray(d.rows)  ? d.rows
         : Array.isArray(d.list)  ? d.list
         : [],
    total: Number(d.total ?? d.total_count ?? d.count ?? 0) || 0,
  }
}

async function fetchList(){
  if (!seekerId){ list.value=[]; total.value=0; return }
  loading.value = true
  try {
    // ① /jobs/clips
    let res = await API.get('/jobs/clips', {
      params: { user_id: seekerId, seeker_id: seekerId, userId: seekerId, page: page.value, perPage }
    })
    let { items, total: t } = normalizeResponse(res)

    // ② /seekers/clips
    if (!items.length && (res.status === 404 || res.status === 400 || res.status === 204)) {
      res = await API.get('/seekers/clips', {
        params: { user_id: seekerId, seeker_id: seekerId, userId: seekerId, page: page.value, perPage }
      })
      ;({ items, total: t } = normalizeResponse(res))
    }

    // ③ /jobs?view=clips
    if (!items.length) {
      res = await API.get('/jobs', {
        params: { view: 'clips', user_id: seekerId, seeker_id: seekerId, userId: seekerId, page: page.value, perPage }
      })
      ;({ items, total: t } = normalizeResponse(res))
    }

    list.value  = items
    total.value = t
    // console.debug('[clips] items=', items.length, 'total=', total.value)
  } catch (e) {
    console.error('[seeker:clips:list] fetch failed', e)
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function goPrev(){ if (page.value > 1) page.value -= 1 }
function goNext(){ if (hasNext.value) page.value += 1 }
function goBack() {
  try {
    router.back()
  } catch {
    router.push({ name: 'Jobs' })
  }
}

watch(page, fetchList, { immediate: true })
// onMounted(() => {})

/* --- 5秒ポーリング & フォーカス即時更新（load → fetchList に修正） --- */
let pollTimer = 0
function startPolling () {
  stopPolling()
  pollTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetchList()
    }
  }, 5000)
}
function stopPolling () {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = 0
  }
}
function onFocus () { fetchList() }

onMounted(() => {
  startPolling()
  window.addEventListener('focus', onFocus)
})
onBeforeUnmount(() => {
  stopPolling()
  window.removeEventListener('focus', onFocus)
})
/* --- 追記ここまで --- */
</script>




<style scoped>
.clips-list{ max-width:1000px; margin:0 auto; padding:20px 14px 40px; }
.page-title{ text-align:center; font-weight:800; font-size:24px; margin:6px 0 16px; }
.loading{ padding:30px; text-align:center; color:#666; }
.empty{ padding:28px; text-align:center; color:#666; }

/* card */
.card{
  background:#fff; border:1px solid #e5e7eb; border-radius:16px;
  padding:12px 12px 16px; margin:16px 0; box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.card-head{ background:#46a8d9; color:#fff; border-radius:12px; padding:10px 12px; }
.card-head .dt{ font-weight:800; }
.card-head .msg{ margin-top:4px; font-size:15px; font-weight:700; }
.card-head .meta{ margin-top:2px; font-size:13px; opacity:.95; }

.job-title{ margin:10px 4px 6px; font-size:20px; font-weight:800; color:#111827; }

.body{ display:grid; grid-template-columns: 180px 1fr; gap:12px; align-items:center; }
.thumb img{
  width:100%; height:120px; object-fit:cover; border-radius:12px;
  box-shadow:0 6px 16px rgba(0,0,0,.08);
}

.info .fac{ font-weight:700; margin-bottom:4px; }
.badge{ background:#2563eb; color:#fff; font-size:12px; padding:4px 8px; border-radius:8px; }
.rows{ list-style:none; padding:0; margin:8px 0 0; display:grid; gap:4px; color:#374151; }

/* ストレッチリンク＆クリック感 */
.card{ position: relative; }
.clickable{ cursor: pointer; }
.stretched-link{
  position:absolute; inset:0; z-index:1;
  border-radius:12px;
}
.stretched-link:focus{ outline: 3px solid rgba(99,102,241,.35); outline-offset: 3px; }
.card :where(button, a:not(.stretched-link), input, select){ position:relative; z-index:2; }

@media (max-width:640px){
  .body{ grid-template-columns: 1fr; }
  .thumb img{ height:180px; }
}

/* pager */
.pager{
  display:flex; align-items:center; justify-content:center; gap:12px;
  margin: 14px 0 6px;
}
.pg-btn{
  appearance:none; border:none; border-radius:999px; padding:8px 14px;
  background:#e5e7eb; color:#111827; font-weight:800; cursor:pointer;
}
.pg-btn[disabled]{ opacity:.5; cursor:not-allowed; }
.pg-stat{ color:#374151; font-weight:700; }
</style>
