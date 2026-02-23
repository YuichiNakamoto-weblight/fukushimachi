<!-- src/components/talk/TalkPanel.vue -->
<!-- トーク用コンポーネント -->
<template>
  <div class="talk-page" >
  <div class="talk-wrap">
    <!-- <AppHeader /> -->
    <!-- <HamburgerMenu /> -->
    <!-- <FooterNav /> -->
    <!-- ヘッダー -->
      <header class="talk-header">
        <button
          type="button"
          class="back-link"
          @click="goBack"
        >
          <span class="chev">＜</span>
          <div class="labels">
            <div class="title">{{ headerTitle }}</div>
            <div v-if="subTitle" class="sub">{{ subTitle }}</div>
          </div>
        </button>
      </header>

    <!-- 本文 -->
    <div class="talk-body" ref="scrollEl">
      <template v-for="(m,i) in messages" :key="m.id">
        <!-- 同日で一回だけ日付(曜日) -->
        <div v-if="i===0 || messages[i-1].date_key !== m.date_key" class="day-sep">
          {{ m.date_label }}
        </div>

        <!-- 吹き出し：横は“時刻のみ + 既読(自分の送信のみ)” -->
        <div class="msg-row" :class="rowClass(m)">
          <div class="time-left">
            <span class="hm">{{ m.hm }}</span>
            <span v-if="isMyMessage(m) && Number(m.read_flag) === 1" class="read-flag">既読</span>
          </div>
          <div class="bubble" :class="colorClass(m)">
            <!-- URLをリンクにしたHTML文字列を出力 -->
            <div class="text" v-html="renderBody(m.body)" />
          </div>
        </div>
      </template>
    </div>

    <form class="talk__input" @submit.prevent action="#" id="talkForm">
      <div class="talk__fieldWrap">
        <textarea
          class="talk__field"
          ref="ta"
          v-model="draft"
          rows="1"
          placeholder=""
          aria-label="メッセージを入力"
          :disabled="sending"
          enterkeyhint="enter"
          @input="autoGrow"
          style="height:46px; overflow-y:auto;"
        />
        <!-- <button type="button" class="talk__mic" id="talkMic" aria-label="音声入力を開始">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"></path>
            <path d="M19 11a7 7 0 0 1-14 0M12 18v4"></path>
          </svg>
          <span class="sr-only">音声入力</span>
        </button> -->
      </div>

      <!-- 紙飛行機送信ボタン -->
      <button
        type="submit"
        class="talk__submit"
        id="talkSubmit"
        aria-label="送信"
        :disabled="sending || !draft.trim()"
        @click="send"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M22 2 11 13"></path>
          <path d="M22 2 15 22 11 13 2 9 22 2z"></path>
        </svg>
        <span class="sr-only">送信</span>
      </button>
    </form>

    <!-- ▼ 入力欄の“下”にテンプレトリガ画像を配置 -->
    <div class="btn-talk-tpi">
      <TalkTemplates :role="role" @paste="onTplPaste" />
    </div>
  </div>
  <!-- <AppFooter /> -->
</div>
<!-- <PcModel /> -->
</template>



