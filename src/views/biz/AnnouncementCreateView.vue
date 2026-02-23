<!-- src/views/biz/AnnouncementCreateView.vue (完了画面付き) -->
 <!-- お知らせ作成 -->
<template>
  <body class="news-admin is-employer is-login">
    <div class="wrap">
    <AppHeader data-app-header />
    <HamburgerMenu />
    <FooterNav />

      <main class="l-sec mypage-detail">
          <div class="page-title maru">
            {{
              step === 'form'
                ? 'お知らせの新規登録'
                : step === 'confirm'
                  ? '登録内容をご確認ください。'
                  : 'あなたのお知らせがサイトに掲載されました。'
            }}
          </div>

          <div class="form-wrap">
            <div class="inner">
            <!-- ① 入力フォーム -->
            <form v-if="step === 'form'" class="form" @submit.prevent="toConfirm">
              <!-- タイトル -->
              <div class="form-items"></div>
                <div class="form-item">
                  <label class="form-label">お知らせタイトル（全角／30文字以内）</label>
                  <textarea
                    v-model="form.title"
                    rows="2"
                    class="input"
                    :class="{ 'is-error': titleError }"
                    placeholder=""
                    @input="noop"
                  ></textarea>
                  <div class="help">
                    文字数：{{ titleCount }} / 30
                    <span v-if="titleError" class="error">※ 30文字を超えています</span>
                  </div>
                </div>

                <!-- カテゴリー -->
                <!-- <div class="form-item">
                  <label class="form-label">カテゴリー</label>
                  <div class="checkbox-items">
                    <label v-for="c in filteredCategories" :key="c.id" class="checkbox">
                      <input type="radio" name="category" :value="c.id" v-model="form.category_id" />
                      <span>{{ c.name }}</span>
                    </label>
                  </div>
                </div> -->

                <!-- 本文 -->
                <div class="form-item">
                  <label class="form-label">お知らせ本文</label>
                  <textarea
                    v-model="form.body"
                    rows="8"
                    class="input"
                    placeholder="本文を入力してください"
                  ></textarea>
                </div>

                <!-- 概要 -->
                <div class="form-item">
                  <label class="form-label">自由記入欄</label>

                  <div v-for="(s, idx) in summaries" :key="s.uid" class="summary-card">
                    <div class="summary-head">
                      <div class="summary-no">項目{{ idx + 1 }}</div>
                      <div class="summary-actions">
                        <button type="button" class="btn-mini" @click="duplicateSummary(idx)">複製</button>
                        <button
                          type="button"
                          class="btn-mini -danger"
                          @click="removeSummary(idx)"
                          :disabled="summaries.length === 1"
                        >
                          削除
                        </button>
                      </div>
                    </div>

                    <div class="summary-body">
                      <div class="form-subitem">
                        <!-- <label class="form-sublabel">見出し</label> -->
                        <input v-model="s.heading" type="text" class="input" placeholder="例）開催場所" />
                      </div>
                      <div class="form-subitem">
                        <label class="form-sublabel">内容</label>
                        <textarea v-model="s.content" rows="3" class="input" placeholder="例）2025年◯月◯日"></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="summary-add">
                    <button type="button" class="btn-add" @click="addSummary">＋ 行を追加</button>
                  </div>
                </div>

                <!-- ボタンラベル -->
                <div class="form-item">
                  <label class="form-label">ボタンラベル</label>
                  <input v-model="form.button_label" type="text" class="input" placeholder="例）詳しくはこちら" />
                </div>

                <!-- ボタンURL -->
                <div class="form-item">
                  <label class="form-label">ボタンのリンク先URL</label>
                  <input v-model="form.button_url" type="url" class="input" placeholder="https://example.com/page" />
                  <div class="help">http(s) のURLを入力してください</div>
                </div>

                <!-- 掲載画像 -->
                <div class="form-item">
                  <div class="section-title">掲載画像</div>
                  <p>最大1点まで画像を掲載できます。以下の条件を満たす画像をアップロードしてください。</p>
                  <ul class="note indent file-note">
                    <li>・推奨サイズ：横幅1200px × 縦幅800px 以上（横長）</li>
                    <li>・著作権に問題のない画像のみご使用ください</li>
                    <li>・人物が写る場合は、事前に本人の同意を得てください</li>
                    <li>・過度な加工（フィルター等）はご遠慮ください</li>
                  </ul>

                  <div class="uploader" @dragover.prevent @drop.prevent="onDrop">
                    <div class="uploader-inner">
                      <svg class="uploader__icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M48 39a10 10 0 0 0-3.4-19.4A14 14 0 0 0 18 22a9 9 0 0 0-2 17.8"></path>
                        <polyline points="32 28 32 46"></polyline>
                        <polyline points="24 34 32 26 40 34"></polyline>
                      </svg>
                      <div>画像をドラッグ＆ドロップ</div>
                      <div>または</div>
                      <label class="btn-file">
                        ファイルを選択
                        <!-- 複数ファイル -->
                        <!-- <input type="file" accept="image/png,image/jpeg" multiple @change="onFilePick" hidden /> -->
                         <!-- ファイル1枚のみ -->
                        <input type="file" accept="image/png,image/jpeg" @change="onFilePick" hidden />
                      </label>
                      <span class="uploader__hint">JPG / PNG / JPEG（5MBまで）</span>
                    </div>
                  </div>

                  <div class="thumbs" v-if="files.length">
                    <div v-for="(f, i) in files" :key="f.uid" class="thumb">
                      <img :src="f.preview" alt="" />
                      <button type="button" class="thumb-del" @click="removeFile(i)">×</button>
                      <div class="thumb-cap">#{{ i + 1 }}</div>
                    </div>
                  </div>
                </div>

                <!-- 送信 -->
                <p class="footnote">お知らせはマイページから変更できます。</p>
                <div class="form-actions">
                  <button class="btn btn-primary maru" type="submit">登録情報を確認する</button>
                </div>
              </form>


            <!-- ② 確認画面 -->
            <section v-else-if="step === 'confirm'" class="confirm">
              <p class="confirm-lead">
                以下の内容で登録します。問題がなければ「登録する」ボタンを押してください。
              </p>

              <div class="conf-items">
                <dl class="conf-item"><dt>お知らせタイトル</dt><dd>{{ form.title }}</dd></dl>
                <!-- <dl class="conf-item"><dt>カテゴリー</dt><dd>{{ selectedCategoryName || '未選択' }}</dd></dl> -->
                <dl class="conf-item"><dt>お知らせ本文</dt><dd class="multiline">{{ form.body || '（未入力）' }}</dd></dl>

                <div class="conf-item" v-for="s in summaries" :key="s.uid">
                  <dl class="conf-item-sub"><dt>見出し</dt><dd>{{ s.heading || '（未入力）' }}</dd></dl>
                  <dl class="conf-item-sub"><dt>内容</dt><dd class="multiline">{{ s.content || '（未入力）' }}</dd></dl>
                </div>

                <dl class="conf-item"><dt>ボタンラベル</dt><dd>{{ form.button_label || '（未設定）' }}</dd></dl>
                <dl class="conf-item">
                  <dt>ボタンのリンク先URL</dt>
                  <dd>
                    <template v-if="form.button_url">
                      <a :href="form.button_url" target="_blank" rel="noopener">{{ form.button_url }}</a>
                    </template>
                    <template v-else>（未設定）</template>
                  </dd>
                </dl>

                <div class="conf-item -images">
                  <dt>掲載画像</dt>
                  <dd>
                    <div v-if="files.length" class="thumbs">
                      <div v-for="f in files" :key="f.uid" class="thumb">
                        <img :src="f.preview" alt="">
                        <div class="cap">{{ f.file.name }}<span class="size">（{{ humanSize(f.file.size) }}）</span></div>
                      </div>
                    </div>
                    <div v-else>（なし）</div>
                  </dd>
                </div>
              </div>

              <div class="back-btn-items">
                <div class="form-btn-items-lead">この内容で登録しますか？</div>
                <div class="form-btn-item">
                <button type="submit" class="btn btn-primary maru" :disabled="submitting" @click="submit">
                  {{ submitting ? '登録中…' : '登録する' }}
                </button>
              </div>
              <div class="form-btn-item">
                <button type="submit" class="btn btn-back maru" @click="backToEdit">修正する</button>
              </div>
              </div>
            </section>

            <!-- ③ 完了画面 -->
            <section v-else class="l-sec mypage-detail">

              <p class="txt-center">あなたのお知らせがサイトに掲載されました。</p>
              <div class="public-url">
                <div class="public-url-title">公開URL</div>
                <a v-if="done.url" :href="done.url" target="_blank" rel="noopener">
                  {{ done.url }}
                </a>
                <div v-else class="public-url -muted">URL を取得できませんでした</div>
              </div>


              <div class="back-btn-items">
   	            <div class="btn-base maru">
                  <RouterLink :to="{ name: 'BusinessMyPage' }">マイページへ</RouterLink>
                  <!-- <a href="/business/mypage/">マイページへ</a> -->
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { http } from '@/api/http'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import { useRouter } from 'vue-router'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

