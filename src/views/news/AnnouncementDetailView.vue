<!-- src/views/news/AnnouncementDetailView.vue -->
 <!-- お知らせ詳細ページ -->
<template>
  <body class="news is-employer is-login">
    <div class="wrap">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

      <main>
        <!-- <section class="l-sec news-detail"> -->
        <section class="l-sec news-detail" :class="{ 'is-feature': isFeature }">
          <!-- 閲覧数 -->
          <div class="view-counter">
            <span class="ico"><img src="/src/assets/images/jobs/ico-view.svg"></span>
            {{ ann.view_count == null ? 0 : ann.view_count }}
          </div>

          <!-- <span class="job-list-item__data--view">
              <span class="ico"><img src="/src/assets/images/jobs/ico-view.svg"></span>
              {{ ann.view_count == null ? 0 :ann.view_count }}
          </span> -->

        <div class="inner">
          <!-- タイトル -->
          <h1 class="news-title">{{ ann.title || 'お知らせ' }}</h1>

          <!-- 事業所名 -->
          <div class="news-facility" v-if="facilityText">{{ facilityText }}</div>

          <!-- 日付 / 施設名 -->
          <!-- <div class="news-summary" v-if="dateText || facilityText">
            <span v-if="dateText">{{ dateText }}</span>
            <span v-if="dateText && facilityText" class="sep">/</span>
            <span v-if="facilityText">{{ facilityText }}</span>
          </div> -->

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
                :class="{ 'is-active': idx === current,'is-portrait': img.isPortrait, }"
              >
              <img
                :src="img.url"
                alt=""
                @load="onImgLoad($event, img)"
              />
              </figure>
            </div>

            <!-- サムネイル -->
            <!-- <div class="thumbs" role="tablist" aria-label="画像サムネイル">
              <button
                v-for="(img, idx) in images"
                :key="'t'+idx"
                class="thumb"
                :class="{ 'is-active': idx === current }"
                :aria-selected="idx === current ? 'true' : 'false'"
                :tabindex="idx === current ? 0 : -1"
                @click="go(idx)"
              >
                <img :src="img.url" alt="" />
              </button>
            </div> -->
          </section>

          <!-- 本文 -->
          <!-- <section v-if="ann.body" class="body">
            <p class="text">{{ ann.body }}</p>
          </section> -->
          <section v-if="ann.body" class="body">
            <!-- 事務局 or 特集は HTML を許可（サニタイズ済み） -->
            <div v-if="ann.category_id === 3 || ann.category_id === 4"
                  class="text" v-html="safeBodyHtml"></div>
            <p v-else class="text">{{ ann.body }}</p>
          </section>

          <!-- 概要（見出し＋内容、線で区切り） -->
          <section v-if="summaries.length" class="summaries">
            <div class="sum" v-for="(s, i) in summaries" :key="i">
              <h3 class="sum-head" v-if="s.heading">{{ s.heading }}</h3>
              <p class="sum-body" v-if="s.content">{{ s.content }}</p>
            </div>
          </section>

          <!-- ボタンラベル / URL が設定されている場合のCTAボタン -->
          <section v-if="ann.button_url" class="news-cta">
            <a
              class="btn btn-primary maru news-cta__btn"
              :href="ann.button_url"
              target="_blank"
              rel="noopener"
            >
              {{ ann.button_label || '詳しくはこちら' }}
            </a>
          </section>

          <!-- 施設から（category_id=5）のときだけ表示する単リンク -->
          <section v-if="isFromFacility && ann.user_id" class="l-sec">
            <router-link
              class="facility-jobs-link"
              :to="{ name: 'FacilityJobs', params: { userId: ann.user_id }, query: { facility_name: facilityText } }"
            >
              {{ facilityText || 'この施設' }} の求人情報を見る
              <span class="arr" aria-hidden="true"></span>
            </router-link>
          </section>


          <!-- 特集（カテゴリー=4）の場合だけ表示 -->
          <section v-if="isFeature && relatedJobs.length > 0" class="l-sec">
            <div class="page-title maru">{{ relatedTitle }}</div>

              <!-- 全面クリック（詳細へ） -->
              <article v-for="it in relatedJobs" :key="it.id" class="card clickable related-job-card">
                <a href="#" class="stretched-link" aria-label="求人詳細へ" @click.prevent.stop="onOpenJob(it)"></a>

              <div class="job-list-item__data">
                <div>
                  <span class="job-list-item__data--begins">募集開始：{{ formatDate(it.published_date) }}</span>
                  <span class="job-list-item__data--view">
                    <span class="ico">
                      <img src="/src/assets/images/jobs/ico-view.svg">
                    </span>
                    {{ it.view_count == null ? 0 : it.view_count }}
                  </span>
                </div>
              </div>

              <div class="job-list-item__title">{{ it.title }}</div>

              <!-- メリット -->
              <div class="job-list-item__merit">
                <ul  v-if="Array.isArray(it.merits) && it.merits.length">
                  <li v-for="(m,i) in it.merits" :key="i">{{ m }}</li>
                </ul>
              </div>

              <!-- メイン -->
              <div class="job-list-item__summary flex">
                <div class="job-list-item__tmb">
                  <!-- <img :src="imageUrl(it.image_1 || it.image_2 || it.image_3 || it.image_4)" @error="onImgError" alt=""> -->
                  <img :src="imageUrl(it.image_1 || it.image_2 || it.image_3 || it.image_4, it.id)" @error="onImgError" alt="">
                </div>
                <div class="job-list-item__txtwrap">
                  <div class="job-list-item__companyname">{{ it.facility_name }}</div>
                  <div class="job-list-item__jobtype">
                    <ul>
                      <li>
                        <span class="job-list-item__jobtype--full">{{ it.employment_type_name }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- 住所 -->
                  <div class="job-list-item__note flex">
                    <div class="job-list-item__location">
                      <span class="ico">
                        <img src="/src/assets/images/jobs/ico-location.svg" alt="エリア">
                      </span>
                      {{ it.city }}
                    </div>

                    <!-- 給与 -->
                    <div class="job-list-item__salary">
                      <span class="ico">
                        <img src="/src/assets/images/jobs/ico-fee.svg" alt="給与">
                      </span>
                      {{ salaryLabel(it.base_salary_type, it.base_salary_min, it.base_salary_max) }}
                    </div>
                  </div>
                </div>

                <div class="job-list-item__licence">
                  <span v-if="certImgSrc">
                    <img :src="certImgSrc" alt="認証" />
                  </span>
                </div>
              </div>

            </article>
          </section>


          <!-- 求人リンク -->
          <!-- <section class="news-link">
            <router-link :to="{ name: 'Jobs' }" class="link">
              ふくしまちケアホームの求人情報
            </router-link>
          </section> -->

          <!-- 戻るボタン -->
          <div class="btn-back">
            <a href="#" @click="$router.back()">
              <span class="ico"><img src="/src/assets/images/common/ico-back.svg"></span>
              戻る
            </a>
          </div>
        </div>
      </section>

        <!-- ✅ 未ログイン時の登録促し -->
        <div
          v-if="showAuthToast"
          class="apm-overlay"
          @click.self="showAuthToast = false"
        >
          <div class="apm-modal" role="dialog" aria-modal="true" aria-labelledby="apm-title">
            <h3 id="apm-title" class="apm-title">マイページ登録しませんか？</h3>

            <button class="apm-cta" @click="router.push({ name: 'RegisterChoice' })">
              登録
            </button>

            <p class="apm-text">
              求人情報の詳細が閲覧できる他、介護施設へのメッセージ送信や
              気になる求人を保存することができます。
            </p>
            <p class="apm-text">ぜひ積極的にこのサイトをご活用ください！</p>
          </div>
        </div>

          <!-- 画像拡大ビュー（ライトボックス） -->
          <div
            v-if="viewerOpen"
            class="image-viewer"
            @click.self="closeViewer"
          >
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
  <PcModel />
</template>




<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter  } from 'vue-router'
import { http } from '@/api/http'
// import JobCard from '@/components/jobs/JobCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
import DOMPurify from 'dompurify' // npm i dompurify
import { setCanonical, setTitle, setMetaDescription } from '@/lib/seo'

