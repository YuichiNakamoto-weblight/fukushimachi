<!-- src/views/jobs/FacilityJobsList.vue -->
 <!-- 施設別求人情報一覧 -->
<template>
  <!-- <body class="clip-list is-user is-login"> -->
  <body class="is-employer is-login">
    <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

      <div class="content">
        <main>

          <div class="content-head">
            <div class="inner">
              <div class="job-list__nav flex align-center">
                <div class="job-list__count">
                  {{ effectiveView==='clips' ? 'クリップ一覧' :
                      effectiveView==='goods' ? 'グッド一覧' :
                      effectiveView==='talks' ? 'トーク一覧' : '全' }} {{ total }} 件
                </div>
                <div class="job-list__order">
                  <div class="flex align-center js-modal-trigger" aria-controls="modal-order">
                    <span class="ico"><img src="/src/assets/images/jobs/ico-order.svg">
                    </span>
                    <span class="name" @click="showFilters = true">絞り込み</span>
                  </div>
                </div>
                  <!-- 並び替えボタン＆メニュー -->
                  <div class="job-list__sort" ref="sortWrap">
                    <button class="sort-btn flex align-center" type="button" @click.stop="toggleSort">
                      <span class="ico">
                        <img src="/src/assets/images/jobs/ico-sort.svg" alt="">
                      </span>
                      <span class="name">並び替え</span>
                    </button>

                    <teleport to="body">
                      <div v-if="showSort" class="sort-backdrop" @click="closeSort"></div>
                      <transition name="fade-scale">
                        <ul class="sort-menu" v-if="showSort" role="menu" aria-label="並び替え" :style="menuStyle" @click.stop >
                          <ul class="sort-menu" v-if="showSort" role="menu" aria-label="並び替え" :style="menuStyle" @click.stop ></ul>
                          <li><button type="button" :class="{active:sort==='newest'}" @click.prevent.stop="applySort('newest')">新着順</button></li>
                          <li><button type="button" :class="{active:sort==='oldest'}" @click.prevent.stop="applySort('oldest')">古い順</button></li>
                          <li><button type="button" :class="{active:sort==='views'}"  @click.prevent.stop="applySort('views')">閲覧数が多い順</button></li>
                          <li><button type="button" :class="{active:sort==='clips'}"  @click.prevent.stop="applySort('clips')">クリップが多い順</button></li>
                        </ul>
                      </transition>
                    </teleport>

                  </div>
              </div>
              <div v-if="pageTitle" class="page-title maru">{{ pageTitle }}</div>
            </div>
          </div>

          <section class="l-sec">

          <section v-if="loading" class="loading">読み込み中…</section>

          <section v-else class="cards">
            <JobCard
              v-for="it in list"
              :key="it.id"
              :item="it"
              :image-base="IMAGE_BASE"
              @toggle-clip="onToggleClip"
              @toggle-good="onToggleGood"
              @require-auth="showAuthToast = true"
            />
            <div v-if="!list.length" class="empty">条件に一致する求人がありません。</div>
          </section>

          <!-- ▼ ページネーション -->
          <nav
            v-if="totalPages > 1"
            class="pagination"
            aria-label="求人一覧のページネーション"
          >
            <a
              class="prev"
              href="#"
              :aria-disabled="page<=1"
              @click.prevent="goPage(page-1)"
              title="前のページ"
            />
            <a
              v-for="n in pageNumbers"
              :key="n"
              href="#"
              :class="['page-number', { select: n===page }]"
              @click.prevent="goPage(n)"
            >{{ n }}</a>
            <a
              class="next"
              href="#"
              :aria-disabled="page>=totalPages"
              @click.prevent="goPage(page+1)"
              title="次のページ"
            />
          </nav>

          <!-- ✅ FiltersModal は v-model:open だけで開閉管理 -->
          <FiltersModal
            v-model:open="showFilters"
            :employment-types="employmentTypes"
            :service-types="serviceTypes"
            :merits="merits"
            :area-groups="areaGroups"
            :value="filters"
            @apply="onApplyFilters"
          />
          <!-- ✅ 成功トースト -->
          <ToastModal v-model:open="toastOpen" :message="toastMsg" :auto-close-ms="1800" />
          <ConfirmGoodModal
            v-model:open="goodConfirmOpen"
            :job-title="pendingGoodItem?.title || ''"
            :facility-name="pendingGoodItem?.facility_name || ''"
            @confirm="confirmGood"
            @cancel="() => { pendingGoodItem=null; pendingGoodDone=null }"
          />
        <!-- ✅ 未ログイン時の登録促し（ToastModalは使わない） -->
        <div
          v-if="showAuthToast"
          class="apm-overlay"
          @click.self="showAuthToast = false"
        >
          <div class="apm-modal" role="dialog" aria-modal="true" aria-labelledby="apm-title">
            <h3 id="apm-title" class="apm-title">マイページ登録しませんか？</h3>

            <!-- 中央寄せの「登録」だけ -->
            <button class="apm-cta" @click="router.push({ name: 'RegisterSeeker' })">
              登録
            </button>

            <p class="apm-text">
              求人情報の詳細が閲覧できる他、介護施設へのメッセージ送信や
              気になる求人を保存することができます。
            </p>
            <p class="apm-text">ぜひ積極的にこのサイトをご活用ください！</p>
          </div>
        </div>
        </section>
        </main>
      </div>
    <AppFooter />
    </div>

    <!-- <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt>
  </div>

  <div class="hero-copy pc">
    <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo user-content">
      <a href="/user">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo employer-content">
      <a href="/employer">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>
  </div>

  <div class="pc">
    <div class="user-content login-content">
      <div class="mypage-link">
        <a href="/seeker/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <a href="/business/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>
  </div> -->
  </body>
    <PcModel />
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import FiltersModal from '@/components/jobs/FiltersModal.vue'
import JobCard from '@/components/jobs/JobCard.vue'
import ToastModal from '@/components/common/ToastModal.vue'
import { useRoute } from 'vue-router'
import ConfirmGoodModal from '@/components/common/ConfirmGoodModal.vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })

