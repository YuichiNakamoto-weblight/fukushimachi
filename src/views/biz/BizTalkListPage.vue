<!-- src/views/biz/BizTalkListPage.vue -->
<!-- 事業者用トーク一覧 -->
<template>
  <body class="is-employer is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main class="biz-talk-list">
        <section class="l-sec">
          <div class="page-title maru">トーク一覧</div>

          <div v-if="loading" class="loading">読み込み中…</div>
          <div v-else-if="items.length === 0" class="empty">トークはまだありません。</div>

          <ul v-else class="cards">
            <li
              v-for="t in items"
              :key="t.id"
              class="card"
              :class="{ unread: t.unreadCount > 0 }"
              @click="openThread(t.id)"
            >
              <div class="meta">
                <span v-if="t.employment_type_name" class="badge">{{ t.employment_type_name }}</span>
                <span class="dim">
                  {{ t.job_position_name || '-' }} ／ {{ t.facility_name || '-' }}
                </span>
                <span v-if="t.unreadCount > 0" class="badge-dot">{{ t.unreadCount }}</span>
              </div>

              <h3 class="title">{{ t.job_title || '-' }}</h3>

              <!-- 相手（求職者） -->
              <div class="partner" v-if="t.seeker_name || t.seeker_user_id">
                <span class="icon"></span>
                <span class="name">ユーザー名： {{ t.seeker_name || `応募者ID:${t.seeker_user_id}` }}さん</span>
              </div>

              <div class="last">
                <span class="time">{{ t.last_hm || '' }}</span>
                <span class="snippet" :title="t.last_snippet">{{ t.last_snippet || '…' }}</span>
              </div>
            </li>
          </ul>
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

  <!-- <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt />
  </div>

  <div class="hero-copy pc">
    <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。" />
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」" />
      </a>
    </h1>

    <h1 class="sitelogo user-content">
      <a href="/user">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」" />
      </a>
    </h1>

    <h1 class="sitelogo employer-content">
      <a href="/employer">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」" />
      </a>
    </h1>
  </div>

  <div class="pc">
    <div class="user-content login-content">
      <div class="mypage-link">
        <a href="/user/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ" />
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <a href="/employer/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ" />
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>
  </div> -->
    <PcModel />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/http'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()
const items = ref([])
const loading = ref(false)
const firstLoaded = ref(false)
const lastSnapshot = ref('') // 直近の一覧スナップショット(JSON)

// ★ 追加：求職者氏名キャッシュ（user_id → "姓名"）
const seekerNameCache = new Map()

/* 認証ID取得（既存のまま） */
function readEmployerId() {
  try {
    const picks = [
      localStorage.getItem('userId'),
      sessionStorage.getItem('userId'),
      localStorage.getItem('auth_user'),
      sessionStorage.getItem('auth_user')
    ]
    for (const v of picks) {
      if (!v) continue
      if (/^\s*\d+\s*$/.test(v)) return Number(v)
      try {
        const o = JSON.parse(v)
        const n = Number(o?.id ?? o?.userId ?? o?.user?.id)
        if (Number.isFinite(n) && n > 0) return n
      } catch {
        continue
      }
    }
  } catch {
    return 0
  }
  return 0
}
const EMPLOYER_ID = readEmployerId()

/* 未読バッチと背景色水色 + 必要な表示項目を正規化 */
function normalizeRow(r = {}) {
  const s = (v) => (v == null ? '' : String(v))
  const bodyLine = s(r.last_body).replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
  const ts = r.last_message_at ?? r.updated_at ?? r.created_at
  const lastMs = ts ? new Date(ts).getTime() : 0

  const employmentLabel = s(r.employment_type_name ?? r.employment_type_label ?? r.employment_type)
  const positionLabel = s(r.job_position_name ?? r.position_label ?? r.position_name)
  const unread = Number(r.unread_count ?? r.unreadCount ?? 0) || 0

  // ★ seeker の user_id を抽出（APIの多様な形に備え複数キーを考慮）
  const seekerUserId = Number(r.seeker_user_id ?? r.seeker_id ?? r.seeker?.user_id ?? r.user_id) || 0

  // ★ キャッシュにあれば即反映（初期描画のチラつきを防止）
  const cachedName = seekerNameCache.get(seekerUserId) || ''

  return {
    id: Number(r.id) || 0,
    job_information_id: Number(r.job_information_id ?? r.job_id) || 0,
    last_message_at_ms: lastMs,

    job_title: s(r.job_title ?? r.title),
    facility_name: s(r.facility_name ?? r.business_name),

    employment_type_label: employmentLabel,
    position_label: positionLabel,
    employment_type_name: employmentLabel, // 互換キー
    job_position_name: positionLabel, // 互換キー

    last_hm: s(r.last_hm),
    last_body: bodyLine,
    last_snippet: bodyLine,

    unread_count: unread,
    unreadCount: unread,

    // ★ ここが表示名：user_profiles の「姓 + 名」を入れる
    seeker_name: cachedName,
    seeker_user_id: seekerUserId
  }
}

