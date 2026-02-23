<!-- src/views/Auth/BusinessMyPage.vue -->
<!-- 事業者用マイページ -->
<template>
  <body class="mypage-home is-employer is-login">
  <div class="wrap">
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <div class="content">
    <main>
      <section class="l-sec">
        <!-- タイトル -->
        <div class="page-title mypage-title maru">
            {{ titleName || '事業者' }} さんのマイページ
          </div>


        <div class="mypage-detail">
          <div class="inner">


            <!-- 読み込み -->
            <div v-if="loading" class="loading">読み込み中…</div>

            <div v-else>
              <!-- プロフィール -->
              <div class="user-profile__detail">
                <div class="user-profile__detail-title sec-title maru">プロフィール</div>

                <dl class="profile-table">
                  <div class="row">
                    <dt>事業所名</dt>
                    <dd>
                      <div>{{ profile?.business_name || '―' }}</div>
                      <div class="sub" v-if="profile?.business_kana">
                        {{ profile.business_kana }}
                      </div>
                    </dd>
                  </div>

                  <div class="row">
                    <dt>住所</dt>
                    <dd>{{ addressLine || '―' }}</dd>
                  </div>

                  <div class="row">
                    <dt>電話番号</dt>
                    <dd class="value">{{ profile?.phone || '―' }}</dd>
                  </div>

                  <div class="row">
                    <dt>メール</dt>
                    <dd class="value">{{ displayEmail || '―' }}</dd>
                  </div>

                  <div class="row">
                    <dt>担当者</dt>
                    <dd>
                      <div>{{ managerName || '―' }}</div>
                      <div class="sub" v-if="managerKana">
                        {{ managerKana }}
                      </div>
                    </dd>
                  </div>
                </dl>

                <div class="actions">
                  <button class="btn outline" @click="goEdit">
                    プロフィールを編集する
                  </button>
                </div>
                </div>
              </div>
              </div>

              <!-- 求人情報 -->
              <div class="mypage-content">
                <div class="user-list__activity">
                  <div class="inner">
                    <div class="user-list__title">求人情報</div>
                    <ul>
                      <!-- ★ RouterLink化 -->
                      <li>
                        <RouterLink :to="{ name: 'JobRegisterForm' }">
                          求人情報の登録
                          <span class="ico-arrow02">
                            <img src="/src/assets/images/common/ico-arrow02.svg" />
                          </span>
                        </RouterLink>
                      </li>
                      <li>
                        <RouterLink :to="{ name: 'BizJobsOpen' }">
                          募集中の求人
                          <span class="ico-arrow02">
                            <img src="/src/assets/images/common/ico-arrow02.svg" />
                          </span>
                        </RouterLink>
                      </li>
                      <li>
                        <RouterLink :to="{ name: 'BizJobsDraft' }">
                          下書き中の求人
                          <span class="ico-arrow02">
                            <img src="/src/assets/images/common/ico-arrow02.svg" />
                          </span>
                        </RouterLink>
                      </li>
                      <li>
                        <RouterLink :to="{ name: 'BizJobsPaused' }">
                          募集休止中の求人
                          <span class="ico-arrow02">
                            <img src="/src/assets/images/common/ico-arrow02.svg" />
                          </span>
                        </RouterLink>
                      </li>
                      <li>
                        <RouterLink :to="{ name: 'BizJobsClosed' }">
                          募集終了した求人
                          <span class="ico-arrow02">
                            <img src="/src/assets/images/common/ico-arrow02.svg" />
                          </span>
                        </RouterLink>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="user-list__activity">
                  <div class="inner">
                    <div class="user-list__title">施設からのお知らせ</div>
                    <ul>
                      <li><RouterLink to="/biz/announcements/new">お知らせの新規登録
                        <span class="ico-arrow02"><img src="/src/assets/images/common/ico-arrow02.svg" alt=""></span>
                        </RouterLink></li>
                      <li><RouterLink to="/business/announcements">掲載中のお知らせ一覧
                        <span class="ico-arrow02"><img src="/src/assets/images/common/ico-arrow02.svg" alt=""></span>
                        </RouterLink></li>
                      <li><RouterLink to="/business/announcements/End">終了したお知らせ一覧
                        <span class="ico-arrow02"><img src="/src/assets/images/common/ico-arrow02.svg" alt=""></span>
                        </RouterLink></li>
                    </ul>
                  </div>
                </div>

                <div class="user-list__activity">
                  <div class="inner">
                    <div class="user-list__title">一覧</div>
                    <ul>
                      <li> <RouterLink :to="{ name: 'BizGoodsList' }">グッド一覧
                        <span class="ico-arrow02"><img src="/src/assets/images/common/ico-arrow02.svg" alt=""></span>
                      </RouterLink></li>
                      <li><RouterLink :to="{ name: 'BizTalkList' }">トーク一覧
                        <span class="ico-arrow02"><img src="/src/assets/images/common/ico-arrow02.svg" alt=""></span>
                      </RouterLink></li>
                    </ul>
                  </div>
                </div>

                <div class="user-list__setting">
                  <div class="inner">
                    <div class="user-list__title">設定</div>
                      <ul>
                        <!-- <li><a href="setting/mail">メールアドレス・パスワード -->
                        <li><a href="#" @click.prevent="goAccountSettingView">メールアドレス・パスワード
                          <span class="ico-arrow02"><img src="/src/assets/images/common/ico-arrow02.svg" alt=""></span>
                          </a></li>
                        <li><a href="#" @click.prevent="goBizrNotice">お知らせ機能
                          <span class="ico-arrow02"><img src="/src/assets/images/common/ico-arrow02.svg" alt=""></span>
                          </a></li>
                      </ul>
                  </div>
                </div>

                <!-- どこまで進んだ？採用活動 -->
            <div class="progress">
                <div class="progress-bg"><img src="/src/assets/images/mypage/progress-bg01.png"></div>
                <div class="inner">
                  <div class="progress-title"><img src="/src/assets/images/mypage/employer-title.png"></div>

                  <!-- トーク回数 -->
                  <div class="progress-item flex">
                  <div class="progress-item-count">
                  <div class="progress-item-count-title maru">トーク回数</div>
                  <div class="progress-item-count-no en">{{ stats.talk_count }}</div>
                  <!-- <div class="progress-item-count-unit maru">回</div> -->
                  <div class="progress-item-count-bg"><img src="/src/assets/images/mypage/progress-count-bg-employer.svg"></div>
                  </div>
                  <!-- <div class="progress-item-img"><img src="/src/assets/images/mypage/progress-img01.png"></div> -->
                  <div class="progress-item-img"><img src="/src/assets/images/mypage/progress-img04.png" alt="トークを活用し施設の魅力を求職者に伝えましょう"/></div>
                </div>

                <!-- 特集の閲覧回数を出す -->
                <div class="progress-item flex flex-reverse">
                  <div class="progress-item-count">
                    <div class="progress-item-count-title maru">特集をみる</div>
                    <div class="progress-item-count-no en">{{ stats.feature_views }}</div>
                    <div class="progress-item-count-bg"><img src="/src/assets/images/mypage/progress-count-bg-employer.svg"></div>
                  </div>
                  <div class="progress-item-img"><img src="/src/assets/images/mypage/progress-img05.png" alt="他の介護施設の工夫やイベント情報などお仕事に役立ててください"></div>
                </div>
              </div>


              <div class="leave-wrap">
                <div class="progress-bg02">
                  <img src="/src/assets/images/mypage/progress-bg02.png">
                </div>
                  <div class="inner">
                    <div class="btn-base maru">
                      <RouterLink :to="{ name: 'Logout' }" @click="sessionStorage.setItem('app:logoutAt', String(Date.now()))">
                        ログアウト
                      </RouterLink>
                    </div>
                    <div class="btn-base maru">
                      <a href="#" @click.prevent="goWithdraw">退会</a>
                    </div>
                  </div>
              </div>
            </div>

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
import axios from 'axios'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