const router = useRouter()
const showAuthToast = ref(false)

const props = defineProps({
  view: {
    type: String,
    default: 'all',
    validator: (v) => ['clips', 'goods', 'talks', 'all'].includes(v),
  },
})

// props.view（ルートで明示指定）を優先、無ければ ?view= を使う
const route = useRoute()
const effectiveView = computed(() => {
  const v = (props.view && props.view !== 'all')
    ? props.view
    : String(route.query.view || 'all')
  return ['clips','goods','talks'].includes(v) ? v : 'all'
})

// 既存の effectiveView の下あたりに
const pageTitle = computed(() => {
  switch (effectiveView.value) {
    case 'clips': return 'クリップ一覧'
    case 'goods': return 'グッド一覧'
    case 'talks': return 'トーク一覧'
    default:      return ''
  }
})



// RAW に /api が含まれていたら削って「オリジン」にする
const RAW_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL
  ?? import.meta.env.VITE_API_BASE_URL
  ?? window.location.origin
const ORIGIN = String(RAW_BASE).replace(/\/+$/,'').replace(/\/api$/,'')
// const IMAGE_BASE = computed(() => `${ORIGIN}/uploads/jobs`)
const IMAGE_BASE = computed(() => `${ORIGIN}/uploads/images`) // ← 任意・固定どちらもここから配る
const showFilters = ref(false)

const list = ref([])
const total = ref(0)
const page = ref(1)
const perPage = 20
const sort = ref('newest') // newest | oldest | views | clips
const loading = ref(false)

// masters
const employmentTypes = ref([])
const serviceTypes = ref([])
const merits = ref([])
const workLocations = ref([])