/** ===== 設定 ===== */
const API_BASE   = '/announcements' // '/business/announcements' に変える場合はここ
// const PUBLIC_BASE = import.meta.env.VITE_NEWS_PUBLIC_BASE || 'https://dev--fukushimachi.com/news/'
const MAX_TITLE  = 30
const MAX_IMAGES = 1
const MAX_MB     = 5
const FIXED_CATEGORY_ID = 5

/** ===== 状態 ===== */
// const form = ref({ title: '', category_id: null, body: '', button_label: '', button_url: '' })
const form = ref({ title: '', body: '', button_label: '', button_url: '' })
const userId = ref(null) // ★ 追加: 送信用 user_id を保持
// const categories = ref([])
const summaries  = ref([{ uid: uid(), heading: '', content: '' }])
const files      = ref([])
const submitting = ref(false)
const step       = ref('form') // 'form' | 'confirm' | 'done'
const done       = ref({ url: '' })

// 表示許可するカテゴリだけに絞り込む */
// const ALLOWED_NAMES = new Set(['イベント', '施設から'])
// const ALLOWED_SLUGS = new Set(['event', 'facility'])
// const filteredCategories = computed(() =>
//   (categories.value || []).filter(c => {
//     const name = (c.name || '').trim()
//     const slug = (c.slug || '').trim().toLowerCase()
//     return ALLOWED_NAMES.has(name) || ALLOWED_SLUGS.has(slug)
//   })
// )

