<!-- src/views/biz/AnnouncementListMineEnd.vue -->
 <!-- 終了したお知らせ一覧ページ -->
<template>
  <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />
  <main class="news-list">
    <div class="inner">
      <h1 class="page-title maru">終了したお知らせ一覧</h1>

      <!-- ローディング -->
      <div v-if="loading" class="loading">読み込み中…</div>

      <!-- 空表示 -->
      <div v-else-if="!items.length" class="empty">まだお知らせはありません。</div>

      <!-- 一覧 -->
      <ul v-else class="list">
        <li v-for="row in items" :key="row.id" class="item">
          <!-- カード本体（タイトル＋日付/カテゴリ） -->
          <AnnouncementItem
            :title="row.title"
            :date="row.created_at"
            :categories="row.category_names.length ? row.category_names : row.category_name"
            :to="{ name:'AnnouncementDetail', params:{ id: row.id } }"
          />

          <!-- ★ 枠の“外”に編集ボタンを配置 -->
          <!-- <div class="row-actions">
            <router-link
              class="btn-edit"
              :to="{ name:'AnnouncementEdit', params:{ id: row.id } }"
            >
              お知らせを編集する
            </router-link>
            <button class="btn-end" type="button" @click="askEnd(row)">
              掲載を終了する
            </button>

            <BizToastModal
              v-model:open="endModal.open"
              :message="endConfirmMessage"
              confirm-label="掲載を終了する"
              cancel-label="キャンセル"
              :show-cancel="true"
              :busy="endBusy"
              :auto-close-ms="0"
              @confirm="onEndConfirm"
            />

            <BizToastModal
              v-model:open="endNotice.open"
              :message="endNotice.message"
              confirm-label="CLOSE"
              :show-cancel="false"
              :auto-close-ms="0"
            />
          </div> -->
        </li>
      </ul>

      <!-- ページネーション -->
      <nav v-if="lastPage > 1" class="pager" aria-label="ページネーション">
        <button class="nav prev" :disabled="page<=1" @click="go(page-1)">‹</button>
        <button
          v-for="n in pagesToShow"
          :key="n"
          class="num"
          :class="{ 'is-current': n === page }"
          @click="go(n)"
        >{{ n }}</button>
        <button class="nav next" :disabled="page>=lastPage" @click="go(page+1)">›</button>
      </nav>
          <!-- 戻る -->
          <div class="btn-back">
            <a href="/" @click.prevent="goback">
              <span class="ico"><img src="/src/assets/images/common/ico-back.svg" alt=""></span>
              <span class="txt">戻る</span>
            </a>
          </div>
    </div>
    <AppFooter />
  </main>
</div>
<PcModel />
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { http } from '@/api/http'
import AnnouncementItem from '@/components/news/AnnouncementItem.vue'
import { useRouter } from 'vue-router'
// import BizToastModal from '@/components/common/BizToastModal.vue'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

const API_BASE = '/announcements'
const PER_PAGE = 10

const page      = ref(1)
const lastPage  = ref(1)
const total     = ref(0)
const items     = ref([])
const loading   = ref(false)

/* ▼ 許可カテゴリ（名前/スラッグの両方で判定） */
const ALLOWED_NAME_SET = new Set(['イベント', '施設から'])
const ALLOWED_SLUG_SET = new Set(['event', 'facility'])

onMounted(fetchList)
watch(page, fetchList)

async function fetchList () {
  try {
    loading.value = true
    const uid = Number(localStorage.getItem('userId') || 0)
    const { data } = await http.get(API_BASE, {
     params: {
       page: page.value,
       per_page: PER_PAGE,
       scope: 'mine',
       status: 'ended',
       user_id: uid || undefined,
     },
     headers: uid ? { 'x-user-id': String(uid) } : undefined, // ← ヘッダでも渡す
    })
    const rows = data?.items || data?.rows || data?.data || []

    // 正規化 → 許可カテゴリだけ抽出
    const mapped   = rows.map(normalizeRow)
    const filtered = mapped.filter(allowedCategory)

    items.value = filtered

    // フィルタ後の件数でページネーションを算出
   const srvTotal = Number(data?.total ?? 0)
   if (srvTotal > 0) {
     total.value    = srvTotal
     lastPage.value = Math.max(1, Math.ceil(srvTotal / PER_PAGE))
   } else {
     total.value    = filtered.length
     lastPage.value = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
   }
  } catch (e) {
    console.error('[ann:list] failed', e)
    items.value = []
    total.value = 0
    lastPage.value = 1
  } finally {
    loading.value = false
  }
}