const SITE_NAME = 'ふくしまち'
const MAX_DESC = 120

function stripHtml (s = '') {
  return String(s)
    .replace(/<[^>]*>/g, ' ')     // タグ除去
    .replace(/\s+/g, ' ')         // 連続空白
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function buildDescriptionFromAnnouncement (a) {
  // 本文候補（あなたのAPIのフィールド名に合わせて増やしてOK）
  const body =
    a?.body ??
    a?.content ??
    a?.description ??
    a?.text ??
    ''

  const title = a?.title ?? ''
  const text = stripHtml(body)

  // タイトル＋本文の冒頭で 110〜130字程度
  const base = [title, text].filter(Boolean).join('｜')
  if (!base) return 'ふくしまちからのお知らせ詳細です。'
  return base.length > MAX_DESC ? base.slice(0, MAX_DESC - 1) + '…' : base
}

function applySeoForAnnouncement (id, a) {
  const origin = window.location.origin
  const canonical = `${origin}/news/${id}`

  // title
  const pageTitle = a?.title ? `${a.title} | ${SITE_NAME}` : `お知らせ詳細 | ${SITE_NAME}`
  setTitle(pageTitle)

  // description（タイトル・本文から作る）
  const desc = buildDescriptionFromAnnouncement(a)
  setMetaDescription(desc)

  // canonical
  setCanonical(canonical)
}

const safeBodyHtml = computed(() => {
  const raw = String(ann.value.body || '')
  const sanitized = DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } })

  // http(s) リンクの <a> に target="_blank" rel="noopener" を付与する
  return sanitized.replace(
    /<a([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi,
    (match, before, href, after) => {
      const attrs = (before + after)

      // すでに target が付いている場合
      if (/target\s*=/.test(attrs)) {
        // rel がなければ rel="noopener" だけ追加
        if (!/rel\s*=/.test(attrs)) {
          return match.replace(/>$/, ' rel="noopener">')
        }
        return match
      }

      // target が無い場合は付ける
      return `<a${before}href="${href}"${after} target="_blank" rel="noopener">`
    }
  )
})

 const router = useRouter()
 const showAuthToast = ref(false)

 function onOpenJob(it){
   const uid = getUserId()
   if (!uid) {
     showAuthToast.value = true   // ← 未ログインならモーダル表示
     return
   }
   router.push({ name: 'JobDetail', params: { id: it.id } })
 }