/* API */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' })
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

/* state */
const loading = ref(true)
const profile = ref(null)
const authEmail = ref('')

/* 候補IDを順に当てて最初に取れたプロフィールを使う */
// async function collectUserIdCandidates () {
//   const ids = new Set()

//   // 1) /auth/me（JWT が正しければ最優先）
//   try {
//     const { data } = await API.get('/auth/me')
//     const id = Number(data?.id ?? data?.user_id ?? 0)
//     if (id) ids.add(id)
//     const em = String(data?.email ?? '').trim()
//     if (em) authEmail.value = em
//   } catch (e) {
//     if (import.meta.env.DEV) console.debug('[auth/me] skip:', e?.message)
//   }

//   // 2) local/session の JSON or 数値
// const parseStoreValue = (raw) => {
//   if (!raw) return
//   try {
//     const o = JSON.parse(raw)
//     const id = Number(o?.id ?? o?.userId ?? o?.user?.id ?? 0)
//     if (id) ids.add(id)
//     const em = String(o?.email ?? o?.user?.email ?? o?.contact_email ?? '').trim()
//     if (em && !authEmail.value) authEmail.value = em
//   } catch {
//     const n = Number(String(raw).replace(/"/g, ''))
//     if (Number.isFinite(n) && n > 0) ids.add(n)
//   }
// }

