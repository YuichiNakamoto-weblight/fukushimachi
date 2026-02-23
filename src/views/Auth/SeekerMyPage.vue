<!-- src/views/Auth/SeekerMyPage.vue -->
<!-- 求職者用マイページ-->
<template>
  <body class="mypage-home is-user is-login">
  <div class="wrap">
    <!-- 共通ヘッダー -->
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

  <div class="content">
    <main>
      <section class="l-sec">
        <!-- タイトル -->
        <div class="page-title mypage-title maru">
          {{ displayName || 'ユーザー' }} さんのマイページ
        </div>
        <div class="mypage-ditail">
        <div class="inner">

          <!-- ロード/エラー -->
          <div v-if="loading" class="loading">読み込み中…</div>
          <div v-else>
            <!-- プロフィール -->
            <div class="card profile">
              <div class="user-profile__detail-title sec-title maru">プロフィール</div>

              <dl class="profile-table">
                <div class="row">
                  <dt>氏名</dt>
                  <dd>
                    <div>{{ fullName || '―' }}</div>
                    <div class="sub" v-if="fullNameKana">{{ fullNameKana }}</div>
                  </dd>
                </div>

                <div class="row">
                  <dt>住所</dt>
                  <dd>{{ addressLine || '―' }}</dd>
                </div>

                <!-- <div class="row">
                  <dt>電話番号</dt>
                  <dd class="value">{{ displayPhone || '―' }}</dd>
                </div> -->

                <div class="row">
                  <dt>メール</dt>
                  <dd class="value">{{ displayEmail || '―' }}</dd>
                </div>

                <div class="row">
                  <dt>生年月日</dt>
                  <dd>
                    <template v-if="birthJp">
                      {{ birthJp }}
                      <span v-if="ageText" class="muted">（{{ ageText }}）</span>
                    </template>
                    <template v-else>―</template>
                  </dd>
                </div>

                <div class="row">
                  <dt>性別</dt>
                  <dd>{{ genderText || '―' }}</dd>
                </div>

                <div class="row">
                  <dt>取得資格</dt>
                  <dd>
                    <template v-if="qualNames.length">
                      <div v-for="q in qualNames" :key="q">{{ q }}</div>
                    </template>
                    <template v-else>―</template>
                  </dd>
                </div>

                <div class="row">
                  <dt>PR</dt>
                  <dd class="pre">{{ profile?.comment || '―' }}</dd>
                </div>
              </dl>

              <div class="actions">
                <button class="btn outline" @click="goEdit">
                  プロフィールを編集する
                </button>
              </div>
            </div>

            <div class="mypage-content">
            <!-- 一覧 -->
            <div class="user-list__activity">
              <div class="inner">
                <div class="user-list__title">一覧</div>
                <ul>
                  <li>
                    <!-- クリップ一覧: Jobs へ view=clips クエリで遷移 -->
                    <RouterLink :to="{ name: 'Jobs', query: { view: 'clips' } }">
                      クリップ一覧
                      <span class="ico-arrow02">
                        <img src="/src/assets/images/common/ico-arrow02.svg" />
                      </span>
                    </RouterLink>
                  </li>
                  <li>
                    <!-- グッド一覧: Jobs へ view=goods -->
                    <RouterLink :to="{ name: 'Jobs', query: { view: 'goods' } }">
                      グッド一覧
                      <span class="ico-arrow02">
                        <img src="/src/assets/images/common/ico-arrow02.svg" />
                      </span>
                    </RouterLink>
                  </li>
                  <li>
                    <!-- トーク一覧: MyTalks へ（必要ならクエリ view=talks を付与） -->
                    <RouterLink :to="{ name: 'MyTalks', query: { view: 'talks' } }">
                      トーク一覧
                      <span class="ico-arrow02">
                        <img src="/src/assets/images/common/ico-arrow02.svg" />
                      </span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 設定 -->
            <div class="user-list__setting">
              <div class="inner">
                <div class="user-list__title">設定</div>
                <ul>
                  <li>
                    <RouterLink :to="{ name: 'AccountSettingView' }">
                      メールアドレス・パスワード
                      <span class="ico-arrow02">
                        <img src="/src/assets/images/common/ico-arrow02.svg" />
                      </span>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink :to="{ name: 'SeekerNoticeIndex' }">
                      お知らせ機能
                      <span class="ico-arrow02">
                        <img src="/src/assets/images/common/ico-arrow02.svg" />
                      </span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>

              <!-- どこまで進んだ？あなたの就活 -->
              <div class="progress">
              <div class="progress-bg"><img src="/src/assets/images/mypage/progress-bg01.png"></div>
              <div class="inner">
              <div class="progress-title"><img src="/src/assets/images/mypage/progress-title.png"></div>
              <!--トーク回数-->
              <div class="progress-item flex">
              <div class="progress-item-count">
                <div class="progress-item-count-title maru">トーク回数</div>
                <div class="progress-item-count-no en">{{ stats.talk_count }}</div>
                <div class="progress-item-count-bg"><img src="/src/assets/images/mypage/progress-count-bg.svg"></div>
                </div>
              <div class="progress-item-img"><img src="/src/assets/images/mypage/progress-img01.png"></div>
              </div>

              <!--グッドした施設数-->
              <div class="progress-item flex flex-reverse">
              <div class="progress-item-count">
                <div class="progress-item-count-title maru">グッドした施設数</div>
                <div class="progress-item-count-no en">{{ stats.good_facility_count }}</div>
                <div class="progress-item-count-bg"><img src="/src/assets/images/mypage/progress-count-bg.svg"></div>
                </div>
              <div class="progress-item-img"><img src="/src/assets/images/mypage/progress-img02.png"></div>
              </div>

              <!--特集をみる-->
              <div class="progress-item flex">
              <div class="progress-item-count">
                <div class="progress-item-count-title maru">特集をみる</div>
                <div class="progress-item-count-no en">{{ stats.feature_views }}</div>
                <div class="progress-item-count-bg"><img src="/src/assets/images/mypage/progress-count-bg.svg"></div>
                </div>
              <div class="progress-item-img"><img src="/src/assets/images/mypage/progress-img01.png"></div>
              </div>
              </div>
              </div>

              <!-- 退会/ログアウト -->
              <div class="leave-wrap">
                <div class="progress-bg02">
                  <img src="/src/assets/images/mypage/progress-bg02.png">
                </div>
                <div class="inner">
                  <div class="btn-base maru">
                    <RouterLink :to="{ name: 'Logout' }"
                                @click="sessionStorage.setItem('app:logoutAt', String(Date.now()))">
                      ログアウト
                    </RouterLink>
                  </div>
                  <div class="btn-base maru">
                    <!-- ★ 退会は RouterLink 化 -->
                    <RouterLink :to="{ name: 'WithdrawIntro' }">退会</RouterLink>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      </section>
    </main>
  </div>

    <!-- 共通フッター -->
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
        <a href="/seeker/MyPage">
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