/* ===== 定数 ===== */
const API_BASE = '/announcements'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const API_ORIGIN = (() => {
  try { return new URL(API_BASE_URL, window.location.origin).origin } catch { return window.location.origin }
})()
const JOBS_API = '/jobs'
// const BUSINESS_PROFILE_API = '/business/profile'

/* ===== ルータ ===== */
const route = useRoute()
// const id = Number(route.params.id)
const newsId = computed(() => Number(route.params.id))

/* ===== 状態 ===== */
// const ann = ref({ title:'', category_id:null, category_name:'', body:'', published_at:'', job_information_id: null })
const ann = ref({
  title: '',
  category_id: null,
  category_name: '',
  body: '',
  published_at: '',
  job_information_id: null,
  business_profile_id: null,
  view_count: 0,
  user_id: null,
  button_label: '',
  button_url: '',
})
const images = ref([])      // { url }
const summaries = ref([])   // { heading, content }
const current = ref(0)
let timer = null

const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openViewer(idx) {
  viewerIndex.value = idx ?? 0
  viewerOpen.value = true
  // スライド自動再生を止めたい場合だけ
  stopAuto()
}

function closeViewer() {
  viewerOpen.value = false
  // 自動再生を再開したい場合だけ
  startAuto()
}


/* ===== 表示ヘルパー ===== */
const dateText = computed(() => formatDate(ann.value.published_at))
const categoryText = computed(() => ann.value.category_name || ann.value.category?.name || '')
// 施設名の状態と表示用テキスト
const facilityName = ref('')
const facilityText = computed(() => facilityName.value || '')