// areaGroups = [{name:'県北', cities:[...]}]
const areaGroups = computed(() => {
  const map = new Map()
  for (const w of workLocations.value) {
    const a = w.area || 'その他'
    if (!map.has(a)) map.set(a, [])
    map.get(a).push(w.name)
  }
  return [...map.entries()].map(([name, cities]) => ({ name, cities }))
})

// ▼ 並び替えメニュー（純JS）
const showSort = ref(false)            // メニュー表示フラグ
const sortWrap = ref(null)             // 外側クリック判定用コンテナ
const menuStyle = ref({})  // ← メニューの位置(style)を保持

const toggleSort = () => {
  showSort.value = !showSort.value
  if (showSort.value) positionMenu()
}
const closeSort  = () => { showSort.value = false }

function positionMenu () {
  const wrap = sortWrap.value
  if (!wrap) return
  const btn = wrap.querySelector('.sort-btn') || wrap
  const r = btn.getBoundingClientRect()
  const vw = window.innerWidth
  const mh = 8                     // 余白
  const assumedWidth = 220         // メニューの概算幅（CSSに合わせて）
  const left = Math.min(r.left, vw - assumedWidth - mh)
  menuStyle.value = {
    position: 'fixed',
    top:  `${Math.round(r.bottom + mh)}px`,
    left: `${Math.round(left)}px`,
    zIndex: 4000
  }
}

function onWinResize () {
  if (showSort.value) positionMenu()
}

async function applySort(key){
  if (sort.value !== key) {
    sort.value = key
    page.value = 1
    await fetchList()
  }
  closeSort()
}

// function applySort(key) {
//   // key: 'newest' | 'oldest' | 'views' | 'clips'
//   if (sort.value !== key) {
//     sort.value = key
//     page.value = 1
//     fetchList()
//   }
//   closeSort()
// }

// 画面外クリックでメニューを閉じる
const onDocClick = (e) => {
  if (!showSort.value) return
  const el = sortWrap.value
  const target = e.target
  // 1) ボタン付近（sortWrap）をクリック → 何もしない
  if (el && el.contains(target)) return
  // 2) teleport先のメニュー内をクリック → 何もしない
  if (target.closest?.('.sort-menu')) return
  // 3) バックドロップ → 閉じる（既に @click で閉じるが保険）
  if (target.closest?.('.sort-backdrop')) { closeSort(); return }
  // 4) それ以外（本当の外側） → 閉じる
  closeSort()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  window.addEventListener('resize', onWinResize, { passive:true })
  window.addEventListener('scroll', onWinResize, { passive:true })
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('resize', onWinResize)
  window.removeEventListener('scroll', onWinResize)
})


// バッジ更新の合図（同タブ & 他タブの両方に効く）
function pingBadges () {
  try { localStorage.setItem('badgePing', String(Date.now())) } catch {console.log()}
  try { window.dispatchEvent(new Event('badge:ping')) } catch {console.log()}
}


 // 総ページ数
 const totalPages = computed(() => Math.max(1, Math.ceil((total.value || 0) / perPage)))

 // 表示するページ番号のウィンドウ（最大7つ）
 const pageNumbers = computed(() => {
   const size = 7
   const cur  = page.value
   const max  = totalPages.value
   const half = Math.floor(size / 2)
   let start  = Math.max(1, cur - half)
   let end    = Math.min(max, start + size - 1)
   start      = Math.max(1, end - size + 1)
   return Array.from({ length: end - start + 1 }, (_, i) => start + i)
 })

 function goPage(n) {
   const max = totalPages.value
   if (n < 1 || n > max || n === page.value) return
   page.value = n
   fetchList().then(() => {
     try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {console.log()}
   })
 }


// ✅ フィルタ項目（API側が受けるキーに合わせる: areas, cities）
const filters = ref({
  areas: [],                 // "県北" など
  cities: [],                // "福島市" など
  employment_type_ids: [],
  service_type_ids: [],
  merit_ids: [],
  salary_min: ''
})