/* ★ 厳密に user_profiles からフルネームを取得（キャッシュ対応） */
async function fetchSeekerFullNameStrict(uid) {
  if (!uid) return ''
  const cached = seekerNameCache.get(uid)
  if (cached != null) return cached

  try {
    const { data } = await http.get(`/seekers/profile/${uid}`)
    const p = data?.profile ?? data
    const sei = p?.name_sei ?? p?.user_sei ?? ''
    const mei = p?.name_mei ?? p?.user_mei ?? ''
    const full = `${sei}${mei}`.trim()
    seekerNameCache.set(uid, full) // 成功時キャッシュ
    return full
  } catch (e) {
    console.warn('[BizTalkList] profile fetch failed:', uid, e)
    seekerNameCache.set(uid, '') // 失敗も空でキャッシュして連続再試行を防止
    return ''
  }
}

/* ★ 一覧行の seeker_name をキャッシュを使って“直接”埋めるだけ（items は触らない） */
async function fillSeekerNamesStrict(list) {
  const uids = Array.from(new Set(list.map((t) => Number(t.seeker_user_id) || 0).filter(Boolean)))
  const missing = uids.filter((uid) => !seekerNameCache.has(uid))

  if (missing.length) {
    await Promise.allSettled(missing.map((uid) => fetchSeekerFullNameStrict(uid)))
  }
  // キャッシュ内容で list に直接反映
  for (const row of list) {
    const uid = Number(row.seeker_user_id) || 0
    row.seeker_name = uid ? seekerNameCache.get(uid) || '' : ''
  }
}

/* 取得 → 正規化 → “メッセージ無し”除外 → 求人ごとに最新1件へ集約
   ★ 氏名を先に埋めてからスナップショット比較 → 描画（チラつき防止） */
async function load(silent = false) {
  if (!firstLoaded.value && !silent) loading.value = true
  try {
    const { data } = await http.get('/talks/threads', {
      params: { role: 'employer', userId: EMPLOYER_ID }
    })
    const rows = Array.isArray(data?.items) ? data.items.filter(Boolean) : []
    const mapped = rows.map(normalizeRow)

    // 1) 本文の無いスレッドを除外
    const withBody = mapped.filter((x) => x.last_body)

    // 2) 求人×求職者（= スレッド）でユニーク化（同一スレッドが重複して返った場合に備え、最新だけ残す）
    const byThread = new Map()
    for (const r of withBody) {
      const key = r.id || `${r.job_information_id}:${r.seeker_user_id}`
      const cur = byThread.get(key)
      if (!cur || r.last_message_at_ms > cur.last_message_at_ms) {
        byThread.set(key, r)
      }
    }
    const nextItems = Array.from(byThread.values()).sort(
      (a, b) => b.last_message_at_ms - a.last_message_at_ms
    )

    // ★ 表示前に氏名を埋める（非同期取得 & キャッシュ利用）
    await fillSeekerNamesStrict(nextItems)

    // ★ 氏名込みの完成形でスナップショット比較
    const snap = JSON.stringify(nextItems)
    if (snap !== lastSnapshot.value) {
      items.value = nextItems
      lastSnapshot.value = snap
    }
    firstLoaded.value = true
  } catch (e) {
    console.error('[BizTalkList] load error:', e)
    if (!firstLoaded.value) items.value = []
  } finally {
    if (!silent) loading.value = false
  }
}

// function goBack() {
//   try {
//     router.back()
//   } catch {
//     router.push({ name: 'Jobs' })
//   }
// }

function goTop () {
  // ルーターでTOPへ（失敗時はロケーションでフォールバック）
  try {
    router.push({ path: '/' })
  } catch {
    window.location.href = '/'
  }
}


function openThread(threadId) {
  if (!threadId) return
  router.push({ name: 'EmployerTalk', params: { threadId } })
}

/* --- 5秒ポーリング & フォーカス即時更新（サイレント） --- */
let pollTimer = 0
function startPolling() {
  stopPolling()
  pollTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible') load(true) // サイレント
  }, 5000)
}
function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = 0
  }
}
function onFocus() {
  load(true)
}

onMounted(() => {
  load(false) // 初回だけスピナー
  startPolling()
  window.addEventListener('focus', onFocus)
})
onBeforeUnmount(() => {
  stopPolling()
  window.removeEventListener('focus', onFocus)
})
</script>

<style scoped>
.biz-talk-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px 14px 40px;
}
.page-title {
  text-align: center;
  font-size: 24px;
  margin: 10px 0 18px;
}

.loading,
.empty {
  text-align: center;
  color: #666;
  padding: 24px 0;
}

.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card {
  position: relative;
  padding: 14px 16px 12px;
  border-radius: 14px;
  background: #f7f7f7;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04) inset;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.card:hover {
  background: #f1f5f9;
}
.card.unread {
  background: #e8f5ff;
} /* 未読：水色 */

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 999px;
  background: #2b6cb0;
  color: #fff;
  font-weight: 700;
}
.dim {
  color: #6b7280;
  font-size: 12px;
}

.badge-dot {
  margin-left: auto;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 999px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  background: #ef4444;
  color: #fff;
  padding: 0 5px;
}

.title {
  font-size: 18px;
  font-weight: 800;
  margin: 2px 0 10px;
}

.last {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 999px;
  padding: 6px 10px;
}
.time {
  color: #111827;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.snippet {
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.partner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -4px -25px 8px;
  color: #374151;
}
.partner .icon {
  width: 18px;
  height: 18px;
}
.partner .icon img {
  display: block;
  width: 100%;
  height: 100%;
}
.partner .name {
  font-weight: 500;
  font-size: 14px;
  padding-left: 0px;
}
</style>