function normalizeRow (r) {
  return {
    id: r.id ?? r.announcement_id,
    title: r.title ?? '',
    created_at: r.created_at ?? r.published_at ?? r.updated_at ?? '',
    category_name: r.category_name ?? r.category?.name ?? '',
    category_slug: (r.category_slug ?? r.category?.slug ?? '').toString().toLowerCase(),
    category_names: Array.isArray(r.categories)
      ? r.categories.map(c => (c.name || c)).filter(Boolean)
      : []
  }
}

/* ▼ カテゴリ判定（単一/複数・name/slug いずれでも通す） */
function allowedCategory (row) {
  if (row.category_slug && ALLOWED_SLUG_SET.has(row.category_slug)) return true
  if (row.category_name && ALLOWED_NAME_SET.has(row.category_name)) return true
  if (row.category_names?.length) {
    // names に一つでも許可カテゴリが含まれていれば OK
    return row.category_names.some(n => ALLOWED_NAME_SET.has(String(n)))
  }
  return false
}

function go (n) {
  if (n < 1 || n > lastPage.value || n === page.value) return
  page.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const pagesToShow = computed(() => {
  const max = 5
  const start = Math.max(1, page.value - 2)
  const end = Math.min(lastPage.value, start + max - 1)
  const realStart = Math.max(1, end - max + 1)
  return Array.from({ length: end - realStart + 1 }, (_, i) => realStart + i)
})

function goback () {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// const endModal   = ref({ open:false, targetId:null, targetTitle:'' })
// const endBusy    = ref(false)
// const endNotice  = ref({ open:false, message:'' })

// const endConfirmMessage = computed(() =>
//   endModal.value.open
//     ? `「${endModal.value.targetTitle || '（無題）'}」の掲載を終了します。よろしいですか？`
//     : ''
// )

// /* 終了ボタン押下 → モーダルを開く */
// function askEnd(row){
//   endModal.value = { open:true, targetId: row.id, targetTitle: row.title || '' }
// }

// /* 確認OK → 実行 */
// async function onEndConfirm(){
//   const id = endModal.value.targetId
//   if (!id) { endModal.value.open = false; return }

//   endBusy.value = true
//   try{
//     const uid = Number(localStorage.getItem('userId') || 0)
//     await http.post(`${API_BASE}/${id}/end`, null, {
//       headers: uid ? { 'x-user-id': String(uid) } : undefined,
//       params:  uid ? { user_id: uid } : undefined,
//     })
//     // 一覧から即時除外（楽観更新）
//     items.value = items.value.filter(it => it.id !== id)
//     endModal.value.open = false
//     endNotice.value = { open:true, message:'掲載を終了しました。' }
//   } catch (e){
//     console.error('[ann:end] failed', e)
//     endModal.value.open = false
//     endNotice.value = { open:true, message:'掲載の終了に失敗しました。' }
//   } finally {
//     endBusy.value = false
//   }
// }
</script>

<style scoped>
.news-list { background:#f3f4f6; padding: 24px 0 36px; min-height: 60vh; }
.inner { max-width: 820px; margin: 0 auto; padding: 0 16px; }
.page-title{ text-align:center; margin-bottom:16px; }

.loading, .empty{
  text-align:center; color:#6b7280; padding: 20px 0;
}

/* 各アイテム */
.list{ display:grid; gap:18px; }
/* .item{} */

/* ▼ カード下の操作行：中央寄せに */
.row-actions{
  display: flex;
  justify-content: center;      /* ← 右寄せ→中央寄せ */
  margin: 14px 6px 8px;
}

/* ▼ ボタン：水色背景・白文字 */
.btn-edit{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #42b2e6;          /* 水色 */
  color: #fff;                   /* 文字は白 */
  border: none;                  /* 枠線なし */
  border-radius: 999px;
  padding: 10px 18px;
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


/* pager */
.pager{ display:flex; align-items:center; justify-content:center; gap:10px; margin-top:18px; }
.num{
  width:34px; height:34px; border-radius:999px; border:1px solid #d1d5db; background:#fff; cursor:pointer;
}
.num.is-current{ background:#374151; color:#fff; border-color:#374151; }
.nav{
  width:34px; height:34px; border:none; background:#fff; border-radius:999px; box-shadow:0 2px 8px rgba(0,0,0,.08); cursor:pointer;
}
.nav:disabled{ opacity:.4; cursor:default; }

.btn-back{ margin-bottom: 50px;}

/* ★ 追加：終了ボタン（グレー系） */
.btn-end{
  display:inline-flex; align-items:center; justify-content:center;
  background:#9ca3af; color:#fff; border:none; border-radius:999px;
  padding:10px 16px; font-weight:500; cursor:pointer;
  box-shadow:0 6px 16px rgba(0,0,0,.08);
}
.btn-end:hover{ filter:brightness(1.05); }
.btn-end:active{ transform: translateY(1px); }
.btn-end:focus-visible{ outline:3px solid rgba(156,163,175,.45); outline-offset:2px; }
</style>