//   const jsonKeys = ['user', 'auth_user', 'authUser', 'currentUser']
//   const idKeys   = ['userId', 'uid']
//   for (const store of [localStorage, sessionStorage]) {
//     jsonKeys.forEach(k => parseStoreValue(store.getItem(k)))
//     idKeys.forEach(k => parseStoreValue(store.getItem(k)))
//   }

//   // 3) URL クエリ (?uid=...)
//   const q = new URLSearchParams(window.location.search || '')
//   const qid = Number(q.get('uid') ?? q.get('userId') ?? 0)
//   if (qid) ids.add(qid)

//   return Array.from(ids)
// }

/* 候補IDを順に当てて最初に取れたプロフィールを使う */
// async function loadBusinessProfile () {
//   const ids = await collectUserIdCandidates()
//   for (const id of ids) {
//     const urls = [
//       `/business/profile/${id}`,
//       `/business/profiles/${id}`,
//       `/business/profile?user_id=${id}`,
//       `/business/profile/by-user/${id}`,
//     ]
//     for (const url of urls) {
//       try {
//         const { data } = await API.get(url)
//         const row  = pickProfileRow(data)
//         const norm = normalizeBusinessProfile(row)
//         if (norm) {
//           profile.value = norm
//           return true
//         }
//       } catch (e) {
//         if (import.meta.env.DEV) console.debug('[business/profile] 404/NG:', url, e?.message)
//       }
//     }
//   }
//   return false
// }

// function resolveUserId () {
//   const pick = (raw) => {
//     if (!raw) return null
//     try {
//       const v = JSON.parse(raw)
//       if (typeof v === 'number') return v > 0 ? v : null
//       if (typeof v === 'string') return Number(v) || null
//       if (typeof v === 'object' && v) {
//         return Number(v.id ?? v.userId ?? v.user?.id ?? 0) || null
//       }
//     } catch {
//       const n = Number(String(raw).replace(/"/g,''))
//       return Number.isFinite(n) && n > 0 ? n : null
//     }
//     return null
//   }

//   return (
//     pick(localStorage.getItem('userId')) ??
//     pick(sessionStorage.getItem('userId')) ??
//     pick(localStorage.getItem('auth_user')) ??
//     (() => {
//       const q = new URLSearchParams(window.location.search || '')
//       const n = Number(q.get('uid') ?? q.get('userId') ?? 0)
//       return Number.isFinite(n) && n > 0 ? n : null
//     })()
//   )
// }

