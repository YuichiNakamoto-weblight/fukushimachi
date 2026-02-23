<!-- src/views/jobs/JobDetailPage.vue -->
<!-- 求人情報詳細ページ -->
<template>
  <body class="is-employer is-login">
    <div class="wrap">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main class="l-sec" v-if="item">
        <div class="job-detail">
          <div class="inner">

            <!-- ヘッダー -->
              <div class="job-item__data">
                <span class="job-item__data--begins">募集開始：{{ formatDate(item.published_date) }}</span>
                <span class="job-item__data--view">
                  <span class="ico">
                    <img src="/src/assets/images/jobs/ico-view.svg">
                  </span>
                  {{ item.view_count ?? 0 }}
                </span>
              </div>

              <div class="status__items" v-if="!isEmployer">
                <div class="status__clip">
                  <!-- 未開始=muted / 開始=active -->
                  <button class="js-modal-trigger" :class="{ active: clipped, muted: !clipped }" @click="toggleClip">
                    <img src="/src/assets/images/common/ico-clip.svg" />
                  </button>
                </div>
                <div class="status__good">
                  <button class="js-modal-trigger" :class="{ active: gooded,  muted: !gooded }" @click="toggleGood">
                    <img src="/src/assets/images/common/ico-good.svg" />
                  </button>
                </div>
                <div class="status__talk">
                  <button class="js-modal-trigger" :class="{ active: talked,  muted: !talked }" @click="openTalk">
                    <img src="/src/assets/images/common/ico-talk.svg" />
                  </button>
                </div>
              </div>

              <div class="job-item__facilitytype">{{ item.business_name }}</div>
              <div class="job-item__title">{{ item.title }}</div>

              <div class="job-item__summary flex">
                <div class="job-item__txtwrap">
                  <div class="job-item__facilityname">{{ item.facility_name }}</div>
                    <div class="job-item__location">{{ fullAddress }}</div>
                    <div class="job-item__jobtype">
                      <span v-if="item.employment_type_name" class="job-item__jobtype--full">
                        {{ item.employment_type_name }}
                      </span>
                    </div>
                </div>
  <!-- ★ 右側に固定する認証マーク（兄弟要素） -->
  <div class="job-item__badge" v-if="certImgSrc">
    <img :src="certImgSrc" alt="認証マーク" />
    <div class="job-item__badge-caption" v-if="item.certification_name">
      <!-- {{ item.certification_name }} -->
    </div>
  </div>
              </div>

            <!-- 画像（最大4、先頭は大） -->
            <section class="gallery" v-if="images.length">
              <div class="main">
                <img :src="images[current]" @error="onImgError" alt="" />
              </div>
              <div class="thumbs">
                <button v-for="(src,i) in images" :key="i"
                        :class="['th', {active:i===current}]"
                        @click="setSlide(i)">
                  <img :src="src" @error="onImgError" alt="" />
                </button>
              </div>
            </section>

            <!-- メリット / PR -->
            <section v-if="item.merits?.length || item.pr_message" class="job-item__merit">
              <ul v-if="item.merits?.length" class="flex">
                <li v-for="(m,i) in item.merits" :key="i">{{ m }}</li>
              </ul>
              <p v-if="item.pr_message" class="job-item__pr" v-text="item.pr_message" />
            </section>


            <div class="action-items flex" v-if="!isEmployer">
            <!-- クリップ -->
            <div class="action-item action-item-clip" :class="{ 'is-active': clipped }">
              <div
                class="js-modal-trigger"
                aria-controls="modal-clip"
                role="button"
                tabindex="0"
                :aria-pressed="clipped ? 'true' : 'false'"
                aria-label="クリップ"
                @click.stop.prevent="toggleClip"
                @keydown.enter.stop.prevent="toggleClip"
                @keydown.space.stop.prevent="toggleClip"
              >
                <div class="icon">
                  <img src="/src/assets/images/common/ico-clip.svg" alt="">
                </div>
                <div class="icon-txt">
                  <img src="/src/assets/images/common/ico-clip-txt.svg" alt="クリップ">
                </div>
              </div>
            </div>

            <!-- グッド -->
            <div class="action-item action-item-good" :class="{ 'is-active': gooded }">
              <div
                class="js-modal-trigger"
                aria-controls="modal-good"
                role="button"
                tabindex="0"
                :aria-pressed="gooded ? 'true' : 'false'"
                aria-label="グッド"
                @click.stop.prevent="toggleGood"
                @keydown.enter.stop.prevent="toggleGood"
                @keydown.space.stop.prevent="toggleGood"
              >
                <div class="icon">
                  <img src="/src/assets/images/common/ico-good.svg" alt="">
                </div>
                <div class="icon-txt">
                  <img src="/src/assets/images/common/ico-good-txt.svg" alt="グッド">
                </div>
              </div>
            </div>



              <!-- トーク -->
              <div class="action-item action-item-talk" :class="{ 'is-active': talked }">
                <a
                  href="../talk/id000.php"
                  role="button"
                  tabindex="0"
                  @click.prevent="openTalk"
                  @keydown.enter.prevent="openTalk"
                  @keydown.space.prevent="openTalk"
                >
                  <div class="icon">
                    <img src="/src/assets/images/common/ico-talk.svg" alt="">
                  </div>
                  <div class="icon-txt">
                    <img src="/src/assets/images/common/ico-talk-txt.svg" alt="トーク">
                  </div>
                </a>
              </div>
            </div>


            <!-- 募集内容 -->
            <section class="job-item__detail">
              <div class="job-item__detail-title sec-title">募集内容</div>
              <dl class="table">
                <dt>施設形態</dt><dd>{{ serviceTypeDisplay }}</dd>
                <dt>募集職種</dt><dd>{{ jobPositionDisplay }}</dd>
                <dt>学歴</dt><dd>{{ item.education_level_name || '-' }}</dd>
                <dt>基本給</dt>
                <dd>{{ salaryLabel(item.base_salary_type, item.base_salary_min, item.base_salary_max) }}円</dd>
                <dt>処遇改善手当</dt>
                <!-- <dd>{{ formatAllowance(item.treatment_allowance) }}</dd> -->
                <dd>{{ allowanceWithUnit(item.treatment_allowance) }}</dd>
                <dt>昇給</dt><dd>{{ item.raise_text || '-' }}</dd>
                <dt>賞与</dt><dd>{{ item.bonus_text || '-' }}</dd>
                <dt>休日</dt><dd>{{ item.holidays_text || '-' }}</dd>
                <dt>保険加入</dt><dd>{{ item.insurance_text || '-' }}</dd>
                <dt>募集人数</dt><dd>{{ item.headcount ?? '-' }}</dd>
                <dt>シフト</dt><dd>{{ item.shift_text || '-' }}</dd>
                <dt>勤務形態</dt><dd>{{ item.employment_type_name || '-' }}</dd>
              </dl>
            </section>

            <!-- 施設情報 -->
            <section class="job-item__detail">
              <div class="job-item__detail-title sec-title">施設情報</div>
              <dl class="table">
                <dt>施設名</dt><dd>{{ item.facility_name || '-' }}</dd>
                <dt>所在地</dt><dd>{{ fullAddress }}</dd>
                <dt>担当</dt><dd>{{ item.contact_full_name || (item.contact_last_name || '') + (item.contact_first_name || '') || '-' }}</dd>
              </dl>

              <div class="map">
                <iframe
                  :src="mapSrc"
                  width="100%" height="320" style="border:0" loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen>
                </iframe>
              </div>

              <!-- クリップ・グッド・トーク ※事業者は非表示 -->
              <div class="action-items flex" v-if="!isEmployer">
                <!-- クリップ -->
                <div class="action-item action-item-clip" :class="{ 'is-active': clipped }">
                  <div
                    class="js-modal-trigger"
                    aria-controls="modal-clip"
                    role="button"
                    tabindex="0"
                    :aria-pressed="clipped ? 'true' : 'false'"
                    aria-label="クリップ"
                    @click.stop.prevent="toggleClip"
                    @keydown.enter.stop.prevent="toggleClip"
                    @keydown.space.stop.prevent="toggleClip"
                  >
                    <div class="icon">
                      <img src="/src/assets/images/common/ico-clip.svg" alt="">
                    </div>
                    <div class="icon-txt">
                      <img src="/src/assets/images/common/ico-clip-txt.svg" alt="クリップ">
                    </div>
                  </div>
                </div>

                <!-- グッド -->
                <div class="action-item action-item-good" :class="{ 'is-active': gooded }">
                  <div
                    class="js-modal-trigger"
                    aria-controls="modal-good"
                    role="button"
                    tabindex="0"
                    :aria-pressed="gooded ? 'true' : 'false'"
                    aria-label="グッド"
                    @click.stop.prevent="toggleGood"
                    @keydown.enter.stop.prevent="toggleGood"
                    @keydown.space.stop.prevent="toggleGood"
                  >
                    <div class="icon">
                      <img src="/src/assets/images/common/ico-good.svg" alt="">
                    </div>
                    <div class="icon-txt">
                      <img src="/src/assets/images/common/ico-good-txt.svg" alt="グッド">
                    </div>
                  </div>
                </div>

              <!-- トーク -->
              <div class="action-item action-item-talk">
                <a
                  href="../talk/id000.php"
                  role="button"
                  tabindex="0"
                  @click.prevent="openTalk"
                  @keydown.enter.prevent="openTalk"
                  @keydown.space.prevent="openTalk"
                >
                  <div class="icon">
                    <img src="/src/assets/images/common/ico-talk.svg" alt="">
                  </div>
                  <div class="icon-txt">
                    <img src="/src/assets/images/common/ico-talk-txt.svg" alt="トーク">
                  </div>
                </a>
              </div>
            </div>
            </section>

            <div class="related-link" v-if="items.length">
              <div class="related-link-title">関連する「特集」</div>
                <div class="topics-item">

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
            </div>

            <div class="btn-back">
              <a href="#" @click.prevent="goBack">
                <span class="ico"><img src="/src/assets/images/common/ico-back.svg" alt="" /></span>
                <span class="txt">戻る</span>
              </a>
            </div>

            <ToastModal v-model:open="toastOpen" :message="toastMsg" :auto-close-ms="1800" />
            <ConfirmGoodModal v-model:open="goodConfirmOpen" @confirm="confirmGood"/>
          </div>
        </div>
      </main>

      <section v-else class="loading">読み込み中…</section>

    </div>
      <AppFooter />

    </div>
  </body>
  <PcModel />
