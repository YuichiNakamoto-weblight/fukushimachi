<!-- src/views/biz/BizGoodsListPage.vue -->
<!-- 事業者用グッド一覧 -->
<template>
  <body class="is-employer is-login">
    <div class="wrap">

      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main class="goods-list">
        <div class="page-title maru">グッド一覧</div>

        <section v-if="loading" class="loading">読み込み中…</section>

        <section v-else>
          <!-- 1アイテム = [カード] + [カード外の吹き出し] を兄弟で描画 -->
          <div v-for="it in list" :key="`${it.job_id}-${it.good_at}`" class="good-item">
            <!-- ▼ 求人カード（従来どおり） -->
            <article class="card clickable">
              <!-- カード全面クリック用ストレッチリンクは“カード内”だけに適用 -->
              <router-link
                class="stretched-link"
                :to="{ name: 'JobDetail', params: { id: it.job_id } }"
                aria-label="求人詳細へ"
              />
              <div class="job-list-item__title">{{ it.job_title }}</div>

              <div class="job-list-item__summary flex">
                <div class="job-list-item__tmb">
                  <img :src="imageUrl(it.image_1)" @error="onImgError" alt="" />
                </div>
                <div class="job-list-item__txtwrap">
                  <div class="job-list-item__facilityname">{{ it.facility_name }}</div>
                  <div class="job-list-item__jobtype">
                    <li>
                      <span v-if="it.employment_type_name" class="job-list-item__jobtype--full">
                        {{ it.employment_type_name }}
                      </span>
                    </li>
                  </div>

                  <!-- 住所 -->
                  <div class="job-list-item__location">
                    <span class="ico">
                      <img src="/src/assets/images/jobs/ico-location.svg" alt="エリア">
                    </span>
                    {{ it.job_city || '-' }}
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
            </article>

            <!-- ▼ カード“外”に配置する青い吹き出し -->
            <section class="good-bubble">
              <div class="dt">{{ formatDateTime(it.good_at) }}</div>

              <!-- 吹き出し全体をボタン化して遷移 -->
              <button
                class="good-bubble__btn"
                type="button"
                @click.prevent="openGiverDetail(it)"
                :aria-label="`${it.seeker_name || '求職者'}さんの詳細`"
              >
                <div class="msg">
                  {{ it.seeker_name || '求職者' }}さんからグッドが届きました
                </div>

                <!-- 住所＋性別＋年齢 -->
                <div class="meta">
                  <span class="meta-item">
                    <!-- <span class="ico">
                      <img src="/src/assets/images/jobs/ico-location.svg" alt="">
                    </span> -->
                    {{ it.seeker_city || '-' }}
                  </span>
                  <span class="sep">/</span>
                  <span class="meta-item">{{ it.seeker_gender || '-' }}</span>
                  <span class="meta-item" v-if="it.seeker_age != null">{{ it.seeker_age }}歳 </span>
                  <span> ＞＞ プロフィールを確認する</span>
                </div>
              </button>
            </section>
          </div>

          <!-- 空表示 -->
          <div v-if="!list.length" class="empty">受信したグッドはまだありません。</div>

          <!-- 戻る -->
          <div class="btn-back">
            <a href="/" @click.prevent="goTop">
              <span class="ico"><img src="/src/assets/images/common/ico-back.svg" alt=""></span>
              <span class="txt">TOPへ戻る</span>
            </a>
          </div>
          <!-- <div class="btn-back">
            <a href="#" @click.prevent="goBack">
              <span class="ico"><img src="/src/assets/images/common/ico-back.svg"></span>
              戻る
            </a>
          </div> -->
        </section>
      </main>

      <AppFooter />
    </div>
  </body>
  <PcModel />
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

 function openGiverDetail(it){
   const jobId = Number(it.job_id || it.job_information_id || 0)
   const seekerId = Number(it.seeker_user_id || it.user_id || 0)
   if (!jobId || !seekerId) return
   router.push({ name: 'GoodGiverDetail', params: { jobId, seekerUserId: seekerId } })
}