function pickProfileRow (data) {
  if (!data) return null
  if (data.profile && typeof data.profile === 'object') return data.profile
  if (data.item && typeof data.item === 'object') return data.item
  const arr = data.items || data.rows || data.list || data.result || data.data
  if (Array.isArray(arr) && arr.length) return arr[0]
  if (data.user_id || data.business_name) return data
  return null
}

function normalizeBusinessProfile (row) {
  if (!row || typeof row !== 'object') return null
  const toNum = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null }
  return {
    user_id: toNum(row.user_id),
    business_name: row.business_name ?? '',
    business_kana: row.business_kana ?? '',
    postcode: String(row.postcode ?? ''),
    prefecture_id: toNum(row.prefecture_id),
    prefectures: row.prefectures ?? null,
    city: row.city ?? '',
    address_line1: row.address_line1 ?? '',
    address_line2: row.address_line2 ?? '',
    phone: String(row.phone ?? ''),
    certification_id: toNum(row.certification_id),
    manager_last_name: row.manager_last_name ?? '',
    manager_first_name: row.manager_first_name ?? '',
    manager_last_name_kana: row.manager_last_name_kana ?? '',
    manager_first_name_kana: row.manager_first_name_kana ?? '',
    contact_email: row.contact_email ?? '',
  }
}

async function loadBusinessProfileById (id) {
  const { data } = await API.get(`/business/profile/${id}`) // ★ここだけ叩く
  const row = pickProfileRow(data)
  const norm = normalizeBusinessProfile(row)
  if (norm) { profile.value = norm; return true }
  return false
}

// これを追加（URLや他キーは見ない、localStorage限定＆employer限定）
function resolveUserIdStrict () {
  // token がある場合は /auth/me を使うので、localStorageの userId は使わない
  const hasToken = !!localStorage.getItem('token')
  if (hasToken) return null

  // localStorage の userId のみ、厳格に数値判定
  const raw = localStorage.getItem('userId')
  const t   = String(localStorage.getItem('userType') || '').trim().toLowerCase()

  // 事業者以外なら拒否
  if (t && t !== 'employer') return null

  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}


// onMounted(async () => {
//   try {
//     const uid = resolveUserId()
//     if (!uid) return
//     await loadBusinessProfileById(uid)
//     await fetchBizStats(uid)   // ← 追加
//   } catch (e) {
//     console.error('[business:mypage]', e?.message)
//   } finally {
//     loading.value = false
//   }
// })



/* 表示用 computed */
const postcodeFmt = computed(() => {
  const pc = String(profile.value?.postcode || '')
  if (!pc) return ''
  const d = pc.replace(/-/g, '')
  return d.length === 7 ? `〒${d.slice(0,3)}-${d.slice(3)}` : `〒${pc}`
})
const titleName   = computed(() => profile.value?.business_name || '')
const addressLine = computed(() =>
  [postcodeFmt.value, profile.value?.prefectures, profile.value?.city,
   profile.value?.address_line1, profile.value?.address_line2]
   .filter(Boolean).join('　')
)
const managerName = computed(() => {
  const s = profile.value?.manager_last_name || ''
  const m = profile.value?.manager_first_name || ''
  return (s || m) ? `${s} ${m}` : ''
})
const managerKana = computed(() => {
  const s = profile.value?.manager_last_name_kana || ''
  const m = profile.value?.manager_first_name_kana || ''
  return (s || m) ? `${s} ${m}` : ''
})
const displayEmail = computed(() =>
  profile.value?.contact_email || authEmail.value || ''
)

function routeNameExists(name){ return !!router.getRoutes().find(r => r.name === name) }
function canResolve(to){ const r = router.resolve(to); return r?.matched?.length > 0 }
// async function navName(name){
//   if (routeNameExists(name)) { await router.push({ name }).catch(()=>{}); return }
//   alert(`${name} へのルートが見つかりません。`)
// }
async function navAny(candidates){
  for (const to of candidates){
    try {
      if (to.name && routeNameExists(to.name)) { await router.push({ name: to.name }); return }
      if (to.path && canResolve({ path: to.path })) { await router.push({ path: to.path }); return }
    } catch (err) {
      console.debug('[navAny] candidate failed:', to, err?.message)
    }
  }
  alert('遷移先ルートが見つかりません。')
}
async function goEdit () {
  await navAny([
    { name: 'BusinessProfileEdit' },
    { path: '/business/profile/edit' },
    { name: 'BusinessProfileView' },
    { path: '/profile/business' },
  ])
}

