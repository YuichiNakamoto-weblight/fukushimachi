<!-- src/views/jobs/BusinessJobListPage.vue -->
 <!-- 求人情報リストページ -->
<template>
  <body class="job-admin is-employer is-login">
    <div class="wrap">

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
      <main>
        <section class="l-sec mypage-detail">
          <div class="inner">
            <div class="page-title maru">
              {{ title }}（全 {{ total }} 件）
            </div>
            <!-- <div class="actions">
              <button class="btn" @click="showFilters = true">🔍 絞り込み</button>
              <select v-model="sort" @change="() => { page = 1; fetchList() }">
                <option value="newest">新着</option>
                <option value="oldest">古い</option>
                <option value="views">閲覧数が多い</option>
                <option value="clips">クリップが多い</option>
              </select>
            </div> -->


          <section v-if="loading" class="loading">読み込み中…</section>



          <section v-else class="cards">
          <div
            v-for="it in list"
            :key="it.id"
            class="card-with-actions"
            :class="{ 'is-draft-list': isDraftList }"
            @click.capture="guardDraft"
            @keydown.capture.enter.prevent="guardDraft"
            @keydown.capture.space.prevent="guardDraft"
            tabindex="0"
          >
              <JobCard :item="it" :image-base="IMAGE_BASE" />

              <!-- 下部：事業者アクション（← JobCard の外！）-->
              <div class="btn-job-edit-items flex">
                <button
                  v-if="showEdit"
                  class="btn-job-edit-item"
                  data-allow="1"
                  @click.stop="editJob(it)"
                >
                  編集
                </button>

                <template v-if="props.status !== 'draft'">
                <!-- 募集終了一覧では「再開」＋「削除」を表示 -->
                <button
                  v-if="props.status === 'closed'"
                  class="btn-job-edit-item"
                  @click.stop="askReopen(it)"
                >
                  再開
                </button>
                <button
                  v-if="props.status === 'closed'"
                  class="btn-job-edit-item"
                  style="background:#d9534f"
                  @click.stop="askDelete(it)"
                >
                  削除
                </button>

                  <!-- それ以外の一覧では従来どおり -->
                  <template v-else>
                    <button class="btn-job-edit-item" @click.stop="askPause(it)">
                      {{ it.is_paused ? '再開' : '休止' }}
                    </button>
                    <button class="btn-job-edit-item" @click.stop="askClose(it)" :disabled="!!it.is_closed">
                      終了
                    </button>
                  </template>
                </template>
              </div>
            </div>

            <div v-if="!list.length" class="empty">条件に一致する求人がありません。</div>
          </section>

            <!-- フィルタモーダル（既存） -->
            <FiltersModal
              v-model:open="showFilters"
              :employment-types="employmentTypes"
              :service-types="serviceTypes"
              :merits="merits"
              :area-groups="areaGroups"
              :value="filters"
              @apply="onApplyFilters"
            />

            <!-- ▼ 休止/再開・終了：確認トースト -->
            <BizToastModal
              v-model:open="modal.open"
              :message="confirmMessage"
              :confirm-label="confirmLabel"
              cancel-label="キャンセル"
              :show-cancel="true"
              :busy="busy"
              :auto-close-ms="0"
              @confirm="onConfirm"
            />

            <!-- ▼ 完了メッセージトースト -->
            <BizToastModal
              v-model:open="notice.open"
              :message="notice.message"
              confirm-label="CLOSE"
              :show-cancel="false"
              :auto-close-ms="0"
            />
            <!-- <div class="btn-back">
              <a href="#" @click.prevent="goBack">
                <span class="ico"><img :src="icoBack" alt="" /></span>
                戻る
              </a>
            </div> -->
            <div class="btn-back">
              <router-link to="/business/mypage">
                <span class="ico"><img :src="icoBack" alt="" /></span>
                戻る
              </router-link>
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
        <a href="/user/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <a href="/employer/mypage">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import FiltersModal from '@/components/jobs/FiltersModal.vue'
import JobCard from '@/components/jobs/JobCard.vue'
import BizToastModal from '@/components/common/BizToastModal.vue'  /* ← 追加 */
import icoBack from '@/assets/images/common/ico-back.svg'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
const router = useRouter()

/** 受け取り: 'open' | 'paused' | 'closed' */
const props = defineProps({
  // open | paused | closed | draft を許可
  status: { type: String, default: 'open', validator: v => ['open','paused','closed','draft'].includes(v) }
})

/* タイトル */
const title = computed(() =>
  props.status === 'paused' ? '募集休止中の求人'
  : props.status === 'closed' ? '募集終了した求人'
  : props.status === 'draft'  ? '下書き中の求人'
  : '募集中の求人'
)

/* 画像ベース */
const RAW_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL
  ?? import.meta.env.VITE_API_BASE_URL
  ?? window.location.origin
