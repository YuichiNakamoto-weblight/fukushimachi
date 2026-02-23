<!-- src/views/Auth/SeekerProfileView.vue -->
<!-- 求職者用プロフィール登録＆確認 -->
<template>
  <div class="wrap">
    <!-- 共通ヘッダー -->
    <AppHeader data-app-header />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec signup-detail">
        <div class="inner signup-lead">
          <template v-if="!confirming">
            <!-- step 表示 -->
            <h1 class="page-title maru">プロフィール作成</h1>

            <div class="signup-step flex">
              <div class="signup-step__step step1">アカウント<br>登録</div>
              <div class="signup-step__step step2">ワンタイム<br>パスワード<br>入力</div>
              <div class="signup-step__step step3 select">プロフィール<br>作成</div>
              <div class="signup-step__step step4">完了</div>
            </div>

            <p>
              <strong>アカウント登録が完了しました。</strong>
              ご登録いただきありがとうございます。続けて、あなたのプロフィールをご登録ください。<br />
              グッドやトークボタンを押すと施設へプロフィール情報をお知らせいたします。
            </p>
          </template>

          <!-- ★ 確認画面ではシンプルな1文だけ -->
          <template v-else>
            <h1 class="page-title maru">プロフィール作成</h1>
            <strong>登録内容をご確認ください。</strong>
            <p>以下の内容で登録します。問題がなければ「登録する」ボタンを押してください。</p>
          </template>
        </div>

        <div class="form-wrap">
          <div class="inner">
            <!-- ローディング -->
            <div v-if="loading" class="loading">読み込み中…</div>

            <!-- ===== 編集ステップ ===== -->
            <form
              v-else
              v-show="!confirming"
              @submit.prevent="startConfirm"
            >
              <div class="form-items">
                <!-- メッセージ -->
                <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>

                <!-- 氏名（漢字） -->
                <div class="form-item" :class="{ error: triedSubmit && errors.name_sei }">
                  <label for="user_last_name">姓（全角）<span class="req">※必須</span></label>
                  <input id="user_last_name" type="text" name="user_last_name" placeholder="福島" v-model="f.name_sei" />
                  <p v-if="triedSubmit && errors.name_sei" class="error-message">{{ errors.name_sei }}</p>
                </div>

                <div class="form-item" :class="{ error: triedSubmit && errors.name_mei }">
                  <label for="user_first_name">名（全角）<span class="req">※必須</span></label>
                  <input id="user_first_name" type="text" name="user_first_name" placeholder="町子" v-model="f.name_mei" />
                  <p v-if="triedSubmit && errors.name_mei" class="error-message">{{ errors.name_mei }}</p>
                </div>

                <!-- 氏名（カナ） -->
                <div class="form-item" :class="{ error: triedSubmit && errors.name_sei_kana }">
                  <label for="user_last_kana">姓カナ（全角）<span class="req">※必須</span></label>
                  <input id="user_last_kana" type="text" name="user_last_kana" placeholder="フクシマ" v-model="f.name_sei_kana" />
                  <p v-if="triedSubmit && errors.name_sei_kana" class="error-message">{{ errors.name_sei_kana }}</p>
                </div>

                <div class="form-item" :class="{ error: triedSubmit && errors.name_mei_kana }">
                  <label for="user_first_kana">名カナ（全角）<span class="req">※必須</span></label>
                  <input id="user_first_kana" type="text" name="user_first_kana" placeholder="マチコ" v-model="f.name_mei_kana" />
                  <p v-if="triedSubmit && errors.name_mei_kana" class="error-message">{{ errors.name_mei_kana }}</p>
                </div>

                <!-- 生年月日（セレクト式） -->
                <div class="form-item w50" :class="{ error: triedSubmit && errors.birthdate }">
                  <label>生年月日<span class="req">※必須</span></label>
                  <div class="birth-selects">
                    <select v-model.number="bYear" aria-label="生年">
                      <option :value="null">年</option>
                      <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
                    </select>
                    <select v-model.number="bMonth" aria-label="月">
                      <option :value="null">月</option>
                      <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
                    </select>
                    <select v-model.number="bDay" aria-label="日">
                      <option :value="null">日</option>
                      <option v-for="d in daysInMonth" :key="d" :value="d">{{ d }}日</option>
                    </select>
                  </div>
                  <div class="help-age" v-if="ageText">（{{ ageText }}）</div>
                  <p v-if="triedSubmit && errors.birthdate" class="error-message">{{ errors.birthdate }}</p>
                </div>

                <!-- 性別 -->
                <div class="radio-items" :class="{ error: triedSubmit && errors.gender }">
                  <label class="radio-items-title">性別<span class="req">※必須</span></label>
                  <label class="radio-item">
                    <input type="radio" name="user_gender" value="male" v-model="f.gender" />
                    男性
                  </label>
                  <label class="radio-item">
                    <input type="radio" name="user_gender" value="female" v-model="f.gender" />
                    女性
                  </label>
                  <label class="radio-item">
                    <input type="radio" name="user_gender" value="other" v-model="f.gender" />
                    その他
                  </label>
                  <p v-if="triedSubmit && errors.gender" class="error-message">{{ errors.gender }}</p>
                </div>

                <!-- 郵便番号 -->
                <div class="form-item" :class="{ error: triedSubmit && errors.postcode }">
                  <label for="user_zipcode">郵便番号<span class="req">※必須</span></label>
                  <input
                    id="user_zipcode"
                    type="text"
                    name="user_zipcode"
                    class="zipcode"
                    placeholder="例）9600000"
                    inputmode="numeric"
                    v-model="f.postcode"
                  />
                  <p v-if="triedSubmit && errors.postcode" class="error-message">{{ errors.postcode }}</p>
                </div>

                <!-- 都道府県 -->
                <div class="form-item" :class="{ error: triedSubmit && errors.prefectures }">
                  <label for="user_pref">都道府県<span class="req">※必須</span></label>
                  <select id="user_pref" name="user_pref" v-model="f.prefectures">
                    <option value="" selected>選択してください</option>
                    <option v-for="p in prefList" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                  <div class="note" v-if="prefLoading">都道府県を読み込み中…</div>
                  <div class="msg-error" v-if="prefErr">{{ prefErr }}</div>
                  <p v-if="triedSubmit && errors.prefectures" class="error-message">{{ errors.prefectures }}</p>
                </div>

                <!-- 市町村 -->
                <div class="form-item" :class="{ error: triedSubmit && errors.city }">
                  <label for="user_city">市町村（全角）<span class="req">※必須</span></label>
                  <input id="user_city" type="text" name="user_city" placeholder="例）福島市" v-model="f.city" />
                  <p v-if="triedSubmit && errors.city" class="error-message">{{ errors.city }}</p>
                </div>

                <!-- 取得資格（動的・複数） -->
                <div class="checkbox-items">
                  <label class="checkbox-items-title">取得資格（複数選択可）</label>
                  <div v-if="qLoading" class="note">資格を読み込み中…</div>
                  <template v-else>
                    <label v-for="q in quals" :key="q.id" class="checkbox-item">
                      <input type="checkbox" :value="q.id" v-model="selectedQualIds" />
                      {{ q.name }}
                    </label>
                  </template>
                </div>

                <!-- 自己PR -->
                <div class="form-item">
                  <label for="user_pr">自己PR（全角500文字以内）</label>
                  <textarea
                    id="user_pr"
                    name="user_pr"
                    rows="6"
                    :maxlength="PR_MAX"
                    placeholder="私は介護福祉の専門学校を卒業見込みです。学校では介護福祉士全般の仕事を習得し、現在介護福祉士になりたいと考えています。"
                    v-model="f.comment"
                  ></textarea>
                  <!-- リアルタイム文字数表示 -->
                  <div class="char-count" aria-live="polite">
                    {{ prCount }}/{{ PR_MAX }}文字（残り {{ prRemain }}）
                  </div>
                </div>

                <!-- 注意書き -->
                <p class="note">
                  名前／性別／生年月日以外は登録後に編集することができます。<br />
                  登録情報は介護施設へのPRにつながるので、ぜひ全項目の登録をお願いします。
                </p>

                <!-- 確認へ -->
                <div class="form-btn-item">
                  <button type="submit" class="btn btn-primary maru" :disabled="saving">
                    {{ exists ? '更新内容を確認する' : '登録情報を確認する' }}
                  </button>
                </div>
                <div class="form-btn-item">
                  <!-- 戻るボタンは仕様により非表示 -->
                </div>
              </div>
            </form>

            <!-- ===== 確認ステップ ===== -->
            <section v-if="!loading && confirming" class="l-sec signup-detail">
              <div class="form-wrap error">
                <div class="inner">
                  <div class="conf-items">
                    <div class="conf-item flex">
                      <div class="user_last_name">
                        <span class="label-name">姓</span>
                        <span class="conf-result">{{ f.name_sei || '-' }}</span>
                      </div>
                      <div class="user_first_name">
                        <span class="label-name">名</span>
                        <span class="conf-result">{{ f.name_mei || '-' }}</span>
                      </div>
                    </div>

                    <div class="conf-item flex">
                      <div class="user_last_kana">
                        <span class="label-name">姓カナ</span>
                        <span class="conf-result">{{ f.name_sei_kana || '-' }}</span>
                      </div>
                      <div class="user_first_kana">
                        <span class="label-name">名カナ</span>
                        <span class="conf-result">{{ f.name_mei_kana || '-' }}</span>
                      </div>
                    </div>

                    <div class="conf-item">
                      <div class="user_birthday">
                        <span class="label-name">生年月日</span>
                        <span class="conf-result">
                          {{ birthJp || '-' }}
                          <span v-if="ageText">（{{ ageText }}）</span>
                        </span>
                      </div>
                    </div>

                    <div class="conf-item">
                      <div class="user_gender">
                        <span class="label-name">性別</span>
                        <span class="conf-result">{{ genderText || '-' }}</span>
                      </div>
                    </div>

                    <div class="conf-item">
                      <div class="user_zipcode">
                        <span class="label-name">郵便番号</span>
                        <span class="conf-result">{{ f.postcode || '-' }}</span>
                      </div>
                    </div>

                    <div class="conf-item">
                      <div class="user_pref">
                        <span class="label-name">都道府県</span>
                        <span class="conf-result">{{ f.prefectures || '-' }}</span>
                      </div>
                    </div>

                    <div class="conf-item">
                      <div class="user_city">
                        <span class="label-name">市区町村</span>
                        <span class="conf-result">{{ f.city || '-' }}</span>
                      </div>
                    </div>

                    <div class="conf-item">
                      <div class="user_qual">
                        <span class="label-name">取得資格</span>
                        <span class="conf-result">
                          <template v-if="selectedQualNames.length === 0">-</template>
                          <template v-else>
                            <span v-for="(name, i) in selectedQualNames" :key="name">
                              {{ name }}<br v-if="i < selectedQualNames.length - 1" />
                            </span>
                          </template>
                        </span>
                      </div>
                    </div>

                    <div class="conf-item">
                      <div class="user_pr">
                        <span class="label-name">自己PR</span>
                        <span class="conf-result whitespace-pre-wrap">{{ f.comment || '-' }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="back-btn-items">
                    <form class="form" @submit.prevent="saveAndComplete">
                      <div class="form-btn-items-lead">この内容で登録しますか？</div>

                      <div class="form-btn-item">
                        <button type="submit" class="btn btn-primary maru" :disabled="saving">
                          {{ saving ? '保存中…' : (exists ? '更新する' : '登録する') }}
                        </button>
                      </div>

                      <div class="form-btn-item">
                        <button type="button" class="btn btn-back" @click="confirming=false">修正する</button>
                      </div>
                    </form>
                  </div>
                  <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </section>
    </main>

    <!-- 共通フッター -->
    <AppFooter />
  </div>

  <PcModel />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

/* 共通ヘッダー／フッター */
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()
const route = useRoute()

const triedSubmit = ref(false)

// 文字数カウンター
const PR_MAX = 500
const f = ref({
  user_id: null,
  name_sei: '', name_mei: '',
  name_sei_kana: '', name_mei_kana: '',
  birthdate: '', gender: '',
  phone: '', postcode: '',
  prefectures: '', city: '', town: '', building: '',
  comment: '', profile_icon: ''
})
const prCount = computed(() => (f.value.comment ?? '').length)
const prRemain = computed(() => Math.max(0, PR_MAX - prCount.value))

// カタカナ判定（緩め）
const KATAKANA = /^[ァ-ヾー・\s]+$/

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

const message = ref('')
const ok = ref(false)
const loading = ref(true)
const saving = ref(false)
const exists = ref(false)
const confirming = ref(false)

// ====== 生年月日：セレクト式 ======
const MIN_AGE = 15
const MAX_AGE = 120

const today = new Date()
const currentYear = today.getFullYear()

// セレクト値
const bYear = ref(null)   // number | null
const bMonth = ref(null)  // number | null
const bDay = ref(null)    // number | null

// 年のリスト（1900〜今年）
const years = computed(() => {
  const arr = []
  for (let y = currentYear; y >= 1900; y--) arr.push(y)
  return arr
})

// 月ごとの日数
const daysInMonth = computed(() => {
  if (!bYear.value || !bMonth.value) return 31
  return new Date(bYear.value, bMonth.value, 0).getDate()
})

// セレクト→birthdate（YYYY-MM-DD）に反映
watch([bYear, bMonth, bDay], () => {
  if (bYear.value && bMonth.value && bDay.value) {
    const y = String(bYear.value)
    const m = String(bMonth.value).padStart(2, '0')
    const d = String(bDay.value).padStart(2, '0')
    f.value.birthdate = `${y}-${m}-${d}`
  } else {
    f.value.birthdate = ''
  }
})

// 既存 birthdate → セレクトに反映
function hydrateBirthSelectsFromModel () {
  const v = toYMD(f.value.birthdate)
  if (!v) { bYear.value = bMonth.value = bDay.value = null; return }
  const [y, m, d] = v.split('-').map(n => Number(n))
  bYear.value = Number.isFinite(y) ? y : null
  bMonth.value = Number.isFinite(m) ? m : null
  bDay.value = Number.isFinite(d) ? d : null
}

// 年齢テキスト
const ageText = computed(() => {
  const v = toYMD(f.value.birthdate)
  if (!v) return ''
  const [y, m, d] = v.split('-').map(Number)
  const t = new Date()
  let years = t.getFullYear() - y
  const bdThisYear = new Date(t.getFullYear(), m - 1, d)
  if (t < bdThisYear) years--
  if (years < 0 || years > 120) return ''
  return `${years}歳`
})

// 和暦風（YYYY年M月D日）表示
const birthJp = computed(() => {
  const v = toYMD(f.value.birthdate)
  if (!v) return ''
  const [y, m, d] = v.split('-').map(Number)
  return `${y}年${m}月${d}日`
})

const genderText = computed(() => {
  if (f.value.gender === 'male') return '男性'
  if (f.value.gender === 'female') return '女性'
  if (f.value.gender === 'other') return 'その他'
  return ''
})

// const onBirthInput = () => {} // 互換用（未使用）

// === マスタ等 ===
const qLoading = ref(true)
const quals = ref([]) // [{id,name}]
const selectedQualIds = ref([])
const selectedQualNames = computed(() => {
  const dict = new Map(quals.value.map(q => [Number(q.id), q.name]))
  return selectedQualIds.value.map(id => dict.get(Number(id))).filter(Boolean)
})

const prefLoading = ref(true)
const prefErr = ref('')
const prefList = ref([])

// 正規化（YYYY-MM-DD）
function toYMD (v) {
  if (!v) return ''
  if (v instanceof Date && !isNaN(+v)) {
    const y = v.getFullYear()
    const m = String(v.getMonth() + 1).padStart(2, '0')
    const d = String(v.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  if (typeof v === 'string') {
    // 1) 区切り付き YYYY{./-}M{./-}D
    let m = v.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/)
    if (m) return `${m[1]}-${String(+m[2]).padStart(2, '0')}-${String(+m[3]).padStart(2, '0')}`
    m = v.match(/^(\d{4})(\d{2})(\d{2})$/)
    if (m) return `${m[1]}-${m[2]}-${m[3]}`
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
    // 2) ISO 8601（タイムゾーンや Z を含む）→ ローカル時刻に変換してから日付を取り出す
    if (/^\d{4}-\d{2}-\d{2}T/.test(v)) {
      const dt = new Date(v)
      if (!isNaN(+dt)) {
        const y = dt.getFullYear()
        const mm = String(dt.getMonth() + 1).padStart(2, '0')
        const dd = String(dt.getDate()).padStart(2, '0')
        return `${y}-${mm}-${dd}`
      }
    }
  }
  return ''
}

function resolveUserId () {
  const raw = localStorage.getItem('auth_user')
  if (raw) {
    try {
      const u = JSON.parse(raw)
      if (u && u.id) return Number(u.id)
    } catch {
      localStorage.removeItem('auth_user')
    }
  }
  const q = Number(route.query.uid || route.query.userId || 0)
  return q || null
}

async function loadQuals () {
  qLoading.value = true
  try {
    const { data } = await API.get('/seekers/qualifications')
    quals.value = data?.items || []
  } catch (e) {
    console.error('[qualifications]', e)
  } finally {
    qLoading.value = false
  }
}

async function loadPrefectures () {
  prefLoading.value = true
  prefErr.value = ''
  try {
    const { data } = await API.get('/masters/prefectures')
    prefList.value = data?.items || []
  } catch (e) {
    prefErr.value = e?.response?.data?.error || '都道府県の取得に失敗しました。'
  } finally {
    prefLoading.value = false
  }
}

async function loadProfile (userId) {
  try {
    const { data } = await API.get(`/seekers/profile/${userId}`)
    if (data?.profile) {
      Object.assign(f.value, data.profile)
      f.value.birthdate = toYMD(f.value.birthdate) // 正規化
      exists.value = true
    } else {
      exists.value = false
    }
    if (Array.isArray(data?.qualifications)) selectedQualIds.value = data.qualifications
  } catch {
    exists.value = false
  } finally {
    // birthdate をセレクトに反映
    hydrateBirthSelectsFromModel()
  }
}

// 送信前サニタイズ
function sanitizePayload (raw) {
  const p = { ...raw }
  if (p.postcode) p.postcode = String(p.postcode).replace(/-/g, '')
  if (p.phone) p.phone = String(p.phone).replace(/[^0-9]/g, '')
  for (const k of Object.keys(p)) if (p[k] === '') p[k] = null
  return p
}

// 「確認へ」
function startConfirm () {
  message.value = ''
  ok.value = false
  triedSubmit.value = true

  if (!f.value.user_id) { message.value = 'ユーザーIDを取得できませんでした。'; return }

  // セレクト→モデルは watch 済み。念のため正規化
  f.value.birthdate = toYMD(f.value.birthdate)

  if (Object.keys(errors.value).length > 0) {
    message.value = '未入力の必須項目があります。各エラーをご確認ください。'
    scrollToFirstError()
    return
  }

  confirming.value = true
  nextTick(() => { window.scrollTo({ top: 0, behavior: 'auto' }) })
}

// 「登録/更新」保存
async function save () {
  message.value = ''
  ok.value = false
  saving.value = true
  try {
    const payload = sanitizePayload({ ...f.value, qualifications: selectedQualIds.value })
    const { data } = await API.post('/seekers/profile', payload) // UPSERT
    ok.value = true
    exists.value = true
    message.value = data?.message || '保存しました。'
  } catch (e) {
    ok.value = false
    message.value = e?.response?.data?.error || '保存に失敗しました。'
  } finally {
    saving.value = false
  }
}

// 保存→成功なら完了ページへ
const saveAndComplete = async () => {
  await save()
  if (ok.value) {
    persistSeekerLogin(f.value.user_id)
    router.replace({ name: 'SeekerProfileComplete' })
  }
}

function persistSeekerLogin (uid) {
  if (!uid) return
  try {
    localStorage.setItem('userId', String(uid))
    localStorage.setItem('userType', 'seeker')
  } catch (e) {
    console.warn('[persistEmployerLogin]', e)
  }
}

onMounted(async () => {
  f.value.user_id = resolveUserId()
  if (f.value.user_id) persistSeekerLogin(f.value.user_id)

  await Promise.all([
    loadPrefectures(),
    loadQuals(),
    f.value.user_id ? loadProfile(f.value.user_id) : Promise.resolve().then(() => hydrateBirthSelectsFromModel())
  ])
  loading.value = false

  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})

// バリデーション
const errors = computed(() => {
  const e = {}

  if (!f.value.name_sei) e.name_sei = '姓は必須です。'
  if (!f.value.name_mei) e.name_mei = '名は必須です。'

  if (!f.value.name_sei_kana) e.name_sei_kana = '姓カナは必須です。'
  else if (!KATAKANA.test(f.value.name_sei_kana)) e.name_sei_kana = '全角カタカナで入力してください。'

  if (!f.value.name_mei_kana) e.name_mei_kana = '名カナは必須です。'
  else if (!KATAKANA.test(f.value.name_mei_kana)) e.name_mei_kana = '全角カタカナで入力してください。'

  // 生年月日（セレクト必須 & 年齢制限）
  const ymd = toYMD(f.value.birthdate)
  if (!bYear.value || !bMonth.value || !bDay.value || !ymd) {
    e.birthdate = '生年月日は必須です。'
  } else {
    // 年齢チェック
    const [y, m, d] = ymd.split('-').map(Number)
    const t = new Date()
    let age = t.getFullYear() - y
    const bdThisYear = new Date(t.getFullYear(), m - 1, d)
    if (t < bdThisYear) age--
    if (age < MIN_AGE) e.birthdate = `${MIN_AGE}歳未満は登録できません。`
    if (age > MAX_AGE) e.birthdate = '生年月日を再確認してください。'
  }

  if (!f.value.gender) e.gender = '性別を選択してください。'

  const pc = String(f.value.postcode || '').replace(/-/g, '')
  if (!pc) e.postcode = '郵便番号は必須です。'
  else if (!/^\d{7}$/.test(pc)) e.postcode = '7桁の半角数字で入力してください（ハイフンなし）。'

  if (!f.value.prefectures) e.prefectures = '都道府県を選択してください。'
  if (!f.value.city) e.city = '市町村を入力してください。'

  return e
})

function scrollToFirstError() {
  nextTick(() => {
    const el =
      document.querySelector('.form-item.error, .radio-items.error') ||
      document.querySelector('.error-message')
    if (el && 'scrollIntoView' in el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusable = el.querySelector('input,select,textarea')
      if (focusable && 'focus' in focusable) focusable.focus()
    }
  })
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
</script>

<style scoped>
/* 既存＋追記 */

.req { color: #d92d20; font-weight: 600; margin-left: .4em; }

.form-item.error input,
.form-item.error select,
.form-item.error textarea {
  border-color: #d92d20 !important;
  background: #fff6f6;
}

.radio-items.error {
  outline: 2px solid #d92d20;
  outline-offset: 4px;
  border-radius: 6px;
  padding: 8px 10px;
  background: #fff6f6;
}

.error-message {
  color: #d92d20;
  font-size: .9rem;
  margin-top: 6px;
}

/* 生年月日セレクト */
.birth-selects {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: .5rem;
  max-width: 420px;
}
.birth-selects select {
  width: 100%;
  padding: .6rem .7rem;
  border: 1px solid #d1d5db;
  border-radius: .5rem;
  font-size: 1rem;
  background: #fff;
}

.from-btn-item{padding: 10px;}
.btn.btn-primary.maru{margin: 0 auto; padding:13px 24px;}
.btn.btn-back{background:#aba0a0; padding:13px 24px;text-align: center; color: white; border-radius: 18px; width:100%}

/* 文字数カウンター */
.char-count{
  margin-top: 4px;
  text-align: right;
  font-size: 12px;
  line-height: 1.4;
  color: #6b7280; /* gray-500 */
}

/* ▼ スマホでヘッダーに隠れないよう main を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* 初期値。JSの実測で上書きされます */
  main{
    padding-top: var(--header-height);
  }
  main > .l-sec:first-child{ margin-top: 0; }
}
</style>
