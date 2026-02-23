<!-- src/views/biz/GoodGiverDetail.vue -->
<!-- グッドした求職者情報  -->
<template>
  <body class="is-employer is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main class="giver-detail">
        <div class="page-title maru">こちらの求人にグッドされました</div>

        <!-- 求人カード -->
        <article v-if="job" class="card clickable">
          <router-link class="stretched-link"
            :to="{ name:'JobDetail', params:{ id: job.id } }" aria-label="求人詳細へ" />
          <div class="job-list-item__title">{{ job.title }}</div>
          <div class="job-list-item__summary flex">
            <div class="job-list-item__tmb">
              <img :src="imageUrl(job.image_1)" @error="onImgError" alt="">
            </div>
            <div class="job-list-item__txtwrap">
              <div class="job-list-item__facilityname">{{ job.facility_name }}</div>
              <div class="job-list-item__jobtype">
                <li><span class="job-list-item__jobtype--full">{{ job.employment_type_name }}</span></li>
              </div>
              <div class="job-list-item__location">
                <span class="ico"><img src="/src/assets/images/jobs/ico-location.svg" alt=""></span>
                {{ job.city }}
              </div>
              <div class="job-list-item__salary">
                <span class="ico"><img src="/src/assets/images/jobs/ico-fee.svg" alt=""></span>
                {{ salaryLabel(job.base_salary_type, job.base_salary_min, job.base_salary_max) }}
              </div>
            </div>
          </div>
        </article>

        <!-- グッドした人 -->
        <section v-if="seeker" class="profile">
          <div class="page-sectitle maru">グッドした人</div>
          <div class="good-name maru">{{ seeker.full_name }}</div>
          <div v-if="seeker.kana" class="good-kana">（{{ seeker.kana }}）</div>

          <ul class="rows">
            <li>
              <span class="hd">住所</span>
              <span class="bd">{{ seeker.address || '-' }}</span>
            </li>
            <li>
              <span class="hd">生年月日</span>
              <span class="bd">{{ seeker.birthdate_label || '-' }}</span>
            </li>
            <li>
              <span class="hd">年齢</span>
              <span class="bd">{{ seeker.age != null ? seeker.age + '歳' : '-' }}</span>
            </li>
            <li>
              <span class="hd">取得資格</span>
              <span class="bd">
                <template v-if="(seeker.qualifications || []).length">
                  <div v-for="(q,i) in seeker.qualifications" :key="i">{{ q }}</div>
                </template>
                <template v-else>-</template>
              </span>
            </li>
            <li>
              <span class="hd">PR</span>
              <span class="bd">{{ seeker.comment || '-' }}</span>
            </li>
          </ul>
        </section>

        <!-- トークする -->
        <div class="talk-cta">
          <button class="btn-talk" type="button" @click="goTalk" aria-label="トークする">
            <span class="foot-nav-ico" aria-hidden="true">
              <img src="/src/assets/images/common/nav-talk.svg" alt="トーク"/>
            </span>
            <span class="btn-label">トークする</span>
          </button>
        </div>

        <div class="btn-back">
          <a href="#" @click.prevent="$router.back()">
            <span class="ico"><img src="/src/assets/images/common/ico-back.svg"></span>
            戻る
          </a>
        </div>
      </main>

      <AppFooter />
    </div>
  </body>
    <PcModel />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const route = useRoute()
const router = useRouter()
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })

const jobId = Number(route.params.jobId)
const seekerUserId = Number(route.params.seekerUserId)

const job = ref(null)
const seeker = ref(null)

onMounted(load)

async function load(){
  const { data } = await API.get('/jobs/goods/giver-detail', {
    params: { job_id: jobId, seeker_user_id: seekerUserId }
  })
  job.value = data.job || null
  seeker.value = data.seeker || null
}

// function goTalk(){
//   // 既存のトーク開始
//   router.push({ name:'EmployerTalk', params:{ threadId: 0 }, query:{ jobId, seekerUserId } })
// }

/* ----- 表示ユーティリティ ----- */
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
    .replace(/^uploads\/jobs\/+/i, 'jobs/')
    .replace(/^images\/+/i, '')
  if (!/^jobs\//i.test(rel)) rel = 'jobs/' + rel
  return `${ORIGIN}/uploads/images/${rel}`
}
function onImgError(e){ const t=e?.target; if(t){ t.onerror=null; t.src=fallback } }
const formatMoney = (v) => (v==null||v===''||Number.isNaN(Number(v))) ? '-' : Number(v).toLocaleString('ja-JP')
function salaryLabel (type, min, max) {
  const prefix = type === 'hourly' ? '時給 ' : (type === 'monthly' ? '月給 ' : '')
  const minStr = formatMoney(min)
  const hasMax = max != null && max !== '' && !Number.isNaN(Number(max))
  const maxStr = hasMax ? `〜${formatMoney(max)}` : ''
  return `${prefix}${minStr}${maxStr}`
}

// 事業者(＝自分)の users.id
const employerUserIdSelf = (() => {
  try {
    const raw = localStorage.getItem('userId');
    if (!raw) return 0;
    if (raw.trim().startsWith('{')) {
      const o = JSON.parse(raw);
      return Number(o?.id ?? o?.userId ?? o?.user?.id ?? 0) || 0;
    }
    return Number(raw) || 0;
  } catch { return 0; }
})();

/**
 * トーク画面へ（既存→作成→遷移）
 * 必要な変数:
 *   - jobId: 求人ID
 *   - seekerUserId: グッドした求職者の users.id
 */