/* ----- API ----- */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })

/* ----- ユーザーID（事業者） ----- */
const userId = (() => {
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

/* ----- 画像URLユーティリティ ----- */
const RAW_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  window.location.origin
const ORIGIN = String(RAW_BASE).replace(/\/+$/,'').replace(/\/api$/,'')
const fallback = '/stock-images/no-image.png'

function imageUrl(p){
  if (!p) return fallback
  const raw = String(p).trim()
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw
  let rel = raw.replace(/^\/+/, '')
  rel = rel
    .replace(/^uploads\/images\/+/i, '')
    .replace(/^uploads\/jobs\/+/i,  'jobs/')
    .replace(/^images\/+/i, '')
  if (!/^jobs\//i.test(rel)) rel = `jobs/${rel}`
  return `${ORIGIN}/uploads/images/${rel}`
}
function onImgError(e){ const t=e?.target; if(!t) return; t.onerror=null; t.src=fallback }

/* ----- 表示用フォーマッタ ----- */
function formatDateTime(s){
  if (!s) return ''
  const d = new Date(s)
  const Y=d.getFullYear(), M=String(d.getMonth()+1).padStart(2,'0'), D=String(d.getDate()).padStart(2,'0')
  const h=String(d.getHours()).padStart(2,'0'), m=String(d.getMinutes()).padStart(2,'0')
  return `${Y}.${M}.${D} ${h}:${m}`
}
const formatMoney = (v) => (v==null || v==='' || Number.isNaN(Number(v))) ? '-' : Number(v).toLocaleString()
function salaryLabel(type, min, max){
  const prefix = type === 'hourly' ? '時給 ' : type === 'monthly' ? '月給 ' : ''
  const minStr = formatMoney(min)
  const hasMax = max != null && max !== '' && !Number.isNaN(Number(max))
  const maxStr = hasMax ? `〜${formatMoney(max)}` : ''
  return `${prefix}${minStr}${maxStr}`
}

/* ----- 状態 & 取得 ----- */
const list = ref([])
const loading = ref(false)
const page = 1

async function fetchList(){
  loading.value = true
  try {
    const { data } = await API.get('/jobs/goods', {
      params: { user_id: userId, page, perPage: 50 }
    })
    list.value = data?.items || []
    console.log('list:',list.value)
  } catch (e) {
    console.error('[biz:goods:list] fetch failed', e)
    list.value = []
  } finally {
    loading.value = false
  }
}

/* 一覧ページを開いたらグッドの未読を既読化 */
async function markGoodsRead () {
  if (!userId) return
  try {
    await API.post('/jobs/goods/mark-read', { user_id: userId })
    // FooterNavに未読バッジ更新を通知
    window.dispatchEvent(new Event('badge:ping'))
  } catch (e) {
    console.warn('[goods:mark-read] skipped', e)
  }
}

/* マウント時に実行（並列でOK） */
onMounted(() => {
  fetchList()
  markGoodsRead()
})

function goTop () {
  // ルーターでTOPへ（失敗時はロケーションでフォールバック）
  try {
    router.push({ path: '/' })
  } catch {
    window.location.href = '/'
  }
}
</script>



<style scoped>
.goods-list{ max-width:1000px; margin:0 auto; padding:20px 24px 40px; }
.page-title{ text-align:center; font-weight:800; font-size:24px; margin:6px 0 16px; }
.loading{ padding:30px; text-align:center; color:#666; }
.empty{ padding:28px; text-align:center; color:#666; }

/* card */
.card{
  background:#fff; border:1px solid #e5e7eb; border-radius:16px;
  padding:12px 12px 16px; margin:10px 0; box-shadow:0 8px 24px rgba(0,0,0,.10); margin-top: 40px;
}
.card-head{ background:#46a8d9; color:#fff; border-radius:12px; padding:10px 12px; }
.card-head .dt{ font-weight:800; }
.card-head .msg{ margin-top:4px; font-size:15px; font-weight:700; }
.card-head .meta{ margin-top:2px; font-size:13px; opacity:.95; }

.job-title{ margin:10px 4px 6px; font-size:20px; font-weight:800; color:#111827; }

.body{ display:grid; grid-template-columns: 180px 1fr; gap:12px; align-items:center; }
.thumb img{
  width:100%; height:120px; object-fit:cover; border-radius:12px;
  box-shadow:0 6px 16px rgba(0,0,0,.10);
}

.info .fac{ font-weight:700; margin-bottom:4px; }
.badge{ background:#2563eb; color:#fff; font-size:12px; padding:4px 8px; border-radius:8px; }
.rows{ list-style:none; padding:0; margin:8px 0 0; display:grid; gap:4px; color:#374151; }

/* ストレッチリンク＆クリック感 */
.card{ position: relative; }
.clickable{ cursor: pointer; }
.stretched-link{
  position:absolute; inset:0; z-index:1;
  /* キーボード操作でもフォーカスが見えるように */
  border-radius:12px;
}
.stretched-link:focus{ outline: 3px solid rgba(99,102,241,.35); outline-offset: 3px; }
/* もしカード内にボタン等を置く場合は重なり順を前面に */
.card :where(button, a:not(.stretched-link), input, select){ position:relative; z-index:2; }


/* 1アイテム間の余白 */
.good-item { margin: 0 0 22px; }

/* 吹き出しのコンテナ */
.good-bubble{
  position: relative;
  padding-top: 5px;           /* △ とボタンの間に少し余白 */
}

/* 左上の△（吹き出し感） */
.good-bubble::before{
  content: "";
  position: absolute;
  top: -8px;                  /* △の縦位置 */
  left: 28px;                 /* △の横位置（画像の例に近い位置） */
  width: 0; height: 0;
  border-left: 12px solid transparent;
  border-right:12px solid transparent;
  border-bottom:12px solid #46a8d9;   /* 吹き出しと同じ青 */
  filter: drop-shadow(0 2px 2px rgba(0,0,0,.12));
  z-index: 1;
}

/* 吹き出し本体（クリックで遷移） */
.good-bubble__btn{
  display: block;
  width: 100%;
  text-align: left;

  /* ボタンリセット */
  background: #46a8d9;        /* ← 青色 */
  color: #fff;
  border: 0;
  padding: 10px 16px 14px;
  border-radius: 12px;
  cursor: pointer;

  box-shadow: 0 6px 20px rgba(0,0,0,.12);
}

/* ホバー/フォーカス */
.good-bubble__btn:hover { filter: brightness(1.03); }
.good-bubble__btn:focus { outline: 3px solid rgba(59,130,246,.35); outline-offset: 2px; }

/* 日時（吹き出しの左上に白文字で表示） */
.good-bubble .dt{
  position: absolute;
  top: 10px;
  left: 18px;
  color: #eaf6fd;             /* 読みやすい薄い白 */
  font-size: 15px;
  z-index: 2;                 /* ボタンの上に出す */
  pointer-events: none;       /* クリックはボタンへ通す */
}

/* メッセージ文とメタ行 */
.good-bubble__btn .msg{
  font-weight: 700;
  font-size: 18px;
  line-height: 1.6;
  margin: 16px 0 6px;         /* 上に日時が来るので余白を多めに */
}
.good-bubble__btn .meta{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: .95;
}
.good-bubble__btn .meta .ico{
  display: inline-flex;
  width: 16px; height: 16px;
  margin-right: 4px;
}
.good-bubble__btn .meta .ico img{
  width: 100%; height: 100%; display: block; filter: brightness(0) invert(1); /* 白く見せる */
}
.good-bubble__btn .sep{ opacity: .75; }

/* スマホ微調整 */
@media (max-width: 480px){
  .good-bubble__btn .msg{ font-size: 16px; }
}

@media (max-width:640px){
  .body{ grid-template-columns: 1fr; }
  .thumb img{ height:180px; }
}
</style>