const relatedJobs = ref([])
const isFeature = computed(() => Number(ann.value.category_id) === 4)

async function loadRelatedJobs () {
  const cat = Number(ann.value.category_id)
  const jid = Number(ann.value.job_information_id)
  console.log('[related] start', { cat, jid })

  // 特集以外 or jobIdなしはスキップ
  if (cat !== 4 || !jid) {
    console.log('[related] skip: not feature or no job id')
    relatedJobs.value = []
    return
  }

  try {
    // 新規APIで取得（同一施設の公開中、現在の求人を除外）
    const res = await http.get(`${JOBS_API}/related`, {
      params: { job_id: jid, perPage: 6 }
    })
    console.log('jid:',jid)
    const items = Array.isArray(res?.data?.items) ? res.data.items : []
    console.log('[related] list fetched', { count: items.length })
    relatedJobs.value = items
  } catch (e) {
    console.error('[related-jobs] failed:', e)
    relatedJobs.value = []
  }
}

// 求人詳細→施設名を取り出す
// async function getFacilityNameFromJobId(jobId) {
//   try {
//     const { data } = await http.get(`${JOBS_API}/${jobId}`)
//     const job = data?.item || data
//     let name =
//       job?.facility_name || ''

//     return name
//   } catch (e) {
//     if (import.meta.env.DEV) console.debug('[jobs/:id] failed', e?.message)
//     return ''
//   }
// }

 // 事業所IDから事業所名を取得（APIがある前提。なければ後述のどちらかを実装）
 async function getBusinessNameFromProfileId(userId) {
  const id = Number(userId) || 0
    if (id <= 0) return ''
    try {
      const { data } = await http.get(`/business/profile/${id}`)
      const name = data?.profile?.business_name || ''
      console.log('[business/profile/:userId] ok', id, name)
      return name
    } catch (e) {
      console.warn('[business/profile/:userId] fail', {
        id, status: e?.response?.status, msg: e?.message
      })
      return ''
    }
  }

 // 閲覧記録（view_count 加算）
async function recordAnnouncementView(announcementId) {
  try {
    await http.post(`${API_BASE}/${announcementId}/view`)
  } catch (e) {
    if (import.meta.env.DEV) console.debug('[announcement:view] skipped:', e?.message)
  }
}


/* ===== マウント ===== */
 async function reloadAll () {
   await loadDetail()        // ann を更新（←この中でSEOも更新する）
   await loadRelatedJobs()
   startAuto()
   await recordAnnouncementView(newsId.value)
 }

 onMounted(reloadAll)

onBeforeUnmount(() => stopAuto())

/* ===== データ取得 ===== */
/* API側announcements.js お知らせ詳細から取得*/
async function loadDetail () {
  try {
    // const { data } = await http.get(`${API_BASE}/${id}`)
    const { data } = await http.get(`${API_BASE}/${newsId.value}`)
    ann.value = {
      title: data.title || '',
      category_id: Number(data.category_id ?? data.category?.id ?? 0),
      category_name: data.category_name || data.category?.name || '',
      body: data.body || '',
      published_at: data.published_at || data.created_at || '',
      job_information_id: Number(data.job_information_id ?? 0),
      business_profile_id: Number(data.business_profile_id ?? 0),
      view_count: data.view_count ?? 0,
      user_id: data.user_id ?? null,
      button_label: data.button_label || '',
      button_url: data.button_url || '',
    }
     // ✅ SEOを「タイトル・本文からdescription生成」のルールで反映
    applySeoForAnnouncement(newsId.value, ann.value)

    console.log('作成者の category_id:', ann.value.category_id)
    console.log('作成者の ann.value.job_information_id:',ann.value.job_information_id)
    console.log('作成者の user_id:', ann.value.user_id)
    console.log('作成者の business_profile_id:', ann.value.business_profile_id)
    // job_information_id → /jobs/:id から取得
    // if (!facilityName.value && Number(ann.value.job_information_id)) {
    //   facilityName.value = await getFacilityNameFromJobId(ann.value.job_information_id)
    // }
    // 新：事業所名を優先
    facilityName.value =
        data.business_name
      || (await getBusinessNameFromProfileId(ann.value.business_profile_id))
      || ''

    images.value = (data.images || []).slice(0, 4).map(it => {
      const p = it.image_path || it.url || ''
      return { url: resolveUrl(p),isPortrait: false, }
    })
    summaries.value = (data.summaries || data.summary || []).map(s => ({
      heading: s.heading || '',
      content: s.content || ''
    }))
    current.value = 0

    if (Number(ann.value.category_id) === 4) {
      await recordFeatureView(newsId.value)
    }
  } catch (e) {
    console.error('[news:detail] failed', e)
  }
}