const userId = (() => {
  try {
    const raw = localStorage.getItem('userId')
    if (!raw) return 0
    if (raw.trim().startsWith('{')) {
      const o = JSON.parse(raw); return Number(o?.id ?? o?.userId ?? o?.user?.id ?? 0) || 0
    }
    return Number(raw) || 0
  } catch { return 0 }
})()

// ✅ トースト表示用
const toastOpen = ref(false)
const toastMsg  = ref('')
const showToast = (msg) => { toastMsg.value = msg; toastOpen.value = true }

// クリップ
async function onToggleClip(item, done){
  if (!userId) {
    alert('クリップにはログインが必要です。')
    return
  }
  try {
    if (item.clipped) {
      await API.delete(`/jobs/${item.id}/clip`, { params: { user_id: userId } })
      item.clipped = false
      showToast('クリップを解除しました')
    } else {
      await API.post(`/jobs/${item.id}/clip`, { user_id: userId })
      item.clipped = true
      showToast('求人情報をクリップしました')
    }
    pingBadges() // フッターバッジ更新

    if (typeof done === 'function') done(item.clipped)
  } catch (e) {
    console.error('clip toggle failed', e)
    // alert('クリップに失敗しました。時間をおいて再度お試しください。')
  }
}


// ▼ 追加：グッド確認モーダル用ステート
const goodConfirmOpen = ref(false)
const pendingGood = ref(null) // { item, done }

// グッド
async function onToggleGood(item, done){
  if (!userId) { alert('グッドにはログインが必要です。'); return }

  // 取り消しは即時
  if (item.gooded) {
    try {
      await API.delete(`/jobs/${item.id}/good`, { params: { user_id: userId } })
      item.gooded = false
      if (typeof item.good_count === 'number') item.good_count = Math.max(item.good_count - 1, 0)
      showToast('グッドを取り消しました')
      pingBadges() // ← 取り消し時も更新
      if (typeof done === 'function') done(item.gooded)
    } catch (e) {
      console.error('good toggle failed', e)
    }
    return
  }

  // まだグッドしていない → 確認モーダルを開く
  pendingGood.value = { item, done }
  goodConfirmOpen.value = true
}

// ▼ 追加：モーダルで「グッドする」押下時
async function confirmGood(){
  const ctx = pendingGood.value
  if (!ctx) { goodConfirmOpen.value = false; return }
  const { item, done } = ctx
  try {
    // await API.post(`/jobs/${item.id}/good`, { user_id: userId })
    await API.post(`/jobs/${item.id}/good`, { user_id: userId, notify: 1 })
    item.gooded = true
    if (typeof item.good_count === 'number') item.good_count += 1
    showToast('介護施設へグッドが通知されました！')
    pingBadges() // ← 確定後すぐ反映
    if (typeof done === 'function') done(item.gooded)
  } catch (e) {
    console.error('good add failed', e)
  } finally {
    goodConfirmOpen.value = false
    pendingGood.value = null
  }
}


// ✅ API に渡すクエリを整形（areas / cities / *_ids[]）
const queryParams = computed(() => {
  const f = filters.value || {};
  const params = {
    page: page.value,
    perPage,
    user_id: facilityUserId.value, // 施設の user_id
    sort: sort.value,
  };

  // ログインしていれば viewer_id を付与（未ログインなら付けない）
  if (userId) params.viewer_id = userId;

  if (Array.isArray(f.cities) && f.cities.length)               params.cities               = f.cities;
  if (Array.isArray(f.employment_type_ids) && f.employment_type_ids.length)  params.employment_type_ids  = f.employment_type_ids;
  if (Array.isArray(f.service_type_ids) && f.service_type_ids.length)        params.service_type_ids     = f.service_type_ids;
  if (Array.isArray(f.merit_ids) && f.merit_ids.length)                      params.merit_ids            = f.merit_ids;
  if (f.salary_min) params.salary_min = String(f.salary_min).replace(/[^\d]/g, '');

  return params;
});


