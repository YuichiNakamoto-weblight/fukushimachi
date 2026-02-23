<!-- src/views/Seekers/SeekerTalkListpage.vue -->
<!-- 求職者用トーク一覧 -->
<template>
  <body class="is-user is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main class="biz-talk-list">
        <section class="l-sec">
          <div class="page-title maru">トーク一覧</div>

          <div v-if="loading" class="loading">読み込み中…</div>
          <div v-else-if="items.length === 0" class="empty">トークはまだありません。</div>

<ul class="cards">
  <li v-for="t in items" :key="t.id" class="card-wrap">
    <!-- クリック領域：カード本体 -->
    <div
      class="card"
      :class="{ unread: t.unreadCount > 0 }"
      @click="openThread(t.id, t.job_information_id)"
      role="button"
      tabindex="0"
      @keydown.enter.prevent="openThread(t.id, t.job_information_id)"
      @keydown.space.prevent="openThread(t.id, t.job_information_id)"
    >
      <div class="meta">
        <span v-if="t.employment_type_name" class="badge">{{ t.employment_type_name }}</span>
        <span class="dim">
          {{ t.job_position_name || '-' }} ／ {{ t.facility_name || '-' }}
        </span>
        <span v-if="t.unreadCount > 0" class="badge-dot">{{ t.unreadCount }}</span>
      </div>

      <h3 class="title">{{ t.job_title || '-' }}</h3>

      <div class="last">
        <span class="time">{{ t.last_hm || '' }}</span>
        <span class="snippet" :title="t.last_snippet">{{ t.last_snippet || '…' }}</span>
      </div>
    </div>

    <!-- 枠外のアクション行：カードの外に出す -->
    <div class="actions-outside">
      <button
        v-if="t.job_information_id > 0"
        class="btn-detail"
        type="button"
        @click="goJobDetail(t.job_information_id)"
        aria-label="求人詳細を開く"
      >
        求人詳細
      </button>
    </div>
  </li>
</ul>
          <div class="btn-back">
            <a href="/" @click.prevent="goTop">
              <span class="ico">
                <img src="/src/assets/images/common/ico-back.svg" alt="">
              </span>
              <span class="txt">TOPへ戻る</span>
            </a>
          </div>
                <!-- <div class="btn-back">
                  <a href="#" onclick="history.back()" return="false;=">
                    <span class="ico">
                      <img src="/src/assets/images/common/ico-back.svg">
                    </span>
                    戻る
                  </a>
                </div> -->
        </section>
      </main>

      <AppFooter />
    </div>
  </body>

  <!-- 背景など（既存レイアウトに合わせてそのまま） -->
  <!-- <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt="">
  </div>

  <div class="hero-copy pc">
    <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」"></a>
    </h1>

    <h1 class="sitelogo user-content">
      <a href="/user"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」"></a>
    </h1>
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

const router  = useRouter()
const items   = ref([])
const loading = ref(false)
const firstLoaded = ref(false)
const lastSnapshot = ref('') // 直近の一覧スナップショット(JSON)

/* 求職者の users.id を取得 */
function readSeekerId () {
  try {
    const picks = [
      localStorage.getItem('userId'),
      sessionStorage.getItem('userId'),
      localStorage.getItem('auth_user'),
      sessionStorage.getItem('auth_user'),
    ]
    for (const v of picks) {
      if (!v) continue
      if (/^\s*\d+\s*$/.test(v)) return Number(v)
      try {
        const o = JSON.parse(v)
        const n = Number(o?.id ?? o?.userId ?? o?.user?.id)
        if (Number.isFinite(n) && n > 0) return n
      } catch { /* JSON でない → 次へ */ }
    }
  } catch { /* storage 読み取り失敗 */ }
  return 0
}
const SEEKER_ID = readSeekerId()

function normalizeRow (r = {}) {
  const s = (v) => (v == null ? '' : String(v))

  // 本文候補を広く拾う（HTMLは除去・<br>は改行扱い）
  const candidates = [
    r.last_body, r.body,
    r.last_message_body, r.lastMessageBody,
    r.last_message, r.lastMessage,
    r.message, r.text, r.last_text,
    r.last_snippet, r.lastSnippet, r.snippet,
  ]
  let raw = ''
  for (const c of candidates) {
    const t = s(c)
      .replace(/<br\s*\/?>/gi, '\n')  // <br> → 改行
      .replace(/<[^>]+>/g, '')        // タグ除去
      .trim()
    if (t) { raw = t; break }
  }

  // 1行化
  let bodyLine = raw.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()

  // まだ空ならタイプから最小限のフォールバック（なければ空のまま）
  if (!bodyLine) {
    const type = s(r.last_type ?? r.type ?? r.lastMessageType ?? '')
    if (type === 'image') bodyLine = '[画像]'
    else if (type === 'file' || type === 'document') bodyLine = '[ファイル]'
    // ↑ それ以外は空のまま（[新規] はやめる）→ 事業者側に近い挙動
  }

  // 最終メッセージ時刻（キー揺れ対応）
  const ts =
    r.last_message_at ?? r.lastMessageAt ??
    r.updated_at ?? r.updatedAt ??
    r.created_at ?? r.createdAt
  const lastMs = ts ? new Date(ts).getTime() : 0

  const employmentLabel =
    s(r.employment_type_name ?? r.employment_type_label ?? r.employment_type)
  const positionLabel =
    s(r.job_position_name ?? r.position_label ?? r.position_name)

  const unread = Number(r.unread_count ?? r.unreadCount ?? 0) || 0

  return {
    id: Number(r.id) || 0,
    job_information_id: Number(r.job_information_id ?? r.job_id) || 0,
    last_message_at_ms: lastMs,

    job_title:     s(r.job_title ?? r.title),
    facility_name: s(r.facility_name ?? r.business_name),

    employment_type_label: employmentLabel,
    position_label:        positionLabel,
    employment_type_name:  employmentLabel,
    job_position_name:     positionLabel,

    last_hm:      s(r.last_hm),
    last_body:    bodyLine,
    last_snippet: bodyLine,   // ← 事業者側と同様に本文1行化をそのまま表示

    unread_count: unread,
    unreadCount:  unread,
  }
}