watch(
  () => route.params.id,
  async () => {
    stopAuto()
    current.value = 0
    await reloadAll()
  }
)

// カテゴリー=5（施設から）判定
const isFromFacility = computed(() => Number(ann.value.category_id) === 5)
console.log('ann.value?.category_id:',ann.value.category_id)

// 遷移先（施設の求人一覧）
// ※クエリキーはAPI側の受け口に合わせてください（例: facility_user_id / information_id）
// const facilityJobsTo = computed(() => ({
//   name: 'Jobs',
//   // 既存の一覧がこれらのキーでフィルタできる想定
//   query: {
//     facility_user_id: ann.value.user_id,          // 施設の userId
//     // information_id: ann.value.job_information_id, // information.id
//     view: 'all',                                   // 任意（一覧の通常表示）
//   },
// }))
// console.log('ann.value.user_id:',ann.value.user_id)

/* ===== 特集閲覧の記録 ===== */
function getUserId () {
  try {
    const cands = [
      // localStorage.getItem('auth_user'),
      // sessionStorage.getItem('auth_user'),
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
      } catch {console.log}
    }
  } catch {console.log}
  return 0
}
function getRole () {
  const raw = (localStorage.getItem('userType') || '').trim().toLowerCase()
  return ['employer','business','facility','2','事業者'].includes(raw) ? 'employer' : 'seeker'
}

async function recordFeatureView (announcementId) {
  const uid = getUserId()
  console.log('uid:',uid)
  if (!uid) return
  try {
    await http.post(
      `${API_BASE}/${announcementId}/view`,
      { user_id: uid, role: getRole() },
      { withCredentials: true, headers: { 'x-user-id': String(uid) } }
    )
  } catch (e) {
    // 失敗しても画面はそのまま進める
    if (import.meta.env.DEV) console.debug('[feature:view] skipped:', e?.message)
  }
}

/* ===== スライダー ===== */
function startAuto () { stopAuto(); if (images.value.length <= 1) return; timer = setInterval(next, 8000) }
function stopAuto () { if (timer) { clearInterval(timer); timer = null } }
function next () { current.value = (current.value + 1) % images.value.length }

/* ===== util ===== */
function resolveUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  const rel = p.startsWith('/') ? p : `/${p}`
  return new URL(rel, API_ORIGIN).toString()
}
function formatDate (iso) {
  if (!iso) return ''
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), da = String(d.getDate()).padStart(2,'0')
  return `${y}.${m}.${da}`
}

const relatedTitle = computed(() =>
  facilityText.value
    ? `${facilityText.value} の求人情報`
    : 'この施設の求人情報'
)

function onImgLoad(event, img) {
  const el = event.target
  if (!el || !el.naturalWidth || !el.naturalHeight) return

  const isPortrait = el.naturalHeight > el.naturalWidth
  img.isPortrait = isPortrait
}