/** 施設ユーザーIDを params / query から安全に解決 */
const facilityUserId = computed(() => {
  const p = Number(route.params.userId ?? 0)
  if (Number.isFinite(p) && p > 0) return p
  const q = Number(route.query.user_id ?? route.query.facility_user_id ?? 0)
  return Number.isFinite(q) && q > 0 ? q : 0
})

async function fetchList () {
  loading.value = true
  try {
    const { data } = await API.get('/jobs/by-facility', { params: queryParams.value })
    // const { data } = await API.get('/jobs', { params: queryParams.value })
        console.log('params:',queryParams.value)
        console.log('data:',data)
    total.value = data.total || 0
    list.value = data.items || []
  } finally {
    loading.value = false
  }
}

// ✅ FiltersModal からの apply を受け取る唯一のハンドラ
function onApplyFilters(payload) {
  filters.value = { ...payload }
  page.value = 1
  showFilters.value = false
  fetchList()
}

onMounted(async () => {
  const [et, st, me, wl] = await Promise.all([
    API.get('/masters/employment-types'),
    API.get('/masters/service-types'),
    API.get('/masters/merits'),
    API.get('/masters/work-locations')
  ])
  employmentTypes.value = et.data.items || []
  serviceTypes.value    = st.data.items || []
  merits.value          = me.data.items || []
  workLocations.value   = wl.data.items || []

  fetchList()

  if (String(route.query.signup || '') === '1') {
    showAuthToast.value = true
  }
})
// ?view= が変わったら再取得
watch(() => route.query.view, () => {
  page.value = 1
  fetchList()
})
</script>


<style scoped>
.toolbar{display:flex;justify-content:space-between;align-items:center;padding:10px 6px}
.total{
text-align: center;
font-size: var(--font-size-xl);
font-weight: 700;
padding-bottom: var(--padding-lg);
line-height: 1.4;
padding-top: var(--padding-xl);
}
.actions{display:flex;gap:10px;align-items:center}
.btn{background:#ffb020;color:#fff;border:0;border-radius:999px;padding:8px 14px}
.empty{padding:28px;text-align:center;color:#666}
.loading{padding:28px;text-align:center}

.cards{ display:grid; gap:0; }

/* 2枚目以降を少しだけ上に重ねる（数値はお好みで調整） */
.cards > *:not(:first-child){ margin-top:-30px; }


/* ======= Auth Prompt (ToastModal 内のカスタム UI) ======= */
/* ==== トーストの既定レイアウトを透明化（オレンジ帯を消す） ==== */
.toast-modal,
.toast-modal__body,
.toast-modal__message,
.toast-modal__content {
  background: transparent !important;
  box-shadow: none !important;
  color: inherit !important;
}
.toast-modal__message{ display:none !important; }

/* ==== 自前の濃いバックドロップ ==== */
.apm-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.65); /* ← シャドウを濃く */
  z-index: 0;
  pointer-events: none; /* 既存オーバーレイにイベントを渡す */
}

/* ==== 白いカード ==== */
.apm-modal{
  position: relative;
  z-index: 1;
  width: min(520px, 92vw);
  margin: 0 auto;
  background: #fff !important;
  border-radius: 18px;
  padding: 24px 22px 20px;
  box-shadow: 0 24px 60px rgba(0,0,0,.30);
}

/* 閉じるボタン */
.apm-close{
  position:absolute; top:-12px; right:-12px;
  width:40px; height:40px; border-radius:999px; border:0;
  background:rgba(0,0,0,.60); color:#fff; font-size:22px; cursor:pointer;
}

/* タイトル */
.apm-title{
  margin:4px 0 14px; text-align:center;
  font-size:20px; font-weight:800; color:#111827;
}

/* CTA「登録」— ボタン自体もテキストも中央寄せ */
.apm-cta{
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 18px;
  width:220px; height:48px;
  border:0; border-radius:999px; cursor:pointer;
  background:#ff8f70 !important;   /* 画像に近いサーモン色 */
  color:#fff !important; font-weight:800; font-size:18px;
}
.apm-cta:hover{ filter:brightness(1.03); }