const ORIGIN = String(RAW_BASE).replace(/\/+$/,'').replace(/\/api$/,'')
const IMAGE_BASE = computed(() => `${ORIGIN}/uploads/images`)

/* ログイン事業者の user_id */
const ownerId = (() => {
  try {
    const raw = localStorage.getItem('userId')
    if (!raw) return 0
    if (raw.trim().startsWith('{')) {
      const o = JSON.parse(raw)
      return Number(o?.id ?? o?.userId ?? o?.user?.id ?? 0) || 0
    }
    return Number(raw) || 0
  } catch { return 0 }
})()

/* 一覧状態 */
const list = ref([])
const total = ref(0)
const page = ref(1)
const perPage = 20
const sort = ref('newest')
const loading = ref(false)
const showFilters = ref(false)
const isDraftList = computed(() => props.status === 'draft')

function guardDraft(e){
  if (!isDraftList.value) return
 // ★ 編集ボタンなど「明示的な操作」は通す
 const t = e?.target
 // ★ 許可は “編集” ボタン（または data-allow 明示）だけ
 if (t && (t.closest?.('.btn-job-edit-item') || t.closest?.('[data-allow]'))) return

  // 詳細遷移を完全にブロック
  e?.preventDefault?.()
  e?.stopPropagation?.()
  // 案内トースト
  notice.value = {
    open: true,
    message: '下書き中の求人は詳細ページへは移動できません。「編集」ボタンを押してください。'
  }
}

/* masters */
const employmentTypes = ref([])
const serviceTypes = ref([])
const merits = ref([])
const workLocations = ref([])
const areaGroups = computed(() => {
  const map = new Map()
  for (const w of workLocations.value) {
    const a = w.area || 'その他'
    if (!map.has(a)) map.set(a, [])
    map.get(a).push(w.name)
  }
  return [...map.entries()].map(([name, cities]) => ({ name, cities }))
})

/* フィルタ */
const filters = ref({
  areas: [], cities: [],
  employment_type_ids: [], service_type_ids: [],
  merit_ids: [], salary_min: '', salary_type: ''
})

/* APIクエリ */
const queryParams = computed(() => {
  const f = filters.value
  const p = {
    page: page.value,
    perPage,
    user_id: ownerId,
    owner_only: 1,
    sort: sort.value,
    status: props.status,
  }
  if (f.cities?.length)              p.cities = f.cities
  if (f.employment_type_ids?.length) p.employment_type_ids = f.employment_type_ids
  if (f.service_type_ids?.length)    p.service_type_ids    = f.service_type_ids
  if (f.merit_ids?.length)           p.merit_ids           = f.merit_ids
  if (f.salary_min)                  p.salary_min          = String(f.salary_min).replace(/[^\d]/g,'')
  if (f.salary_type)                 p.salary_type         = f.salary_type
  return p
})

// 公開中と下書き以外は「編集」ボタンを表示しない
// const showEdit = computed(() => props.status === 'open' || props.status === 'draft')
// 「休止中」でも編集ボタンを表示
const showEdit = computed(() => ['open','draft','paused'].includes(props.status))

async function fetchList() {
  loading.value = true
  try {
    const { data } = await API.get('/jobs', { params: queryParams.value })
    total.value = data.total || 0
    list.value  = data.items || []
  } finally {
    loading.value = false
  }
}
function onApplyFilters(payload){ filters.value = { ...payload }; page.value = 1; showFilters.value = false; fetchList() }

/* ---------- 事業者アクション ---------- */
function editJob(item){
  // 編集ページへ
  // router.push({ name: 'JobEditForm', params: { id: item.id } })
  router.push({
    name: 'JobEditForm',
    params: { id: item.id },
    // 休止中一覧からの遷移ならフラグを渡す
    query: props.status === 'paused' ? { from: 'paused' } : {}
  })
}

/* モーダル状態（type: 'pause' | 'close' | 'reopen' | 'delete'） */
const modal  = ref({ open:false, type:null, item:null })
function askDelete(item){ modal.value = { open:true, type:'delete', item } }

const busy   = ref(false)
const notice = ref({ open:false, message:'' })

/* ★ ポップアップを開く（APIは押下後の confirm で実行） */
function askPause(item){ modal.value = { open:true, type:'pause', item } }
function askClose(item){ modal.value = { open:true, type:'close', item } }
function askReopen(item){ modal.value = { open:true, type:'reopen', item } }

/* 確認文言／ボタン文言 */
const confirmMessage = computed(() => {
  const m = modal.value
  if (!m.open || !m.item) return ''
  if (m.type === 'pause')  return `この求人の募集を${m.item.is_paused ? '再開' : '休止'}します。よろしいですか？`
  if (m.type === 'close')  return 'この求人の終了をします。よろしいですか？'
  if (m.type === 'reopen') return 'この求人の募集を再開します。よろしいですか？'
  if (m.type === 'delete') return 'この求人を完全に削除します。関連データも消去され元に戻せません。実行しますか？'
  return ''
})