async function goAccountSettingView() {
  try {
    await router.push({ name: 'AccountSettingView' })
  } catch (e) {
    console.warn('[nav] goAccountSettingView failed:', e)
  }
}

/* ------------ お知らせ機能へ ------------ */
async function goBizrNotice () {
  try {
    await router.push({ name: 'BizNoticeIndex' })
  } catch (e) {
    console.warn('[nav] goBizrNotice failed:', e)
  }
}

/* ------------ 退会フローへ ------------ */
async function goWithdraw() {
  try {
    await router.push({ name: 'WithdrawIntro' }) // /withdraw/intro へ
  } catch (e) {
    console.warn('[nav] goWithdraw failed:', e)
 }
}

/* init */
onMounted(async () => {
  try {
    let uid = null

    // 1) token があれば /auth/me を唯一の真実として使う
    if (localStorage.getItem('token')) {
      try {
        const me = await API.get('/auth/me')
        uid = Number(me?.data?.id ?? me?.data?.user_id ?? 0) || null
        authEmail.value = String(me?.data?.email ?? '').trim()
      } catch (e) {
        // token が壊れていたら uid は null のまま → 次の手段へ
        if (import.meta.env.DEV) console.debug('[auth/me] skip:', e?.message)
      }
    }

    // 2) /auth/me で取れなかった場合のみ、localStorage.userId を安全に使用
    if (!uid) {
      uid = resolveUserIdStrict()
    }

    if (!uid) {
      console.warn('[business:mypage] userId が特定できません（employer で未ログイン or 不正）')
      return
    }

    // 3) 従来通り /business/profile/:id を叩く（APIは変更しない）
    await loadBusinessProfileById(uid)

    // 4) 統計（必要なら）
    await fetchBizStats(uid)

  } catch (e) {
    console.error('[business:mypage]', e?.message)
  } finally {
    loading.value = false
  }
})


//
const stats = ref({ talk_count: 0, feature_views: 0 })

async function fetchBizStats (userId) {
  try {
    const { data } = await API.get('/stats/employer/summary', {
      params: { user_id: userId },
      withCredentials: true,
      headers: { 'x-user-id': String(userId || 0) },
    })
    stats.value = {
      talk_count: Number(data?.talk_count || 0),
      feature_views: Number(data?.feature_views || 0),
    }
  } catch (e) {
    console.warn('[stats:biz] skipped', e?.message)
  }
}

</script>


<style scoped>
.content{ margin-top: -15px;}
.loading{ padding:24px; text-align:center; color:#666; }

.card{
  background:#fff; border:1px solid #eee; border-radius:14px;
  padding:18px; box-shadow:0 4px 14px rgba(0,0,0,.04);
}
.card + .lists{ margin-top:22px; }
.card-title{ font-size:20px; font-weight:700; text-align:center; margin:6px 0 14px; }

.profile-table .row{
  display:grid; grid-template-columns:120px 1fr;
  gap:10px; padding:12px 0; border-top:1px solid #cbcbcb;
}
.profile-table .row:first-child{ border-top:0; }
.profile-table dt{ color:#040404; }
.profile-table dd{ margin:0; }
.profile-table .sub{ color:#090909; font-size:13px; margin-top:2px; }

.actions{ display:flex; justify-content:center; margin-top:14px; }
.btn.outline{
  background:#fff; color:#0ea5e9; padding:12px 22px;
  border:2px solid #0ea5e9; border-radius:999px; font-weight:700; cursor:pointer;
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
  margin-top: 6px;
  font-size: 60px;
}
}
</style>