/* 説明テキスト */
.apm-text{ margin:0 0 14px; text-align:center; line-height:1.9; color:#333; }
/* ===== Auth Prompt Modal ===== */
.apm-overlay{
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.70); /* ← シャドウ濃く */
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

/* 「登録」ボタン（中央寄せ） */
.apm-cta{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  width: 220px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  background: #ff8f70;   /* 参考画像のサーモン色 */
  color: #fff;
  font-weight: 800;
  font-size: 18px;
}
.apm-cta:hover{ filter: brightness(1.03); }

.apm-text{
  margin: 0 0 14px;
  text-align: center;
  line-height: 1.9;
  color: #333;
}

/* ▼ 並び替えメニュー用 */
.job-list__sort { position: relative; }

.sort-menu{
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 180px;
  padding: 8px 0;
  margin: 0;
  list-style: none;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
  z-index: 3000;
}
.sort-menu li { margin: 0; }
.sort-menu li > button{
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}
.sort-menu li > button:hover { background: #f4f6f8; }
.sort-menu li > button.active { font-weight: 700; color: #ff6a00; }

/* ふわっと開閉アニメーション */
.fade-scale-enter-active,
.fade-scale-leave-active { transition: all .12s ease; transform-origin: top right; }
.fade-scale-enter-from,
.fade-scale-leave-to { opacity: 0; transform: scale(.98) translateY(-2px); }

/* 追加（scopedなら :global か :deep で） */
:deep(.content-head),
:deep(.content-head .inner),
:deep(.job-list__nav) {
  overflow: visible !important;
}

/* クリック元が相対基準＆はみ出せるように */
.job-list__sort {
  position: relative;
  overflow: visible;
}

/* 並び替えメニューのボタン文字色を明示（白塗りに負けないように） */
.sort-menu li > button{
  color: #111 !important;
  line-height: 1.5;            /* 念のため */
  -webkit-appearance: none;
  appearance: none;
}

.sort-menu li > button:hover{
  background: #f4f6f8;
  color: #111;                  /* ホバー時も黒 */
}

.sort-menu li > button.active{
  font-weight: 700;
  color: #ff6a00 !important;    /* 選択中はオレンジ */
}

/* 透明バックドロップ：背面クリックを塞ぐ */
.sort-backdrop{
  position: fixed; inset: 0;
  background: transparent;
  z-index: 3999;            /* メニューの一段下に */
}

/* 浮遊メニュー本体 */
.sort-menu--floating{
  position: fixed;
  right: 16px;
  top: calc(var(--header-height, 64px) + 12px);
  z-index: 4000;
  pointer-events: auto;
}
.sort-menu li>button{ pointer-events: auto; }

/* ▼ デバッグ用：並び替えメニューの“CSS殺し” */
:global(.sort-menu){
  position: fixed !important;
  top: 120px !important;
  right: 16px !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: none !important;
  background: #fff !important;
  border: 1px solid #ddd !important;
  box-shadow: 0 8px 24px rgba(0,0,0,.15) !important;
  z-index: 99999 !important;
}

/* ▼ 並び替えメニュー：上辺の枠/影を消す（影は下方向だけ） */
.sort-menu{
  border: none !important;        /* 枠線を完全に無効化 */
  outline: none !important;
  box-shadow: none !important;    /* 通常の box-shadow を消す */
  /* 下方向のみの影（上には出ない） */
  -webkit-filter: drop-shadow(0 10px 22px rgba(0,0,0,.16));
  filter: drop-shadow(0 10px 22px rgba(0,0,0,.16));
  background: #fff;               /* 念のため */
  border-radius: 12px;            /* 既存の角丸は維持 */
}


@media (max-width: 768px){
  .cards{ gap:0px; }
}
</style>