</template>




<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ToastModal from '@/components/common/ToastModal.vue'
import ConfirmGoodModal from '@/components/common/ConfirmGoodModal.vue'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
// import RelatedFacilityAnnouncements from '@/components/news/RelatedFacilityAnnouncements.vue'
// import OfficeAnnouncementsPanel from '@/components/news/OfficeAnnouncementsPanel.vue'
import PcModel from '@/components/layout/PcModel.vue'
import { setTitle, setMetaDescription, setCanonical } from '@/lib/seo'

/* ---------- helpers ---------- */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
const route = useRoute()
const router = useRouter()
// 関連特集
// const relatedFeatures = ref([])
const items = ref([])

const imageUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  const rel = p.startsWith('/') ? p : `/${p}`
  return `${ORIGIN}${rel}`
}

// 同じ job_information.id に紐づく特集（announcements.job_information_id）取得
const fetchRelatedFeatures = async (jobId, limit = 3) => {
  try {
    const { data } = await API.get(`/announcements/by-job/${jobId}`, { params: { limit } })
    items.value = Array.isArray(data?.items) ? data.items : []
    console.log('items.value:',items.value)
  } catch (e) {
    console.error('[related features] failed', e)
    items.value = []
  }
}
const RAW_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL
  ?? import.meta.env.VITE_API_BASE_URL
  ?? window.location.origin