async function goTalk() {
  try {
    const jobId = Number(typeof window !== 'undefined' ? (window.jobId ?? 0) : 0) || Number(route?.params?.jobId || route?.query?.jobId || 0) || (typeof jobId !== 'undefined' ? jobId : 0); // 既存スコープ/ルータから取得
    const seekerUserId = Number(typeof window !== 'undefined' ? (window.seekerUserId ?? 0) : 0) || Number(route?.params?.seekerUserId || route?.query?.seekerUserId || 0) || (typeof seekerUserId !== 'undefined' ? seekerUserId : 0);

    if (!jobId || !seekerUserId || !employerUserIdSelf) {
      alert('必要な情報が不足しています（jobId / seekerUserId）。');
      return;
    }

    // 1) 既存スレッドを一覧から探す（employer 視点）
    const { data } = await API.get('/talks/threads', {
      params: { role: 'employer', userId: employerUserIdSelf }
    });
    const items = Array.isArray(data?.items) ? data.items : [];
    const existed = items.find(t =>
      Number(t.job_id ?? t.job_information_id) === jobId &&
      Number(t.seeker_user_id) === seekerUserId
    );
    let threadId = existed?.id ? Number(existed.id) : 0;

    // 2) 見つからなければ作成
    if (!threadId) {
      const r = await API.post('/talks/start', {
        job_information_id: jobId,
        seeker_user_id: seekerUserId
      });
      threadId = Number(r?.data?.threadId || r?.data?.id || 0);
      if (!threadId) throw new Error('thread-create-failed');
    }

    // 3) 求人オーナーID（送信側の user_id）が必要なら取得してクエリに載せる
    //    EmployerTalk / TalkPanel で参照する想定の値。不要なら外してOK。
    const jobRes = await API.get(`/jobs/${jobId}`);
    const employerUserId = Number(jobRes?.data?.item?.user_id ?? jobRes?.data?.user_id) || employerUserIdSelf;

    // 4) 遷移（必要なクエリを付与）
    router.push({
      name: 'EmployerTalk',
      params: { threadId },
      query: { jobId, seekerUserId, employerUserId }
    });
  } catch (e) {
    console.error('[goTalk] failed', e);
    alert('トーク画面を開けませんでした。時間をおいて再度お試しください。');
  }
}
</script>

<style scoped>
.giver-detail{ max-width: 980px; margin: 0 auto; padding: 18px 24px 40px; }
.page-title{ text-align:center; font-weight:800; font-size:24px; margin:6px 0 16px; }

.card{
  background:#fff; border:1px solid #e5e7eb; border-radius:16px;
  padding:22px 22px 24px; margin:16px 0; box-shadow:0 8px 24px rgba(0,0,0,.06);
  position:relative;
}
.stretched-link{ position:absolute; inset:0; border-radius:16px; z-index:1; }
.card :where(a:not(.stretched-link),button){ position:relative; z-index:2; }

.section-title{ text-align:center; font-size:20px; font-weight:800; margin:30px 0 6px; color:#111827; margin-top: 60px;}
.name{ text-align:center; font-size:28px; font-weight:900; letter-spacing:.08em; margin:4px 0 2px; }
.kana{ text-align:center; color:#6b7280; margin-bottom:10px; }

.rows{ list-style:none; padding:0; margin:16px 0 22px; }
.rows li{ display:grid; grid-template-columns: 120px 1fr; gap:10px; padding:14px 0; border-bottom:1px solid #e5e7eb; }
.rows .hd{ color:#374151; font-weight:500; }
.rows .bd{ color:#111827; white-space:pre-wrap; }

.talk-cta{ display:flex; justify-content:center; margin:50px 0; }
.btn-talk{
  min-width: 320px; height: 48px; border:none; border-radius:999px;
  background:#0ea5e9; color:#fff; font-weight:800; font-size:16px; cursor:pointer;
  /* box-shadow:0 8px 24px rgba(14,165,233,.35); */
}
.btn-talk:hover{ filter:brightness(1.05); }

.page-sectitle {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 10px;
    line-height: 1.4;
    padding-top: var(--padding-xl);
}

.good-name {
    text-align: center;
    font-size: 23px;
    font-weight: 700;
    padding-bottom: 3px;
    line-height: 1.4;
}
	   .good-kana{
    text-align: center;
    font-size: 12px;
    padding-bottom: 32px;
}

span.foot-nav-ico {
    width: 34%;
}
	span.foot-nav-ico {
    width: 40px;
    margin: 0 auto;
    display: block;
}

/* ボタン本体：中央寄せ＋左にアイコン用の余白 */
.btn-talk{
  position: relative;
  display: inline-flex;               /* 高さ中央揃え */
  align-items: center;
  justify-content: center;            /* ラベルを中央へ */
  min-width: 320px;
  height: 52px;
  padding: 0 24px 0 64px;
  border: none;
  border-radius: 999px;
  background:#0ea5e9;
  color:#fff;
  font-weight:800;
  font-size:16px;
  cursor:pointer;
  /* box-shadow:0 8px 24px rgba(14,165,233,.35); */
}
.btn-talk:hover{ filter:brightness(1.05); }

/* トークアイコン */
.btn-talk .foot-nav-ico{
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-talk .foot-nav-ico img{
  width: 40px;
  height: 40px;
  display: block;
}

/* テキストは“厳密に中央”に配置 */
.btn-talk .btn-label{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  line-height: 1;
}

</style>