/* 初回だけスピナー、以降はサイレント更新。本文なし除外は行わない */
async function load (silent = false) {
  if (!firstLoaded.value && !silent) loading.value = true
  try {
    const { data } = await http.get('/talks/threads', {
      params: { role: 'seeker', userId: SEEKER_ID },
    })
    const rows   = Array.isArray(data?.items) ? data.items.filter(Boolean) : []
    const mapped = rows.map(normalizeRow)

    // 事業者側は求人単位で集約しますが、求職者側はそのまま最新順でOK
    const nextItems = mapped.sort((a, b) => (b.last_message_at_ms - a.last_message_at_ms))

    // 同一内容なら描画更新しない（DOM揺れ防止）
    const snap = JSON.stringify(nextItems)
    if (snap !== lastSnapshot.value) {
      items.value = nextItems
      lastSnapshot.value = snap
    }
    firstLoaded.value = true
  } catch (e) {
    console.error('[SeekerTalkList] load error:', e)
    if (!firstLoaded.value) items.value = []
  } finally {
    if (!silent) loading.value = false
  }
}

function openThread (threadId, jobId) {
  console.log('jobId:',jobId)
  if (!threadId) return
  router.push({
    name: 'SeekerTalk',
    params: { threadId },
    query:  { jobId }        // ← ここで同送
  })
}

function goJobDetail (jobId) {
  if (!jobId) return
  try {
    router.push({ name: 'JobDetail', params: { id: jobId } })
  } catch {
    // フォールバック：/jobs/:id 直指定
    router.push(`/jobs/${jobId}`)
  }
}


/* 5秒ポーリング & フォーカス即時更新（サイレント） */
let pollTimer = 0
function startPolling () {
  stopPolling()
  pollTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible') load(true)
  }, 5000)
}
function stopPolling () {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = 0
  }
}
function onFocus () { load(true) }

onMounted(() => {
  load(false) // 初回だけスピナー
  startPolling()
  window.addEventListener('focus', onFocus)
})
onBeforeUnmount(() => {
  stopPolling()
  window.removeEventListener('focus', onFocus)
})

function goTop () {
  // ルーター経由で TOP へ。失敗時はロケーションでフォールバック
  try {
    router.push({ path: '/' })
  } catch {
    window.location.href = '/'
  }
}

</script>



<style scoped>
.biz-talk-list { max-width: 900px; margin: 0 auto; padding: 16px 14px 40px; }
.page-title   { text-align: center; font-size: 24px; margin: 10px 0 18px; }

.loading, .empty { text-align:center; color:#666; padding:24px 0; }

.cards { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:14px; }
.card  {
  position: relative;
  padding: 14px 16px 12px;
  border-radius: 14px;
  background: #f7f7f7;
  box-shadow: 0 1px 0 rgba(0,0,0,.04) inset;
  cursor: pointer;
  transition: background-color .15s ease;
}
.card:hover { background: #f1f5f9; }
.card.unread { background: #e8f5ff; } /* 未読：水色 */

.meta { display:flex; align-items:center; gap:10px; margin-bottom: 8px; }
.badge{
  display:inline-block; padding:2px 8px; font-size:12px; border-radius:999px;
  background:#2b6cb0; color:#fff; font-weight:700;
}
.dim { color:#6b7280; font-size:12px; }

.badge-dot{
  margin-left:auto;
  min-width: 18px; height:18px; line-height:18px;
  border-radius: 999px; text-align:center; font-size:12px; font-weight:700;
  background:#ef4444; color:#fff; padding:0 5px;
}

.title { font-size:18px; font-weight:800; margin: 2px 0 10px; }

.last {
  display:flex; align-items:center; gap:10px;
  background:#fff; border-radius:999px; padding:6px 10px;
}
.time { color:#111827; font-weight:700; font-variant-numeric: tabular-nums; }
.snippet { color:#6b7280; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.actions { margin-top: 12px; display: flex; justify-content: flex-end; }

/* 既存 .cards / .card は流用 */
.cards { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:18px; }

/* ラッパー（1アイテム分） */
.card-wrap { display:block; }

/* カード本体（既存） */
.card { position:relative; padding:14px 16px 12px; border-radius:14px; background:#f7f7f7;
        box-shadow:0 1px 0 rgba(0,0,0,.04) inset; cursor:pointer; transition:background-color .15s ease; }
.card:hover { background:#f1f5f9; }
.card.unread { background:#e8f5ff; }

/* 枠外アクション行：中央寄せに変更 */
.actions-outside {
  display: flex;
  justify-content: center;   /* ← 中央配置 */
  padding: 10px 0 0;
}

/* ボタンの見た目はそのまま。中央に置きやすいよう inline-flex 推奨 */
.btn-detail {
  appearance: none;
  display: inline-flex;       /* ← 中央配置との相性◎ */
  align-items: center;
  gap: 6px;
  border: 0;
  padding: 10px 46px;
  border-radius: 12px;
  font-weight: 700;
  background: #2563eb;
  color: #fff;
  box-shadow: 0 1px 0 rgba(0,0,0,.06);
  cursor: pointer;
}
.btn-detail:hover { filter: brightness(1.05); }
.btn-detail:active { transform: translateY(1px); }



</style>