const ORIGIN = String(RAW_BASE).replace(/\/+$/,'').replace(/\/api$/,'')
console.log('ORIGIN:',ORIGIN)
// /app 配下でも壊れない no-image
const fallback = `${import.meta.env.BASE_URL}stock-images/no-image.png`
// 画像保存先をここに統一
const IMAGE_BASE = `${ORIGIN}/uploads/images/jobs`

// 認証ユーザーID（求職者）
const userId = (() => {
  try {
    const raw = localStorage.getItem('userId')
    if (!raw) return 0
    if (raw.trim().startsWith('{')){
      const o = JSON.parse(raw)
      return Number(o?.id ?? o?.userId ?? o?.user?.id ?? 0) || 0
    }
    return Number(raw) || 0
  } catch { return 0 }
})()

const userTypeRef = ref((localStorage.getItem('userType') || '').toLowerCase())
const isEmployer = computed(() => userTypeRef.value === 'employer')

const SITE_NAME = 'ふくしまち'
const DEFAULT_DESC = '福島県の介護の就職・転職情報サイト「ふくしまち」。'

const stripTags = (s='') => String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
const truncate = (s='', n=140) => (s.length > n ? s.slice(0, n) + '…' : s)

const applyJobSeo = (job) => {
  // canonical（クエリやhashを付けない、/jobs/:id に固定）
  const origin = window.location.origin
  const id = job?.id || route.params.id
  if (id) setCanonical(`${origin}/jobs/${id}`)

  // title
  const titleCore = job?.title ? String(job.title).trim() : '求人詳細'
  const facility = job?.facility_name ? String(job.facility_name).trim() : ''
  const fullTitle = facility
    ? `${titleCore}（${facility}） | ${SITE_NAME}`
    : `${titleCore} | ${SITE_NAME}`
  setTitle(fullTitle)

  // description（PR → 仕事内容/説明 → デフォルト）
  const rawDesc =
    job?.pr_message ||
    job?.description ||
    job?.work_detail ||
    job?.catch_copy ||
    ''
  const desc = rawDesc ? truncate(stripTags(rawDesc), 140) : DEFAULT_DESC
  setMetaDescription(desc)
}