const formatMoney = (v) => (v==null||v===''||Number.isNaN(Number(v))) ? '-' : Number(v).toLocaleString('ja-JP')
function salaryLabel (type, min, max) {
  const prefix = type === 'hourly' ? '時給 ' : type === 'monthly' ? '月給 ' : ''
  const minStr = formatMoney(min)
  const hasMax = max != null && max !== '' && !Number.isNaN(Number(max))
  const maxStr = hasMax ? `〜${formatMoney(max)}` : ''
  return `${prefix}${minStr}${maxStr}`
}

// ===== JobCardと同じ思想のURL正規化 =====
const strip = (s='') => String(s).replace(/^\/+|\/+$/g, '')

const origin = computed(() => {
  const b = String(import.meta.env.VITE_PUBLIC_BASE_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/,'')
  // VITE_* 未設定なら現在オリジン
  if (!b) return typeof window !== 'undefined' ? window.location.origin : ''
  // /api が付いていたら外す
  try { return new URL(b.replace(/\/api$/,''), window.location.origin).origin } catch { return window.location.origin }
})

// 保存先は /uploads/images/jobs を正とする
const IMAGE_BASE = computed(() => `${origin.value}/uploads/images/jobs`)
console.log('IMAGE_BASE:',IMAGE_BASE)
/** 任意の入力を最終的に /uploads/images/jobs/:id/:file へ正規化 */
function imageUrl(p, idForFallback) {
  // if (!p) return fallback
  if (!p) return ''
  const raw = String(p).trim()

  // すでに絶対 or data/blob
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw

  // 先頭スラ有無を吸収
  const s = raw.startsWith('/') ? raw : `/${raw}`

  // 既に正ルート
  if (/^\/uploads\/images\/jobs\//i.test(s)) return `${origin.value}${s}`

  // /upload/jobs/* → /uploads/images/jobs/*
  if (/^\/upload\/jobs\//i.test(s))  return `${origin.value}${s.replace(/^\/upload\/jobs\//i,  '/uploads/images/jobs/')}`

  // /uploads/jobs/* → /uploads/images/jobs/*
  if (/^\/uploads\/jobs\//i.test(s)) return `${origin.value}${s.replace(/^\/uploads\/jobs\//i, '/uploads/images/jobs/')}`

  // 相対のバラつきを正規化
  let rel = strip(raw)
  rel = rel
    .replace(/^uploads\/(?:images\/)?jobs\/+/i, '') // 先行ルート除去
    .replace(/^images\/+/i, '')
    .replace(/^jobs\/+/i, '')

  // ✅ ここが抜けていた： "31/xxx.jpg" 形式は、その数値IDをそのまま使う
  const m = rel.match(/^(\d{1,10})\/(.+)$/)
  if (m) {
    return `${IMAGE_BASE.value}/${m[1]}/${m[2]}`
  }

  // それ以外はフォールバックIDがあれば使う
  const id = Number(idForFallback ?? 0)
  if (id > 0) return `${IMAGE_BASE.value}/${id}/${rel}`
  return ''
}

</script>

<style scoped>
.news-detail { padding: 18px 0 36px; }
.inner { max-width: 920px; margin: 0 auto; padding: 0 16px; }

.title { font-size: 24px; line-height: 1.4; font-weight: 800; margin: 4px 0 6px; }
.meta { color:#6b7280; font-size: 13px; margin-bottom: 14px; }
.meta .sep { margin: 0 6px; color:#9ca3af; }

/* スライダー */
.slider{ margin-bottom: 18px; }
.slides{ position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px; overflow: hidden; }
.slide{
  position:absolute; inset:0; opacity:0; transition: opacity .6s ease;
  background:#f3f4f6; display:flex; align-items:center; justify-content:center;
}
.slide.is-active{ opacity:1; }
.slide img{ width:100%; height:100%; object-fit:cover; display:block; object-position:center center; }

.thumbs{ display:flex; gap:10px; margin-top: 10px; flex-wrap: wrap; }
.thumb{
  width: 160px; height: 100px; border: 2px solid transparent; border-radius: 10px; overflow: hidden; cursor: pointer; background:#fff;
}
.thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
.thumb.is-active{ border-color:#60a5fa; }

/* 縦長画像だけは「上端」を基準にトリミング */
.slide.is-portrait img{
  object-position: top center;    /* ★ 上端基準に変更 */
}

/* 本文 */
.body{ margin: 18px 0; }
.text{ white-space: pre-wrap; line-height: 1.9; color:#111827; word-wrap: break-word; overflow-wrap: anywhere;}

/* 概要 */
.summaries{ margin: 20px 0; }
.sum{ padding: 16px 0; border-bottom: 1px solid #e5e7eb; }
.sum-head{ font-weight: 800; margin: 0 0 6px; }
.sum-body{ white-space: pre-wrap; line-height: 1.9; }

/* 求人リンク */
.jobs-link{ margin: 22px 0; }
.jobs-link .link{ color:#0ea5e9; text-decoration: underline; font-weight: 700; }

/* 戻る */
.actions{ margin-top: 26px; }

/* 本文中の画像：角丸＋上下マージン */
.body :deep(img) {
  border-radius: 12px;   /* 角丸 */
  display: block;
  max-width: 100%;
  height: auto;
  overflow: hidden;
  margin: 16px 0;        /* ← ここで上下の余白を追加 */
}

/* ★本文中のリンク（URL）が分かるように下線＆色を付ける */
.body :deep(a) {
  color: #0ea5e9;              /* サイトのアクセントカラーに合わせて調整 */
  text-decoration: underline;  /* 下線 */
  text-underline-offset: 2px;  /* 少し離して見やすく */
}

.body :deep(a:hover) {
  filter: brightness(0.9);     /* ホバー時に少しだけ濃く */
}

.view-counter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
  margin-right: 20px;
  margin-bottom: -15px;
}



/* .facility-jobs-link{
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 14px;
  background:#f3f4f6; color:#111827; font-weight:800;
  border-radius:999px; text-decoration:none;
  box-shadow:0 6px 16px rgba(0,0,0,.06);
} */
.facility-jobs-link:hover{ filter:brightness(1.02); }
.facility-jobs-link .arr{ font-size:18px; line-height:1; }

/* ▼ ボタン：水色背景・白文字 */
.facility-jobs-link{
  font-size:18px;
  line-height:1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #42b2e6;          /* 水色 */
  color: #fff;                   /* 文字は白 */
  border: none;                  /* 枠線なし */
  border-radius: 999px;
  padding: 10px 40px;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0,0,0,.08);
  transition: transform .05s ease, filter .15s ease;
}
.btn-edit:hover{ filter: brightness(1.05); }
.btn-edit:active{ transform: translateY(1px); }
.btn-edit:focus-visible{
  outline: 3px solid rgba(94,194,255,.45);
  outline-offset: 2px;
}

/* カード基本 */
/* =========================
   カード（全体）
   ========================= */
.card{
  position:relative;
  background:#fff;
  border:1px solid #e5e7eb;
  border-radius:16px;
  padding:12px 12px 16px;
  margin:16px 0;
  box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.clickable{ cursor:pointer; }

/* 全面クリック用リンクは下に、ボタンは前面に */
.stretched-link{ position:absolute; inset:0; z-index:1; border-radius:16px; }
.card :where(button,.actbar,.ico-btn,a:not(.stretched-link),input,select){ position:relative; z-index:2; }

/* =========================
   1行目：募集開始日・閲覧数
   ========================= */
.card-head{
  display:flex; align-items:center; justify-content:flex-start;
  gap:16px; color:#6b7280; font-size:13px; line-height:1;
  margin-bottom:8px;
}
.card-head .dt{ font-weight:700; }
.card-head .dt::before{ content:"募集開始："; font-weight:600; color:#6b7280; }
.card-head .meta{ display:flex; align-items:center; gap:6px; }


/* =========================
   2行目：タイトル
   ========================= */
.job-title{
  font-size:22px; line-height:1.35;
  font-weight:800; color:#111827;
  margin:2px 2px 8px;
}

/* =========================
   3行目：メリット（灰丸チップ）
   ========================= */
.merits{
  display:flex; flex-wrap:wrap; gap:8px 8px;
  margin:0 2px 10px; padding:0; list-style:none;
}
.merits li{
  background:#efefef; color:#374151;
  font-size:12px; font-weight:700;
  padding:6px 10px; border-radius:999px;
}

/* =========================
   レスポンシブ
   ========================= */
@media (max-width: 720px){
  .body{ grid-template-columns: 1fr; }
  .job-card__licence{ order: 3; justify-content:flex-start; margin-top:8px; }
  .thumb img{ height:180px; }
}

/* スマホ時：固定ヘッダーぶんの余白を上に付ける */
@media (max-width: 768px){
  .news-detail{
    padding-top: calc(18px + 72px); /* 既存の上パディング18px + ヘッダー高さぶん */
  }
  .news-title{
    margin-top: 0; /* 念のため上余白を詰める */
  }
}

/* 説明テキスト */
.apm-text{ margin:0 0 14px; text-align:center; line-height:1.9; color:#333; }
/* ===== Auth Prompt Modal ===== */
.apm-overlay{
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.70);
  z-index: 2000;
}
.apm-modal{
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 18px;
  padding: 24px 22px 20px;
  box-shadow: 0 24px 60px rgba(0,0,0,.30);
}
.apm-title{
  margin: 4px 0 14px;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}
.apm-cta{
  display: flex;                /* ← 中央寄せの土台 */
  align-items: center;          /* ← 垂直中央 */
  justify-content: center;      /* ← 水平中央 */

  width: 180px;
  height: 44px;                 /* 固定高で丸ボタンに */
  margin: 0 auto 16px;
  padding: 0 16px;              /* 上下は0にして高さで管理 */
  border: none;
  border-radius: 999px;

  font-size: 16px;
  font-weight: 800;
  line-height: 1;               /* フォントの余白でズレないように */
  letter-spacing: .02em;

  background: #FF8F70;          /* お好みの色に */
  color: #fff;
  cursor: pointer;
}
.apm-cta:hover { filter: brightness(1.05); }
.apm-cta:focus { outline: 3px solid rgba(37,99,235,.35); outline-offset: 2px; }

/* ✅ 特集ページかつ figure.ann-img にだけ適用 */
.news-detail.is-feature .body :deep(figure.ann-img){
  margin: -60px 0 !important;          /* 図全体の上下を詰める */
}

.news-detail.is-feature .body :deep(figure.ann-img img){
  /* 画像自体の余白は 0（親 figure にだけマージンを持たせる） */
  margin: 0 !important;
  border-radius: 12px;                /* 角丸は維持（必要なければ削除） */
  display: block;
  max-width: 100%;
  height: auto;
}

.news-detail.is-feature .body :deep(figure.ann-img figcaption){
  margin-top: -50px;                    /* キャプションとの間も少しだけ */
  font-size: 1rem;
  color: #111827;
  line-height: 1.5;
}

/* 特集（category_id = 4）本文中の h2 専用 */
.news-detail.is-feature .body :deep(h2){
  font-size: 20px;           /* お好みで */
  line-height: 1.4;
  font-weight: 700;
  color: #111827;
  margin: 0px -5px -5px;       /* ここで上下マージンを調整 */
  /* padding-left: 10px;        デザイン例：左ライン */
  /* border-left: 4px solid #6366f1; */
}

/* 見出し直後の段落の余白を少し詰めたい場合 */
.news-detail.is-feature .body :deep(h2 + p){
  margin-top: 6px;
}

/* 先頭が h2 のときだけ上マージンをさらに詰める例 */
.news-detail.is-feature .body :deep(.text > h2:first-child){
  margin-top: 6px;
}

/* CTAボタン */
.news-cta{
  margin: 24px 0;
  text-align: center;
}
.news-cta__btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
}

.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100; /* apm-overlay(2000) より前面に */
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

</style>