const confirmLabel = computed(() => {
  const m = modal.value
  if (m.type === 'pause')  return `募集を${m.item?.is_paused ? '再開' : '休止'}する`
  if (m.type === 'close')  return '募集を終了する'
  if (m.type === 'reopen') return '募集を再開する'
  if (m.type === 'delete') return '完全に削除する'
  return 'OK'
})

/* 確認OK → 実行 */
async function onConfirm(){
  const m = modal.value
  if (!m.item || !m.type) return
  if (m.type === 'pause') { await doPause() }
  else if (m.type === 'close') { await doClose() }
  else if (m.type === 'reopen') { await doReopen() }
  else if (m.type === 'delete') { await doDelete() }
}

/* 実処理：休止/再開 */
async function doPause(){
  const item = modal.value.item
  if (!item) return
  busy.value = true
  try{
    const toPause = !item.is_paused
    await API.patch(`/jobs/${item.id}/pause`, { value: toPause ? 1 : 0, user_id: ownerId })
    item.is_paused = toPause ? 1 : 0
    if ((props.status === 'open' && toPause) || (props.status === 'paused' && !toPause)) {
      list.value = list.value.filter(x => x.id !== item.id)
      total.value = Math.max(total.value - 1, 0)
    }
    modal.value.open = false
    notice.value = { open:true, message: toPause ? '募集を休止しました。' : '募集を再開しました。' }
  } catch(e){
    console.error('pause failed', e)
    modal.value.open = false
  } finally { busy.value = false }
}

/* 実処理：終了 */
async function doClose(){
  const item = modal.value.item
  if (!item) return
  busy.value = true
  try{
    if (item.is_closed) return
    await API.patch(`/jobs/${item.id}/close`, { user_id: ownerId })
    item.is_closed = 1
    if (props.status !== 'closed') {
      list.value = list.value.filter(x => x.id !== item.id)
      total.value = Math.max(total.value - 1, 0)
    }
    modal.value.open = false
    notice.value = { open:true, message:'募集を終了しました。' }
  } catch(e){
    console.error('close failed', e)
    modal.value.open = false
  } finally { busy.value = false }
}

/* 実処理：再開（終了→公開へ） */
async function doReopen(){
  const item = modal.value.item
  if (!item) return
  busy.value = true
  try{
    // サーバで is_closed=0 に戻す想定
    await API.patch(`/jobs/${item.id}/reopen`, { user_id: ownerId })
    item.is_closed = 0
    item.is_paused = 0 // 再開＝公開に戻す想定（必要に応じて調整）
    // 「終了一覧」からは外す
    if (props.status === 'closed') {
      list.value = list.value.filter(x => x.id !== item.id)
      total.value = Math.max(total.value - 1, 0)
    }
    modal.value.open = false
    notice.value = { open:true, message:'募集を再開しました。' }
  } catch(e){
    console.error('reopen failed', e)
    modal.value.open = false
  } finally { busy.value = false }
}

async function doDelete(){
  const item = modal.value.item
  if (!item) return
  busy.value = true
  try{
    // 物理削除ではなくソフト削除へ
    await API.patch(`/jobs/${item.id}/delete`, { user_id: ownerId })
    // 一覧から取り除く（closed一覧でも消す＝ゴミ箱非表示運用）
    list.value = list.value.filter(x => x.id !== item.id)
    total.value = Math.max(total.value - 1, 0)
    modal.value.open = false
    notice.value = { open:true, message:'求人を削除（非表示化）しました。' }
  } catch(e){
    console.error('delete failed', e)
    modal.value.open = false
    notice.value = { open:true, message:'削除に失敗しました。時間をおいて再度お試しください。' }
  } finally { busy.value = false }
}



/* 初期化 */
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
})


</script>

<style scoped>

/* JobCard の既存フッターアイコンを隠す */
:deep(.job-card__footer > .icon-btn){ display:none !important; }

.btn-job-edit-item{
    background: var(--color-employ);
    font-size: var(--font-size-sm);
    padding: 8px 16px;
    color: #fff;
    text-align: center;
    display: inline-block;
    border-radius: 99px;
    cursor: pointer;
}

/* JobCard 内のメタ行（募集開始・閲覧数）の上に余白を付ける */
:deep(.job-list-item__data){
  margin-top: 12px !important;
}


/* ドラフト一覧のときは JobCard 自体のクリックを拾わせない（ただし下の編集ボタンは有効） */
 card-with-actions.is-draft-list :deep(.job-list-item){
  pointer-events: none;   /* マウス/タップ無効化 */
  cursor: not-allowed;
  outline: none;
}

</style>