/* ---------- state ---------- */
const item = ref(null)
const images = ref([])           // 正規化後のURL配列
const current = ref(0)           // スライドインデックス
let timer = null

const toastOpen = ref(false)
const toastMsg  = ref('')
const showToast = (m) => { toastMsg.value = m; toastOpen.value = true }

/* ---------- formatters ---------- */
const formatDate = (s) => (s ? new Date(s).toLocaleDateString('ja-JP') : '')
const formatMoney = (v) => (v==null||v===''||Number.isNaN(Number(v)) ? '-' : Number(v).toLocaleString())
const salaryLabel = (type, min, max) => {
  const prefix = type === 'hourly' ? '時給 ' : type === 'monthly' ? '月給 ' : ''
  const minStr = formatMoney(min)
  const hasMax = max != null && max !== '' && !Number.isNaN(Number(max))
  const maxStr = hasMax ? `〜${formatMoney(max)}` : ''
  return `${prefix}${minStr}${maxStr}`
}

// 既存の formatAllowance を活かして、必要時だけ「円」を付ける
const allowanceWithUnit = (val) => {
  const f = formatAllowance(val); // '-' / '20,000' / '20,000〜30,000' / 任意テキスト
  if (f === '-') return f;
  // 数値（半角/全角）を含み、末尾が「円」「¥」で終わっていなければ付ける
  if (/[\d０-９]/.test(f) && !/[円¥]$/.test(f)) return `${f}円`;
  return f;
};


// 数値にカンマを付ける
const formatAllowance = (val) => {
  if (val == null || val === '') return '-'
  const s = String(val).trim()

  // ① 素の数値 or カンマ付き数値
  const num = s.replace(/,/g, '')
  if (/^-?\d+(\.\d+)?$/.test(num)) {
    return Number(num).toLocaleString('ja-JP')
  }

  // ② 範囲（20000〜30000 / 20000-30000 / 20,000〜30,000 など）
  const rm = num.match(/^(\d+)\s*[〜\-~]\s*(\d+)$/)
  if (rm) {
    const a = Number(rm[1]).toLocaleString('ja-JP')
    const b = Number(rm[2]).toLocaleString('ja-JP')
    return `${a}〜${b}`
  }

  // ③ それ以外はそのまま
  return s
}