/* ------------ ログアウト ------------ */
// async function logout () {
//   try {
//     ['token','userId','userType'].forEach(k => localStorage.removeItem(k))
//   } catch (e) {
//     console.debug('[logout] storage clear skipped:', e)
//   }
//   await router.replace({ name: 'Logout' })
// }

/* ------------ API ------------ */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

/* ------------ state ------------ */
const loading = ref(true)
const profile = ref(null)
const qualIds = ref([])
const qualMaster = ref([])
const email = ref('')
const viewEmail = ref('')

/* ------------ helpers ------------ */
function toYMD (v) {
  if (!v) return ''
  if (v instanceof Date && !isNaN(+v)) {
    const y = v.getFullYear(), m = String(v.getMonth()+1).padStart(2,'0'), d = String(v.getDate()).padStart(2,'0')
    return `${y}-${m}-${d}`
  }
  if (typeof v === 'string') {
    const head = v.slice(0,10)
    const m = v.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})/)
    if (m) return `${m[1]}-${String(+m[2]).padStart(2,'0')}-${String(+m[3]).padStart(2,'0')}`
    if (/^\d{8}$/.test(v)) return `${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}`
    if (/^\d{4}-\d{2}-\d{2}$/.test(head)) return head
  }
  return ''
}

function pickViewRow(data) {
  if (!data) return null
  if (Array.isArray(data)) return data[0] || null
  if (data.profile) return data.profile
  if (data.item) return data.item
  const arr = data.items || data.rows || data.list || data.result || data.data
  if (Array.isArray(arr)) return arr[0] || null
  if (data.user_id || data.email || data.name_sei) return data
  return null
}