/** ===== 計算 ===== */
// const selectedCategoryName = computed(() => {
//   const id = Number(form.value.category_id)
//   const hit = categories.value.find(c => Number(c.id) === id)
//   return (hit && hit.name) || ''
// })
const titleCount = computed(() => countGraphemes(form.value.title || ''))
const titleError = computed(() => titleCount.value > MAX_TITLE)

/** ===== 初期ロード ===== */
onMounted(async () => {
  //  ログインユーザーIDを localStorage から復元
  try {
    const raw = localStorage.getItem('userId')
    if (raw != null) {
      const n = Number(raw)
      userId.value = Number.isFinite(n) ? n : (JSON.parse(raw)?.id ?? null)
    }
  } catch { userId.value = null }
  // try {
  //   const { data } = await http.get(`${API_BASE}/categories`)
  //   categories.value = data || []
  //   // 既に選択されているIDが許可外ならリセット
  //   const okIds = new Set(filteredCategories.value.map(c => Number(c.id)))
  //   if (form.value.category_id && !okIds.has(Number(form.value.category_id))) {
  //     form.value.category_id = null
  //   }
  // } catch (e) { console.error('[ann:categories] failed', e) }
})

/** ===== 概要操作 ===== */
function addSummary(){ summaries.value.push({ uid: uid(), heading: '', content: '' }) }
function duplicateSummary(i){ const s = summaries.value[i]; summaries.value.splice(i+1,0,{ uid:uid(), heading:s.heading, content:s.content }) }
function removeSummary(i){ if (summaries.value.length>1) summaries.value.splice(i,1) }

/** ===== 画像 ===== */
function pushFiles(list){
  const room = MAX_IMAGES - files.value.length
  const add = Array.from(list).slice(0, Math.max(0, room))
  for (const f of add){
    if (!/image\/(png|jpe?g)/i.test(f.type)) continue
    if (f.size > MAX_MB*1024*1024) continue
    files.value.push({ uid: uid(), file: f, preview: URL.createObjectURL(f) })
  }
}
function onFilePick(e){ const input=e.target; if (!input.files) return; pushFiles(input.files); input.value='' }
function onDrop(e){ if (!e.dataTransfer?.files) return; pushFiles(e.dataTransfer.files) }
function removeFile(i){ const r = files.value.splice(i,1)[0]; if (r?.preview) URL.revokeObjectURL(r.preview) }