const strip = (s='') => String(s).replace(/^\/+|\/+$/g, '')
/** 任意の表現を /uploads/images/jobs/:id/:file に正規化 */
const imageFrom = (jobId, p) => {
  if (!p) return ''
  const raw = String(p).trim()
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw

  // 既にルートが付いている場合は寄せる
  const s = raw.startsWith('/') ? raw : `/${raw}`
  if (/^\/uploads\/images\/jobs\//i.test(s)) return `${ORIGIN}${s}`
  if (/^\/upload\/jobs\//i.test(s))  return `${ORIGIN}${s.replace(/^\/upload\/jobs\//i,  '/uploads/images/jobs/')}`
  if (/^\/uploads\/jobs\//i.test(s)) return `${ORIGIN}${s.replace(/^\/uploads\/jobs\//i, '/uploads/images/jobs/')}`

  // 相対指定（"69/xxx.jpg" / "jobs/69/xxx.jpg" / "xxx.jpg"）
  let rel = strip(raw)
  rel = rel.replace(/^uploads\/(?:images\/)?jobs\/+/i, '')
           .replace(/^images\/+/i, '')
           .replace(/^jobs\/+/i, '')
  const m = rel.match(/^(\d{1,10})\/(.+)$/)
  const id   = m ? m[1] : jobId
  const file = m ? m[2] : rel
  return `${IMAGE_BASE}/${id}/${file}`
}
const onImgError = (e) => {
  const t = e?.target
  if (!t) return
  const src = t.getAttribute('src') || ''
  if (t.dataset.tried !== '1' && /\/uploads\/jobs\//i.test(src)) {
    t.dataset.tried = '1'
    t.src = src.replace(/\/uploads\/jobs\//i, '/uploads/images/jobs/')
    return
  }
  t.onerror = null
  t.src = fallback
}


// 末尾の <script setup> に追記（既存 import の下あたり）
// const textOrDash = (s) => (s && String(s).trim()) || '-'
const withOtherLabel = (baseName, otherText, idOr99) => {
  const name = String(baseName ?? '').trim()
  const other = String(otherText ?? '').trim()
  const isOther = String(idOr99 ?? '') === '99' || name === 'その他'
  if (isOther) return other ? `${name}：${other}` : name || '-'
  return name || '-'
}

// 施設形態（id=99 or name=その他 のとき自由記入を付ける）
const serviceTypeDisplay = computed(() =>
  withOtherLabel(
    item.value?.service_type_name,
    item.value?.service_type_other_text,   // ← APIが返してくれている自由記入
    item.value?.service_type_id
  )
)

// 募集職種（id=99 or name=その他 のとき自由記入を付ける）
const jobPositionDisplay = computed(() =>
  withOtherLabel(
    item.value?.job_position_name,
    item.value?.job_position_other_text,   // ← APIが返してくれている自由記入
    item.value?.job_position_id
  )
)


// 詳細データの入れ物
const detail = ref(null)

// ✅ 住所の結合（detail が null でも安全に）
const fullAddress = computed(() => {
  const d = detail.value ?? {}
  return [d.prefecture_name, d.city, d.address_line1, d.address_line2]
    .filter(Boolean)
    .join('')
})

const mapSrc = computed(() =>
  `https://www.google.com/maps?q=${encodeURIComponent(fullAddress.value)}&output=embed`
)
const clipped = ref(false)
const gooded  = ref(false)
const talked  = ref(false)

// バッジ更新の合図（同タブ & 他タブの両方に効く）
function pingBadges () {
  try { localStorage.setItem('badgePing', String(Date.now())) } catch {console.log()}
  try { window.dispatchEvent(new Event('badge:ping')) } catch {console.log()}
}

/* 認証マーク画像の解決 */
const CERT_IMAGE_MAP = (() => {
  const mods = import.meta.glob('/src/assets/images/common/*', {
    eager: true,
    import: 'default',
  })
  const map = {}
  for (const [p, url] of Object.entries(mods)) {
    const fname = p.split('/').pop().toLowerCase()
    map[fname] = url
  }
  return map
})()

const certImgSrc = computed(() => {
  const fname = String(item.value?.certification_image || '').trim()
  if (!fname) return ''
  const key = fname.split('/').pop().toLowerCase()
  return CERT_IMAGE_MAP[key] || ''
})


/* ---------- actions ---------- */
const fetchDetail = async () => {
  const id = route.params.id

  const { data } = await API.get(`/jobs/${id}`, { params: { user_id: userId } })
  const raw = data.item || data || {}

  let merits = []
  const mj = raw.merits_json ?? raw.merits
  if (Array.isArray(mj)) merits = mj.filter(Boolean)
  else if (typeof mj === 'string') {
    const s = mj.trim()
    if (s.startsWith('[')) { try { merits = JSON.parse(s) } catch { merits = [] } }
    else merits = s.split(',').map(v=>v.trim()).filter(Boolean)
  }

  // 画像フィールド抽出（image_1..image_4 or images配列）
  const jobId = raw.id
  const arr = []
  for (let i=1; i<=4; i++){
    const k = `image_${i}`
    if (raw[k]) arr.push(imageFrom(jobId, raw[k]))
    console.log('jobId:',jobId)
    console.log('raw:',raw)
  }
  if (!arr.length && Array.isArray(raw.images)) {
    raw.images.slice(0,4).forEach(p => arr.push(imageFrom(jobId, p)))
    console.log('raw.images',raw.images)
  }

  const normalized = {
    ...raw,
    // 処遇改善手当
    treatment_allowance:
      raw.treatment_allowance ??
      raw.treatment_improvement_allowance ??
      raw.improvement_allowance ??
      raw.allowance_treatment ??
      '',
    // 昇給
    raise_text:
      raw.raise_text ??
      raw.raise ??
      raw.salary_raise ??
      '',
    // 賞与
    bonus_text:
      raw.bonus_text ??
      raw.bonus ??
      '',
    // 休日
    holidays_text:
      raw.holidays_text ??
      raw.holiday_text ??
      raw.holidays ??
      '',
    // 保険加入
    insurance_text:
      raw.insurance_text ??
      raw.insurance ??
      '',
    // 募集人数
    headcount:
      raw.headcount ??
      raw.recruitment_number ??
      raw.recruit_number ??
      raw.recruitment ??
      null,
    // シフト名（マスタ結合して返している／いない両対応）
    shift_text:
      raw.shift_text ??
      raw.shift_name ??
      raw.shift ??
      '',
    // 勤務時間名（マスタ結合して返している／いない両対応）
    working_time_text:
      raw.working_time_text ??
      raw.work_time_name ??
      raw.work_time ??
      '',
  }

  item.value = {
    ...normalized,
    merits,
    pr_message: raw.pr_message || raw.description || '',
  }

  // ✅ 追加：SEO（title/description/canonical）を求人情報に合わせて上書き
  applyJobSeo(item.value)

  detail.value = item.value
  images.value = [...new Set(arr.filter(Boolean))].slice(0, 4)
  clipped.value = !!raw.clipped
  gooded.value  = !!raw.gooded
  talked.value  = !!(raw.has_talk_thread ?? raw.talked ?? raw.hasTalk)
  startAutoSlide()
  fetchRelatedFeatures(item.value.id, 3)
}

const startAutoSlide = () => {
  stopAutoSlide()
  if (images.value.length <= 1) return
  timer = setInterval(() => {
    current.value = (current.value + 1) % images.value.length
  }, 3000)
}
const stopAutoSlide = () => { if (timer) { clearInterval(timer); timer = null } }
const setSlide = (i) => { current.value = i; startAutoSlide() }

const ensureLogin = () => {
  if (!userId) {
    alert('この操作にはログインが必要です。')
    return false
    }
  return true
}
const goodConfirmOpen = ref(false)
const toggleClip = async () => {
  if (!ensureLogin()) return
  const id = item.value.id
  try {
    if (clipped.value) {
      await API.delete(`/jobs/${id}/clip`, { params: { user_id: userId } })
      clipped.value = false
      showToast('クリップを解除しました')
    } else {
      await API.post(`/jobs/${id}/clip`, { user_id: userId })
      clipped.value = true
      showToast('求人情報をクリップしました')
    }
  } catch (e) { console.error(e) }
}
const toggleGood = async () => {
  if (!ensureLogin()) return
  // すでにグッド済み → 取り消し
  if (gooded.value) {
    const id = item.value.id
    try {
      await API.delete(`/jobs/${id}/good`, { params: { user_id: userId } })
      gooded.value = false
      showToast('グッドを取り消しました')
      pingBadges()
    } catch (e) {
      console.error(e)
      showToast('通信エラーが発生しました')
    }
    return
  }
  // 未グッド → 確認モーダルを開く
  goodConfirmOpen.value = true
}

// 追加：モーダルの「グッドする」確定処理
const confirmGood = async () => {
  const id = item.value.id
  try {
    await API.post(`/jobs/${id}/good`, { user_id: userId, notify: 1 })
    gooded.value = true
    showToast('グッドしました')
    pingBadges()
  } catch (e) {
    console.error(e)
    showToast('通信エラーが発生しました')
  } finally {
    goodConfirmOpen.value = false
  }
}

const openTalk = async () => {
  if (!ensureLogin()) return
  try {
    const jobId = item.value.id
    const { data } = await API.post('/talks/start', {
      job_information_id: jobId,
      seeker_user_id: userId
    })
    const threadId = data?.threadId || data?.id
    if (!threadId) { showToast('トーク開始に失敗しました'); return }
    talked.value = true
    router.push({ name: 'SeekerTalk', params: { threadId } })
  } catch (e) {
    const code = e?.response?.data?.error
    if (code === 'job_not_found') {
      showToast('求人が見つかりません（非公開/削除の可能性）')
    } else if (code === 'business_profile_not_found') {
      showToast('施設情報が未設定のためトークを開始できません')
    } else {
      console.error(e)
      showToast('通信エラーが発生しました')
    }
  }
}

// const goBack = () => router.back()

/* ---------- lifecycle ---------- */
onMounted(fetchDetail)
onUnmounted(stopAutoSlide)

function goBack() {
  // 1) 明示的な戻り先（クエリ）を優先：?back=/jobs?view=closed など
  const back = route.query.back || route.query.from
  if (typeof back === 'string' && back) {
    router.push(back)
    return
  }

  // 2) アプリ内履歴があれば戻る
  //   - vue-router4 では history.state.back があれば直前ルートがある可能性が高い
  if (window.history.state && window.history.state.back) {
    router.back()
    return
  }
  if (window.history.length > 1) {
    router.back()
    return
  }

  // 3) フォールバック：一覧へ
  router.push({ name: 'Jobs' })
}

const headerH = ref(72) // 初期値は仮（端末により変わるので後で上書き）

function readHeaderMetrics () {
  // AppHeader のルート要素に合うセレクタにしてください
  const headerEl =
    document.querySelector('.app-header') ||
    document.querySelector('header') ||
    document.querySelector('[data-site-header]')

  if (!headerEl) return
  const rect = headerEl.getBoundingClientRect()
  headerH.value = Math.max(0, Math.round(rect.height))

  // CSS 変数へ反映（main の余白用）
  document.documentElement.style.setProperty('--header-height', `${headerH.value}px`)
}

onMounted(() => {
  readHeaderMetrics()
  // 回転やリサイズで高さが変わる場合に備えて
  window.addEventListener('resize', readHeaderMetrics, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', readHeaderMetrics)
})

watch(() => route.params.id, () => {
  fetchDetail()
})

</script>

<style scoped>
.job-detail{ max-width:900px; margin:0 auto; padding:20px 16px 40px; }
.loading{ padding:40px; text-align:center; color:#666; }

/* header */
.head .meta{ display:flex; gap:16px; color:#6b7280; font-size:13px; justify-content:flex-end; }
.head .actions{ display:flex; gap:8px; justify-content:flex-end; margin:8px 0 6px; }

.head .org{ margin:6px 0 4px; color:#374151; font-size:15px; }
.head .title{ margin:0 0 8px; font-weight:800; font-size:28px; line-height:1.3; }
.fac{ display:flex; justify-content:space-between; align-items:flex-end; gap:12px; margin-bottom:10px; }
.fac .facility{ font-size:18px; font-weight:700; }
.fac .addr{ color:#6b7280; font-size:14px; }
.badge{ background:#2563eb; color:#fff; font-size:12px; padding:4px 8px; border-radius:8px; }

/* gallery */
.gallery{ margin:14px 0 10px; }
.gallery .main img{
  width:100%; height:360px; object-fit:cover; border-radius:14px;
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}
.thumbs{ margin-top:10px; display:flex; gap:8px; }
.th{ width:120px; height:80px; border:2px solid transparent; border-radius:10px; overflow:hidden; padding:0; cursor:pointer; background:#fff; }
.th img{ width:100%; height:100%; object-fit:cover; display:block; }
.th.active{ border-color:#2563eb; }

/* merits / PR */
.merits{ display:flex; flex-wrap:wrap; gap:8px; margin:12px 0; padding:0; list-style:none; }
.merits li{ background:#eef2ff; color:#3730a3; padding:4px 10px; border-radius:999px; font-size:12px; }
.pr{ margin-top:10px; color:#374151; line-height:1.9; }

/* table */
.table-sec{ margin-top:18px; }
.table-sec h3{ text-align:center; font-size:22px; margin:10px 0 12px; }
.table{ display:grid; grid-template-columns: 160px 1fr; border-top:1px solid #e5e7eb; }
.table dt, .table dd{ padding:14px 8px; border-bottom:1px solid #e5e7eb; }
.table dt{ color:#6b7280; }

/* map / cta */
.map{ margin-top:12px; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,.06); }
.cta{ display:flex; gap:28px; justify-content:center; margin:22px 0 6px; }
.round{
  width:92px; height:92px; border-radius:999px; border:none; cursor:pointer;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  background: linear-gradient(135deg,#ffa07a,#ff7f50); color:#fff; font-weight:800;
  box-shadow:0 10px 24px rgba(255,127,80,.35);
}
.round.active{ background: linear-gradient(135deg,#e53935,#d32f2f); }
.round span{ margin-top:6px; font-size:12px; }

/* footer */
.footer{ display:flex; justify-content:center; margin-top:20px; }
.back{
  border:1px solid #d1d5db; background:#fff; padding:10px 14px; border-radius:10px; cursor:pointer;
}
.back:hover{ background:#f9fafb }

@media (max-width:640px){
  .gallery .main img{ height:240px; }
  .table{ grid-template-columns: 120px 1fr; }
}

/* スマホでヘッダーに隠れないように、main を下げる */
@media (max-width: 768px){
  :root { --header-height: 72px; } /* JS が上書きする初期値 */
  main.l-sec {                    /* ← このページの main にだけ効かせる */
    padding-top: var(--header-height);
  }
}


/* 追加箇所 */
.clip-remove .js-modal-trigger {
  background: var(--color-p);
  font-size: var(--font-size-sm);
  padding: var(--padding-xs) var(--padding-md);
  color: #fff;
  text-align: center;
  display: inline-block;
  border-radius: 99px;
  cursor: pointer;
}
.status__items .js-modal-trigger.active{
  background: #ff7f50;
  border-color: #ff7f50;
  color: #fff;
  text-align: center;
  display: inline-block;
  border-radius: 99px;
  cursor: pointer;
}
.status__items .js-modal-trigger.active img{
  filter: invert(1) brightness(110%); /* アイコンを白く */
}


.action-item.is-active .icon img,

/* ベース：非アクティブ時はそのまま表示 */
.status__items .js-modal-trigger img{ filter: none; }

/* アクティブ時は白化（黒系SVG想定） */
.status__items .js-modal-trigger.active img{
  filter: brightness(0) invert(1);
}

.job-item__jobtype {
  display: inline-block;
  margin-right: 2px;
}
.job-item__jobtype span {
  color: #fff;
  padding: 5px 8px 6px;
  display: inline-block;
  font-weight: 600;
  font-size: var(--font-size-sm);
  border-radius: 3px;
}

/* 概要行の横並びを固定（折り返し禁止） */
.job-item__summary{
  display: flex;               /* 念のため明示 */
  align-items: flex-start;
  gap: 16px;
  flex-wrap: nowrap !important;  /* ← これが効くと右に来ます */
}

/* テキスト側が横幅を取って、余白はここが吸収 */
.job-item__txtwrap{
  flex: 1 1 auto;
  min-width: 0;
  width: auto;                 /* もし width:100% がどこかにある場合の上書き */
}

/* バッジは右端に寄せる */
.job-item__badge{
  margin-left: 16px;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  align-items: center;
  translate: 0 -6px;           /* 少しだけ上に（お好みで） */
}

.job-item__badge img{
  height: 88px;
  width: auto;
  display: block;
}

.job-item__badge-caption{
  margin-top: 6px;
  font-size: 12px;
  color: #4b5563;
  text-align: center;
  line-height: 1.2;
}

.job-item__pr{
  white-space: pre-wrap;
  word-break: break-word; /* 長い単語・URLのはみ出し対策（任意） */
}

/* スマホは折り返してバッジを下に（任意） */
@media (max-width: 640px){
  .job-item__summary{ flex-wrap: wrap !important; }
  .job-item__badge{
    margin-left: 0;
    margin-top: 8px;
    align-self: flex-start;
  }
  .job-item__badge img{ height: 72px; }
}



</style>