function resolveUserFromStorage () {
  const raw = localStorage.getItem('auth_user')
  if (raw) {
    try {
      const u = JSON.parse(raw)
      return { id: Number(u?.id) || null, email: u?.email || '' }
    } catch { /* no-op */ }
  }
  const idRaw = localStorage.getItem('userId')
  const id = idRaw ? Number(String(idRaw).replace(/"/g,'')) : null
  return { id: Number.isFinite(id) ? id : null, email: '' }
}

/* ------------ computed ------------ */
const displayName = computed(() => {
  const sei = profile.value?.name_sei || ''
  const mei = profile.value?.name_mei || ''
  return (sei + mei) || ''
})
const fullName = computed(() => {
  const sei = profile.value?.name_sei || ''
  const mei = profile.value?.name_mei || ''
  return (sei || mei) ? `${sei} ${mei}` : ''
})
const fullNameKana = computed(() => {
  const s = profile.value?.name_sei_kana || ''
  const m = profile.value?.name_mei_kana || ''
  return (s || m) ? `${s} ${m}` : ''
})
const postcodeFmt = computed(() => {
  const pc = String(profile.value?.postcode || '')
  if (!pc) return ''
  const d = pc.replace(/-/g,'')
  return d.length === 7 ? `〒${d.slice(0,3)}-${d.slice(3)}` : `〒${pc}`
})
const addressLine = computed(() => {
  const a = [
    postcodeFmt.value,
    profile.value?.prefectures || '',
    profile.value?.city || '',
    profile.value?.town || '',
    profile.value?.building || ''
  ].filter(Boolean).join('　')
  return a
})
const birthJp = computed(() => {
  const v = toYMD(profile.value?.birthdate)
  if (!v) return ''
  const [y,m,d] = v.split('-').map(Number)
  return `${y}年${m}月${d}日`
})
const ageText = computed(() => {
  const v = toYMD(profile.value?.birthdate)
  if (!v) return ''
  const [y,m,d] = v.split('-').map(Number)
  const today = new Date()
  let years = today.getFullYear() - y
  const bdThis = new Date(today.getFullYear(), m-1, d)
  if (today < bdThis) years--
  return (years >= 0 && years <= 120) ? `${years}歳` : ''
})
const genderText = computed(() => {
  const g = profile.value?.gender
  return g === 'male' ? '男性' : g === 'female' ? '女性' : g === 'other' ? 'その他' : ''
})

const qualNames = computed(() => {
  const t = profile.value?.qualifications_text
  if (t != null && String(t).trim()) {
    return String(t).split(/[\r\n,、]+/).map(s => s.trim()).filter(Boolean)
  }
  const ids = (qualIds.value || []).map(n => Number(n)).filter(Number.isFinite)
  if (ids.length && qualMaster.value.length) {
    const map = new Map(qualMaster.value.map(q => [Number(q.id), q.name]))
    return ids.map(id => map.get(id)).filter(Boolean)
  }
  return []
})

const displayEmail = computed(() => viewEmail.value || email.value || profile.value?.email || '')

/* ------------ navigation（直行版） ------------ */
function routeNameExists(name) {
  return !!router.getRoutes().find(r => r.name === name)
}
function canResolve(to) {
  const r = router.resolve(to)
  return r && r.matched && r.matched.length > 0
}

// async function goClips() {
//   try {
//     await router.push({ name: 'Jobs', query: { view: 'clips' } })
//   } catch (e) {
//     console.warn('[nav] goClips failed:', e)
//   }
// }

// async function goGoods() {
//   try {
//     await router.push({ name: 'Jobs', query: { view: 'goods' } })
//   } catch (e) {
//     console.warn('[nav] goGoods failed:', e)
//   }
// }

// async function goTalks() {
//   try {
//     // await router.push({ name: 'MyTalks' })
//     await router.push({ name: 'MyTalks', query: { view: 'talks' } })
//   } catch (e) {
//     console.warn('[nav] goTalks failed:', e)
//   }
// }

// async function goAccountSettingView() {
//   try {
//     await router.push({ name: 'AccountSettingView' })
//   } catch (e) {
//     console.warn('[nav] goAccountSettingView failed:', e)
//   }
// }

// /* ------------ お知らせ機能へ ------------ */
// async function goSeekerNotice () {
//   try {
//     await router.push({ name: 'SeekerNoticeIndex' })
//   } catch (e) {
//     console.warn('[nav] goSeekerNotice failed:', e)
//   }
// }

// /* ------------ 退会フローへ ------------ */
// async function goWithdraw() {
//   try {
//     await router.push({ name: 'WithdrawIntro' }) // /withdraw/intro へ
//   } catch (e) {
//     console.warn('[nav] goWithdraw failed:', e)
//  }
// }

/* プロフィール編集は従来通りフォールバック付き */
async function goEdit () {
  console.debug('[nav] edit clicked')
  const names = ['SeekerProfileEdit', 'SeekerProfileEditView', 'SeekerProfile']
  for (const n of names) {
    if (routeNameExists(n)) { await router.push({ name: n }).catch(()=>{}); return }
  }
  const paths = ['/seeker/profile/edit', '/mypage/profile/edit']
  for (const p of paths) {
    if (canResolve({ path: p })) { await router.push(p).catch(()=>{}); return }
  }
  alert('プロフィール編集へのルートが見つかりません。')
}

/* ------------ init ------------ */
onMounted(async () => {
  const u = resolveUserFromStorage()
  if (!u.id) { loading.value = false; return }
  email.value = u.email || ''

  try {
    const [qm, pf] = await Promise.all([
      API.get('/seekers/qualifications'),
      API.get(`/seekers/profile/${u.id}`)
    ])
    qualMaster.value = qm.data?.items || []
    profile.value = pf.data?.profile || {}
    qualIds.value = Array.isArray(pf.data?.qualifications) ? pf.data.qualifications : []

    try {
      const viewRes = await API.get(`/seekers/view/${u.id}`)
      const row = pickViewRow(viewRes?.data)
      if (row?.email) viewEmail.value = String(row.email)
      await fetchSeekerStats(u.id)
    } catch (e) {
      console.debug('[view-email] fallback to auth_user/profile:', e?.message)
    }
  } catch (e) {
    console.error('[seeker:mypage:init]', e?.message)
  } finally {
    loading.value = false
  }
})

// トーク回数、グッドした施設数、特集を見た数
const stats = ref({ talk_count: 0, good_facility_count: 0, feature_views: 0 })

async function fetchSeekerStats (userId) {
  try {
    console.log('userId:',userId)
    const { data } = await API.get('/stats/seeker/summary', {
      params: { user_id: userId },
      withCredentials: true,
      headers: { 'x-user-id': String(userId || 0) },
    })
    stats.value = {
      talk_count: Number(data?.talk_count || 0),
      good_facility_count: Number(data?.good_facility_count || 0),
      feature_views: Number(data?.feature_views || 0),
    }
    console.log('stats.value:',stats.value)
  } catch (e) {
    console.warn('[stats:seeker] skipped', e?.message)
  }
}

</script>


<style scoped>
.loading{ padding: 24px; text-align: center; color:#666; }

.card + .lists{ margin-top: 22px; }
.card-title{
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin: 6px 0 14px;
}

.profile-table{ margin: 0; }
.profile-table .row{
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
}
.profile-table .row:first-child{ border-top: 0; }
.profile-table dt{ color:#666; }
.profile-table dd{ margin: 0; }
.profile-table .sub{ color:#999; font-size: 13px; margin-top: 2px; }
.profile-table .pre{ white-space: pre-wrap; }

.actions{ display:flex; justify-content:center; margin-top: 14px; }
.btn.outline{
  background: #fff;
  color:#ff6a3d;
  padding: 12px 22px;
  border: 2px solid #ff6a3d;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.section-title{
  font-size: 18px;
  margin: 18px 0 10px;
  color:#444;
  font-weight: 700;
}

.lists{ background:#fffaf0; border:1px solid #f6e7cf; border-radius: 14px; padding: 8px 6px 4px; }
.list-item{
  width: 100%;
  background: #fff;
  border: 0;
  border-bottom: 1px solid #f0f0f0;
  padding: 14px 16px;
  display:flex; justify-content:space-between; align-items:center;
  font-size: 16px;
  cursor: pointer;
}
.list-item:last-child{ border-bottom: 0; }
.list-item .arrow{ color:#aaa; }

.user-list__activity {
  padding-top: 48px;
}
.user-list__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  padding-bottom: var(--padding-sm);
}
.user-list__activity button {
  font-size: var(--font-size-md);
  border-top: #c4c4c4 solid 1px;
}
.user-list__activity button span {
  display: block;
  padding: var(--padding-sm) var(--padding-xs);
  font-weight: 500;
  position: relative;
}
.user-list__setting {
  padding-top: var(--padding-xl);
  padding-bottom: var(--padding-lg);
}
.user-list__setting button {
  font-size: var(--font-size-md);
  border-top: #c4c4c4 solid 1px;
}
.user-list__setting button span {
  display: block;
  padding: var(--padding-sm) var(--padding-xs);
  font-weight: 500;
  position: relative;
}

.progress-item-count-title{
  margin-top: 15px;
  font-size: 20px;
}

.progress-item-count-no{
  margin-top: 35px;
  font-size: 100px;
}
/* 固定ヘッダーの下にタイトルが潜らないように上マージンを付与（スマホ） */
@media (max-width: 768px){
  .mypage-title {
    /* ヘッダーの実高さに合わせて 56px/64px など調整してください */
    margin-top: calc(64px + env(safe-area-inset-top, 0));
  }

  .progress-item-count-title{
  margin-top: -3px;
  font-size: 14px;
}

  .progress-item-count-no{
  margin-top: 5px;
  font-size: 50px;
}
}
</style>