/** ===== バリデーション→確認へ ===== */
function validateBeforeConfirm(){
  if (!form.value.title){ alert('タイトルを入力してください'); return false }
  if (titleError.value){ alert(`タイトルは${MAX_TITLE}文字以内で入力してください`); return false }
  if (form.value.button_url && !/^https?:\/\//i.test(form.value.button_url)){
    alert('ボタンのリンク先URLは http(s) を指定してください'); return false
  }
  if (files.value.length > MAX_IMAGES){ alert(`画像は最大${MAX_IMAGES}枚までです`); return false }
  return true
}
function toConfirm(){ if (!validateBeforeConfirm()) return; step.value='confirm'; window.scrollTo({top:0}) }

/** ===== 登録 ===== */
async function submit(){
  try{
    submitting.value = true
    const fd = new FormData()
    fd.append('title', form.value.title)
    // if (form.value.category_id) fd.append('category_id', String(form.value.category_id))
    // ★ カテゴリは常に「5」を送る
    fd.append('category_id', String(FIXED_CATEGORY_ID))
    if (form.value.body) fd.append('body', form.value.body)
    if (form.value.button_label) fd.append('button_label', form.value.button_label)
    if (form.value.button_url) fd.append('button_url', form.value.button_url)
    if (userId.value) fd.append('user_id', String(userId.value))

    const sums = summaries.value.map(s => ({ heading: s.heading || '', content: s.content || '' }))
    fd.append('summaries', JSON.stringify(sums))
    for (const it of files.value.slice(0, MAX_IMAGES)) fd.append('images', it.file)

    const { data } = await http.post(`${API_BASE}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })

    // 完了画面用の公開URLを決定
    done.value.url = resolvePublicUrl(data)
    step.value = 'done'
    window.scrollTo({ top: 0 })
  } catch (e){
    console.error('[ann:create] failed ', e)
    alert('登録に失敗しました')
  } finally {
    submitting.value = false
  }
}

/** ===== 戻る ===== */
function backToEdit(){ step.value='form'; window.scrollTo({top:0}) }

/** ===== util ===== */
function uid(){ return Math.random().toString(36).slice(2) + Date.now().toString(36) }
function countGraphemes(s){ return [...(s||'')].length }
function humanSize(n){ const kb=n/1024; return kb>=1024 ? (kb/1024).toFixed(1)+' MB' : kb.toFixed(1)+' KB' }
function noop(){}

/** 公開URLの組み立て（APIが public_url を返せばそれを優先） */
 function resolvePublicUrl(resp){
   if (!resp) return ''
   // サーバが返せばそれを優先
   if (resp.public_url) return resp.public_url
   if (resp.url)        return resp.url

   // IDだけでSPAの詳細ページへ
   const id = Number(resp.id || resp.announcement_id || 0)
   if (id > 0) {
     try {
       // ★ あなたの“汎用の詳細ページ”のルート名に合わせてください
       // 例: name: 'AnnouncementDetail', path: '/news/announcements/:id'
       const href = router.resolve({ name: 'AnnouncementDetail', params: { id } }).href
       return new URL(href, window.location.origin).toString()
     } catch {
       // 直リンクのフォールバック（ルーティングに合わせてパスは調整）
       return `${window.location.origin}/news/announcements/${id}`
     }
   }
   return ''
 }
// ▼ スマホのヘッダー被り対策：実測高さ → CSS変数
function updateHeaderHeight () {
  const headerEl =
    document.querySelector('[data-app-header]') ||
    document.querySelector('header')
  if (!headerEl) return
  const h = Math.round(headerEl.getBoundingClientRect().height)
  if (h > 0) {
    document.documentElement.style.setProperty('--header-height', `${h}px`)
  }
}
onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})
</script>

<style scoped>
/* ラッパー */
.form-wrap { background:#f3f4f6; border-radius:16px; padding:24px; }
.page-title { text-align:center; margin-bottom:18px; }

/* 共通フォーム */
.form-item { margin-bottom:22px; }
.form-label { display:block; font-weight:700; margin-bottom:8px; }
.input { width:100%; box-sizing:border-box; border:1px solid #d1d5db; border-radius:8px; padding:10px 12px; background:#fff; font-size:14px; }
.input.is-error { border-color:#ef4444; }
.help { margin-top:6px; color:#6b7280; font-size:12px; }
.help .error { color:#ef4444; margin-left:8px; }

.checkbox-items { display:flex; gap:18px; flex-wrap:wrap; }
.checkbox { display:flex; align-items:center; gap:8px; }

/* 概要 */
.summary-card { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:12px 12px 8px; margin-bottom:12px; }
.summary-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.summary-no { font-size: 14px;; font-weight:500; color:#000000; }
.summary-actions { display:flex; gap:6px; }
.btn-mini { padding:6px 10px; border:1px solid #d1d5db; border-radius:8px; background:#fff; cursor:pointer; }
.btn-mini.-danger { border-color:#fca5a5; color:#b91c1c; }
.form-subitem { margin-bottom:10px; }
.form-sublabel { display:block; font-size:13px; color:#4b5563; margin-bottom:6px; }

.summary-add { margin-top:8px; }
.btn-add { border:1px dashed #9ca3af; background:#fff; border-radius:999px; padding:6px 12px; cursor:pointer; }

/* 画像アップロード */
.section-title { font-weight:800; text-align:center; margin:12px 0; }
.note { color:#6b7280; font-size:13px; margin-bottom:10px; }
.uploader { border:2px dashed #d1d5db; border-radius:12px; background:#fff; padding:24px; text-align:center; }
.uploader-inner { display:flex; flex-direction:column; gap:6px; align-items:center; }
.uploader-icon { font-size:22px; }
.btn-file { display:inline-block; background:#2563eb; color:#fff; padding:8px 12px; border-radius:999px; cursor:pointer; }

.thumbs { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
.thumb { position:relative; width:140px; height:100px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; background:#fff; }
.thumb img { width:100%; height:100%; object-fit:cover; }
.thumb-del { position:absolute; top:4px; right:4px; background:#111827; color:#fff; border:none; width:22px; height:22px; border-radius:999px; cursor:pointer; }
.thumb-cap { position:absolute; bottom:2px; right:6px; color:#fff; background:rgba(0,0,0,.4); padding:2px 6px; border-radius:999px; font-size:12px; }

/* 送信/確認ボタン */
.form-actions { text-align:center; margin-top:18px; }
.btn-secondary.maru{ background:#9ca3af; color:#fff; border:none; border-radius:999px; padding:12px 24px; font-weight:800; cursor:pointer; }
.footnote { margin-top:12px; color:#6b7280; text-align:center; }

/* 確認画面 */
.confirm-lead{ margin-bottom:14px; color:#4b5563; }
.kakunin{ background:#f3f4f6; border-radius:16px; padding:16px; }
.row{ display:grid; grid-template-columns: 160px 1fr; gap:8px 16px; padding:12px 0; border-bottom:1px dashed #e5e7eb; }
.row:last-child{ border-bottom:none; }
.row > dt{ font-weight:700; color:#374151; }
.row > dd{ color:#111827; }
.row.-images{ align-items:start; }
.multiline{ white-space:pre-wrap; line-height:1.7; }
.row.-block{ grid-template-columns: 1fr; border:1px solid #e5e7eb; border-radius:12px; padding:12px; background:#fff; margin:10px 0; }
.sum-no{ font-weight:800; color:#374151; margin-bottom:6px; }
.row-sub{ display:grid; grid-template-columns: 100px 1fr; gap:6px 12px; padding:6px 0; }
.row-sub + .row-sub{ border-top:1px dashed #eee; }

/* 完了画面（添付イメージ風） */
.done { text-align:center; }
.done-lead { color:#6b7280; margin-bottom:16px; }
.public-card {
  background:#e0f2fe; border-radius:12px; padding:12px; max-width:700px; margin:0 auto 16px; text-align:center;
}
.public-label { font-weight:800; color:#374151; margin-bottom:6px; }
.public-url { color:#0ea5e9; text-decoration:underline; word-break:break-all; }
.public-url.-muted { color:#6b7280; text-decoration:none; }
.done-actions { margin-top:14px; display:flex; justify-content:center; }
.btn-outline.maru {
  background:#fff; color:#2563eb; border:2px solid #93c5fd; border-radius:999px; padding:12px 24px; font-weight:800; cursor:pointer;
}
/* ▼ スマホでヘッダーに隠れないよう main を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* 初期値。JSの実測で上書きされます */
  main{
    padding-top: var(--header-height);
  }
  /* 先頭セクションの相殺マージン対策（保険） */
  main > .l-sec:first-child{ margin-top: 0; }
}
</style>