<script setup>
// import { onMounted, onBeforeUnmount, ref, nextTick, watch } from 'vue'
import { onMounted, onBeforeUnmount, ref, nextTick, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/http'
import TalkTemplates from '@/components/talk/TalkTemplates.vue'
import { useTalkDrafts } from '@/stores/talkDrafts'

// import AppHeader from '@/components/layout/AppHeader.vue'
// import AppFooter from '@/components/layout/AppFooter.vue'
// import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
// import FooterNav from '@/components/layout/FooterNav.vue'
// import PcModel from '@/components/layout/PcModel.vue'

function pingBadges () {
  try {
    localStorage.setItem('badgePing', String(Date.now()))
  } catch (e) {
    console.error(e)
  }
  window.dispatchEvent(new CustomEvent('badge:ping'))
}

const props = defineProps({
  threadId:    { type: Number, required: true },
  role:        { type: String, required: true }, // 'seeker' | 'employer'
  userId:      { type: Number, required: true }, // ← users.id を渡す
  headerTitle: { type: String, required: true },
  subTitle:    { type: String, default: '' },
  backTo:      { type: String, default: '' },
  jobId:       { type: Number, default: 0 }
})

// const route  = useRoute()
const router   = useRouter()
const messages = ref([])
const sending  = ref(false)
const draft    = ref('')
const scrollEl = ref(null)
const ta       = ref(null)

/* ===== ドラフト保存（Pinia） ===== */
const draftStore = useTalkDrafts()
const DRAFT_KEY = computed(() =>
  `talk:${props.role}:${props.userId}:${props.threadId}`
)

// 軽いデバウンス（タイプごとに毎回書き込まない）
 /** @type {number|null} */
 let draftTimer = null
function saveDraftSoon () {
  if (draftTimer !== null) window.clearTimeout(draftTimer)
  draftTimer = window.setTimeout(() => {
    draftStore.set(DRAFT_KEY.value, draft.value)
  }, 150)
}

// 初期復元
onMounted(() => {
  const saved = draftStore.get(DRAFT_KEY.value)
  if (saved) {
    draft.value = saved
    nextTick(autoGrow)
  }
})

// draft が変わるたび Pinia に保存
watch(draft, () => {
  saveDraftSoon()
  nextTick(autoGrow)
})

// threadId 等が変わった（同じコンポーネントのまま props 切替）場合も復元
watch(DRAFT_KEY, () => {
  draft.value = draftStore.get(DRAFT_KEY.value) || ''
  nextTick(autoGrow)
})

/* ===== 自動スクロール制御（上を見ている時は位置維持） ===== */
const stickToBottom = ref(true)          // 下付近にいるときのみ自動スクロール
const NEAR_BOTTOM_PX = 80                // “下付近”の判定しきい値(px)

function isNearBottom (el) {
  if (!el) return true
  return (el.scrollHeight - el.scrollTop - el.clientHeight) <= NEAR_BOTTOM_PX
}
function onBodyScroll () {
  const el = scrollEl.value
  if (!el) return
  stickToBottom.value = isNearBottom(el)
}

const toDateKey = (src) => {
  const s = String(src || '')
  const m = s.match(/^(\d{4})[/-](\d{2})[/-](\d{2})/)
  if (m) return `${m[1]}-${m[2]}-${m[3]}`
  const d = new Date(src)
  if (!Number.isNaN(+d)) {
    const y = d.getFullYear(), mm = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0')
    return `${y}-${mm}-${dd}`
  }
  return ''
}
const toHM = (primary, fallback) => {
  const s = String(primary || '')
  const mm = s.match(/\b(\d{2}:\d{2})\b/)
  if (mm) return mm[1]
  const d = new Date(primary || fallback)
  if (!Number.isNaN(+d)) return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  return ''
}
const weekdayJa = ['日','月','火','水','木','金','土']
const toDateLabel = (dateKey) => {
  const d = new Date(dateKey)
  if (!Number.isNaN(+d)) {
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0')
    return `${y}/${m}/${dd} (${weekdayJa[d.getDay()]})`
  }
  return dateKey.replaceAll('-', '/')
}

function isMyMessage(m){ return m.sender_type === props.role && m.sender_id === props.userId }
function rowClass(m){    return isMyMessage(m) ? 'me' : 'you' }
function colorClass(m){
  if (props.role === 'employer') return isMyMessage(m) ? 'employer' : ''
  return m.sender_type === 'seeker' ? 'seeker' : ''
}

/* ===== 取得＆既読処理（視点維持ロジック付き） ===== */
let loadingNow = false
async function load () {
  if (loadingNow) return
  loadingNow = true
  try {
    const el = scrollEl.value
    // 読み込み前の視点情報を記録
    const shouldStick = stickToBottom.value
    const prevBottomOffset = el ? (el.scrollHeight - el.scrollTop - el.clientHeight) : 0

    const res = await http.get(`/talks/${props.threadId}/messages`, { params: { page: 1, size: 200 } })
    const items = Array.isArray(res?.data?.items) ? res.data.items : []

    messages.value = items.map(r => {
      const date_key = toDateKey(r.created_at || r.created_hm)
      const hm       = toHM(r.created_hm, r.created_at)
      return {
        ...r,
        body: r.body ?? r.message ?? '',
        date_key,
        date_label: toDateLabel(date_key),
        hm,
        read_flag: r.read_flag ?? r.is_read ?? 0,
      }
    })

    // 既読化（サーバ側で readerId を推定する版）
    await http.post(`/talks/${props.threadId}/read`, { readerType: props.role }).catch(() => {})

    // 未読バッジ更新を通知
    pingBadges()

    // 下付近なら最下部へ、それ以外は視点維持
    requestAnimationFrame(() => {
      const el2 = scrollEl.value
      if (!el2) return
      if (shouldStick) {
        el2.scrollTop = el2.scrollHeight
      } else {
        const newTop = el2.scrollHeight - el2.clientHeight - prevBottomOffset
        el2.scrollTop = Math.max(0, newTop)
      }
    })
  } finally {
    loadingNow = false
  }
}

function goBack () {
  if (props.backTo) {
    try { router.push(props.backTo) } catch { window.location.assign(props.backTo) }
    return
  }
  const raw = localStorage.getItem('userType')
  const isEmployer = (raw === 'employer') || (props.role === 'employer')
  const target = isEmployer ? { name: 'BizTalkList' } : { name: 'MyTalks' }
  try { router.push(target) } catch { window.location.assign(isEmployer ? '/biz/talks' : '/jobs/talks') }
}


function autoGrow(){
  const el = ta.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

watch(draft, () => nextTick(autoGrow))
onMounted(() => nextTick(autoGrow))

async function send(){
  if (!draft.value.trim()) return
  sending.value = true
  try {
    // 送信時は新着を見せるため下へ張り付く
    stickToBottom.value = true

    console.log('props.threadId:',props.threadId)
    console.log('props.role:',props.role)
    console.log('props.userId:',props.userId)
    console.log('draft.value:',draft.value)
    await http.post(`/talks/${props.threadId}/messages`, {
      senderType: props.role,
      senderId:   props.userId,   // ← users.id を渡す
      body:       draft.value.trim(),
    })
    draft.value = ''              // 送信後は入力欄を空に
    draftStore.clear(DRAFT_KEY.value) // ストア側もクリア
    await load()
    pingBadges()
  } finally {
    sending.value = false
    nextTick(autoGrow)
  }
}

/* ===== 5秒ポーリング ===== */
let timer = 0
function startPolling () {
  stopPolling()
  timer = window.setInterval(() => {
    if (document.visibilityState === 'visible') load()
  }, 5000)
}
function stopPolling () {
  if (timer) { clearInterval(timer); timer = 0 }
}
function onFocus () { load() }
function onVisibility () { if (document.visibilityState === 'visible') load() }

onMounted(async () => {
  await load()
  startPolling()
  window.addEventListener('focus', onFocus)
  document.addEventListener('visibilitychange', onVisibility)

  // スクロール位置監視（stickToBottom を更新）
  scrollEl.value?.addEventListener('scroll', onBodyScroll, { passive: true })
})
onBeforeUnmount(() => {
  stopPolling()
  window.removeEventListener('focus', onFocus)
  document.removeEventListener('visibilitychange', onVisibility)
  scrollEl.value?.removeEventListener('scroll', onBodyScroll)
})

// function onTplPaste(text) {
//   const base = (draft.value || '').replace(/\s+$/,'')
//   draft.value = base ? `${base}\n${text}` : text
//   nextTick(() => {
//     ta.value?.focus()
//     autoGrow()
//   })
// }

function insertAtCursor(text) {
  const el = ta.value
  // テキストエリアが未マウントなどの保険：末尾に追加
  if (!el) {
    draft.value = (draft.value || '') + text
    nextTick(autoGrow)
    return
  }

  // 現在のキャレット/選択範囲を取得
  const start = el.selectionStart ?? draft.value.length
  const end   = el.selectionEnd   ?? draft.value.length

  // 前後で分割して差し込み（選択範囲があれば置換）
  const before = draft.value.slice(0, start)
  const after  = draft.value.slice(end)
  draft.value  = before + text + after

  // キャレットを挿入文字列の直後へ移動 & オートリサイズ
  nextTick(() => {
    const pos = start + text.length
    el.focus()
    // iOS/Safari対応も含め setSelectionRange を明示
    try { el.setSelectionRange(pos, pos) } catch {console.log}
    autoGrow()
  })
}

function onTplPaste(text) {
  // 純粋に「その場所に」挿入したい場合はそのまま
  insertAtCursor(text)

  // もし「常に改行して挿入」したい場合は下のような形に変更
  // insertAtCursor((draft.value && !draft.value.endsWith('\n') ? '\n' : '') + text)
}

// ===== テキスト内のURLをリンクに変換 =====
const urlRegex = /(https?:\/\/[^\s<>"']+)/g

function escapeHtml (str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * 本文のプレーンテキストを
 * - HTMLエスケープ
 * - https?://〜 を <a>リンク に変換
 * した文字列にして返す
 */
function renderBody (body) {
  const escaped = escapeHtml(body ?? '')

  return escaped.replace(urlRegex, (match) => {
    // href 用はダブルクォートだけエスケープ
    const href = match.replace(/"/g, '&quot;')
    const label = match // 表示文字列はそのまま
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
  })
}

</script>


<style scoped>
.talk-page{ min-height:100dvh; display:flex; flex-direction:column; }
.talk-wrap{
  display:flex;
  flex-direction:column;
  height: calc(100dvh - 10px);   /* ← もとの 140px から小さくして高さアップ */
}
/* モバイルのアドレスバー対策（対応端末で優先） */
@supports (height: 100svh) {
  .talk-wrap{
    height: calc(100svh - 10px);
  }
}
/* header */
.talk-header{ padding:10px 12px; border-bottom:1px solid #eee; background:#fff }
.back-link{
  display:flex; align-items:center; gap:10px; width:100%;
  background:transparent; border:none; padding:6px 4px; cursor:pointer; text-align:left;
}
.back-link:hover .title{ text-decoration:underline; }
.chev{ font-weight:700; font-size:18px; line-height:1; }
.labels .title{ font-size:16px; font-weight:700; }
.labels .sub{ color:#666; font-size:12px; margin-top:2px; }

/* body */
.talk-body{ flex:1; overflow:auto; padding:12px; background:#f7f7f7 }

/* === 日付（中央＆枠付きピル）=== */
.day-sep{
  display:block;
  width:fit-content;
  margin:16px auto 10px;         /* 左右中央配置 */
  padding:4px 10px;
  background:#fff;
  border:1px solid #e5e7eb;      /* 枠 */
  border-radius:999px;           /* pill */
  color:#666;
  font-size:12px;
  line-height:1.6;
}

/* rows */
.msg-row{ display:flex; align-items:flex-end; gap:8px; margin:8px 0 }
.msg-row.me{ justify-content:flex-end }
.msg-row.you{ justify-content:flex-start }

/* 相手：吹き出しの右に時刻 */
.msg-row.you .bubble{ order:1; }
.msg-row.you .time-left{ order:2; text-align:left; margin-left:6px; align-items:flex-start; }

/* 自分：吹き出しの左に時刻 */
.msg-row.me .time-left{ order:1; text-align:right; margin-right:6px; align-items:flex-end; }
.msg-row.me .bubble{ order:2; }

/* time（既読は“上”、太字解除） */
.time-left{
  display:flex;
  flex-direction:column;         /* 縦並び：既読 → 時刻 */
  gap:2px;
  min-width:56px; flex:0 0 auto;
  font-size:11px; color:#666;
  text-align:right;
}
.time-left .hm{ letter-spacing:0.2px; }
.read-flag{
  color:#0aa;
  font-weight:400;               /* 太字解除 */
  order:-1;                      /* ← 既読を時刻の上に */
}

/* bubbles */
.bubble{
  --bg:#fff;
  position:relative;
  max-width:72%;
  padding:10px 12px;
  border-radius:14px;
  box-shadow:0 1px 2px rgba(0,0,0,.06);
  background:#fff;
}
.seeker{ background:#ffe9d9; --bg:#ffe9d9; }
.employer{ background:#e6f0ff; --bg:#e6f0ff; }
.text{ white-space:pre-wrap; word-break:break-word }

/* 吹き出しの“尖り”（上寄せ＆斜め上） */
.msg-row.you .bubble::after,
.msg-row.me  .bubble::after{
  content:"";
  position:absolute;
  background:var(--bg);
  width:16px; height:22px;
  top:6px;
}
.msg-row.you .bubble::after{
  left:-12px;
  clip-path: polygon(0 12%, 100% 0, 100% 70%);
}
.msg-row.me .bubble::after{
  right:-12px;
  clip-path: polygon(100% 12%, 0 0, 0 70%);
}

/* input */
.talk-input{ display:flex; gap:10px; padding:10px; border-top:1px solid #eee; background:#fff }
.talk-input textarea{ flex:1; resize:none; padding:10px 12px; border:1px solid #ddd; border-radius:8px; min-height:44px; }
.talk-input .btn{ flex:0 0 110px; padding:10px 14px; border:none; border-radius:8px; background:#333; color:#fff; cursor:pointer }
.talk-input .btn:disabled{ opacity:.5; cursor:not-allowed }

.talk-input textarea{
  flex:1;
  resize:none;
  padding:10px 12px;
  border:1px solid #ddd;
  border-radius:8px;
  min-height:44px;
  max-height:160px;
  overflow:auto;
}
.talk-input .btn{
  flex:0 0 110px;
  padding:10px 14px;
  border:none;
  border-radius:8px;
  background:#333;
  color:#fff;
  cursor:pointer;
}

.tpl-trigger{ margin-bottom: 10px; }

.talk__fieldWrap{
  display: flex; align-items: center; gap: 8px;
}

/* スマホ：入力時ズーム防止 + 送信ボタンを真円に */
@media (max-width: 768px){
  .talk__field{
  font-size: 16px;               /* ← ズーム防止。必ず 16px 以上に */
  line-height: 1.4;
  width: 100%;
  resize: none;                 /* つまみでの手動リサイズ無効 */
  max-height: 160px;            /* autoGrow の上限と合わせる */
  overflow-y: auto;             /* 超えたら縦スクロール */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
  -webkit-overflow-scrolling: touch; /* iOSでスムーズスクロール */
}

  /* 既存の最小高さは維持 */
  .talk__submit, .talk__mic{ min-height:44px; }

  /* 送信ボタンだけ正方形 + 真円にする */
  .talk__submit{
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    padding: 0;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .talk__submit svg{
    width: 22px;
    height: 22px;
  }
}

 /* v-html で差し込まれたリンクの見た目 */
 .text :deep(a) {
   color: rgb(41, 34, 243);                 /* 好きな色に */
   text-decoration: underline;  /* 下線 */
   word-break: break-all;       /* 長いURLの折り返し */
 }

 .text :deep(a:hover) {
   text-decoration: underline;
   opacity: 0.8;
 }

/* 改行を“バブル全体”で保持＋折返しを許可 */
.talk-body .bubble {
  white-space: pre-wrap !important;  /* \n を改行として描画 */
  word-break: break-word;
  overflow-wrap: anywhere;
  min-width: 0; /* iOS Safari の flex 周りの改行崩れ対策 */
}

/* 子要素が white-space を上書きしても継承させる */
.talk-body .bubble * {
  white-space: inherit !important;
}

@media (max-width: 768px) {
  .talk-body .bubble {
    white-space: pre-wrap !important;
  }
}

.talk-body .msg-row { min-width: 0; }
.talk-body .bubble  { min-width: 0; max-width: 100%; }


</style>
