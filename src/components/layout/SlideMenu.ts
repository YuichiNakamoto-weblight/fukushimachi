// src/components/layout/SlideMenu.ts
// サイドメニュー

/* ★追加：ビルド後の実URLを使うため ?url で取り込む */
import siteLogoUrl from '@/assets/images/common/sitelogo.svg?url'

const STYLE_ID = 'slide-menu-style-v19'

const $ = <T extends Element = HTMLElement>(sel: string, base?: ParentNode) =>
  (base ?? document).querySelector<T>(sel)

/* ================= CSS ================= */
function injectStyleOnce() {
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = `
.slide-menu{
  position:fixed !important;
  inset:0 !important;
  z-index:3000 !important;
  background:transparent !important;
  width:auto !important; height:auto !important;
  pointer-events:none;
  overflow:hidden;
}
.slide-menu .sm-scrim{
  position:fixed; inset:0;
  background:transparent;
  pointer-events:none;
}
.slide-menu .slide-menu-wrap{
  position:fixed !important;
  top:0 !important; right:0 !important; bottom:0 !important; left:auto !important;
  width:100vw; height:100dvh;
  background:#ffff00;
  transform:translateX(101%);       /* ← 初期は必ず右にオフセット */
  /* 初期描画ではアニメーション無効 */
  transition:none !important;
  display:flex; flex-direction:column; overflow:auto;
  pointer-events:auto;
  box-shadow:none;
  will-change:transform;
}
/* 準備完了後（is-ready付与後）だけアニメーションを有効化 */
.slide-menu.is-ready .slide-menu-wrap{
  transition:transform .28s ease !important;
}
.slide-menu.is-open .slide-menu-wrap{ transform:translateX(0); }

@media (min-width:768px){
  .slide-menu .slide-menu-wrap{ width:min(720px,88vw); }
}
@media (min-width:1200px){
  .slide-menu .slide-menu-wrap{ width:min(760px,86vw); }
}

/* ✖ ボタン */
.slide-menu .sm-close{
  position:absolute;
  top:calc(env(safe-area-inset-top,0px) + 12px);
  right:calc(env(safe-area-inset-right,0px) + 12px);
  left:auto !important;
  width:64px; height:64px;
  border:none !important; outline:none !important;
  background:transparent !important; color:#111;
  display:grid; place-items:center;
  font-size:40px; line-height:1; cursor:pointer;
  box-shadow:none !important; border-radius:0 !important;
  -webkit-appearance:none; appearance:none;
  -webkit-tap-highlight-color:transparent;
}
.slide-menu .sm-close:focus,
.slide-menu .sm-close:focus-visible,
.slide-menu .sm-close:hover{
  outline:none !important; box-shadow:none !important; border:none !important; background:transparent !important;
}

.slide-menu-summary{ padding:48px 20px 10px; }

/* ロゴ画像サイズ */
.slide-menu-logo img{
  display:block;
  width:clamp(180px, 40vw, 220px); /* 最小180px, 画面幅に応じて最大220pxまで */
  height:auto;
}

/* ロゴ用ボタン（見た目は素の画像リンク） */
.sm-logo-btn{
  background:transparent; border:none; padding:0; margin:0;
  display:inline-block; cursor:pointer;
  -webkit-appearance:none; appearance:none;
}

.sm-list{ padding:14px 20px 28px; display:grid; gap:16px; }

/* 各ボタン */
.sm-btn{
  width:100%;
  /* 高さを詰める */
  height:48px;                /* 56px → 48px（さらに詰めたいなら 44px など） */
  padding-block:6px;          /* 上下パディングを明示的に少なめに */
  border:1px solid #000;
  border-radius:28px;
  background:#fff;
  color:#111;
  font-weight:400;
  font-size:15px;             /* 16px → 15px（視認性を保ちつつ若干縮小） */
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:none;
}


/* スマホでロゴを中央寄せ（他要素には影響させない） */
@media (max-width: 768px) {
  .slide-menu-logo {
    display: flex;
    justify-content: center;
  }
}

.sm-btn:active{ transform:translateY(1px); }

.__sm-lock{ overflow:hidden; }
`
  document.head.appendChild(el)
}

/* ============== helpers ============== */
function readUserId(): number {
  try {
    const cands = [
      localStorage.getItem('auth_user'),
      sessionStorage.getItem('auth_user'),
      localStorage.getItem('userId'),
      sessionStorage.getItem('userId'),
    ]
    for (const v of cands) {
      if (!v) continue
      if (/^\s*\d+\s*$/.test(v)) return Number(v)
      try {
        const o = JSON.parse(v!)
        const n = Number((o as any)?.id ?? (o as any)?.userId ?? (o as any)?.user?.id)
        if (Number.isFinite(n) && n > 0) return n
      } catch { /* noop */ }
    }
  } catch { /* noop */ }
  return 0
}
function normalize(v: string | null) {
  return (v ?? '').replace(/^['"]|['"]$/g, '').trim().toLowerCase()
}

/* ルーター非依存の遷移 */
function navigateHard(path: string) {
  try {
    // SPA遷移（失敗時は location でフォールバック）
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  } catch {
    window.location.assign(path)
  }
}

/* ============== mount ============== */
export function mountSlideMenu() {
  const root = $('.slide-menu') as HTMLElement | null
  const hamburger = $('.hamburger') as HTMLElement | null
  if (!root || !hamburger) return
  if (root.dataset.smInit === '1') return
  root.dataset.smInit = '1'

  injectStyleOnce()

  // 透明スクリーン
  let scrim = root.querySelector('.sm-scrim') as HTMLElement | null
  if (!scrim) {
    scrim = document.createElement('div')
    scrim.className = 'sm-scrim'
    root.appendChild(scrim)
  } else {
    ;(scrim as any).onclick = null
  }

  // パネル
  let wrap = root.querySelector('.slide-menu-wrap') as HTMLElement | null
  if (!wrap) {
    wrap = document.createElement('div')
    wrap.className = 'slide-menu-wrap'
    root.appendChild(wrap)
  }

  // ===== ログイン状態（リンク生成とロゴ遷移先に使用） =====
  const uid    = readUserId()
  const utype  = normalize(localStorage.getItem('userType'))
  const isSeeker   = !!uid && ['seeker','user','1','求職者'].includes(utype)
  const isEmployer = !!uid && ['employer','business','facility','2','事業者'].includes(utype)

  // ロゴは TopGate（"/"）へ。/public 直行だと beforeEnter で詰まるケースを避ける
  const logoHref = '/'

  let sum = wrap.querySelector('.slide-menu-summary') as HTMLElement | null
  if (!sum) {
    sum = document.createElement('div')
    sum.className = 'slide-menu-summary'
    wrap.appendChild(sum)
  }
  {
    const only = document.createElement('div')
    only.className = 'slide-menu-logo'
    // ★ ロゴは「ボタン」で実装して自前遷移（SPAのまま確実に画面遷移）
    only.innerHTML = `
      <button type="button" class="sm-logo-btn" aria-label="トップへ">
        <img src="${siteLogoUrl}" alt="ふくしまちHOME"/>
      </button>
    `
    sum.replaceChildren(only)

    // ロゴクリック → メニュー閉 → "/" へ遷移
    sum.addEventListener('click', (e) => {
      const t = e.target as Element
      const btn = t?.closest('.sm-logo-btn')
      if (!btn) return
      e.preventDefault()
      e.stopPropagation()
      closeMenu()
      setTimeout(() => navigateHard(logoHref), 40)
    })
  }

  // ✖ ボタン（右上）
  let closeBtn = wrap.querySelector('.sm-close') as HTMLButtonElement | null
  if (!closeBtn) {
    closeBtn = document.createElement('button')
    closeBtn.type = 'button'
    closeBtn.className = 'sm-close'
    closeBtn.setAttribute('aria-label', '閉じる')
    closeBtn.textContent = '✕'
    wrap.appendChild(closeBtn)
  }

  // メニューリスト
  let list = wrap.querySelector('.sm-list') as HTMLElement | null
  if (!list) {
    list = document.createElement('div')
    list.className = 'sm-list'
    wrap.appendChild(list)
  }

  type LinkDef = { label: string; to: string }
  const mypageTo = isEmployer ? '/business/mypage'
                : isSeeker  ? '/seeker/mypage'
                : '/login'

  const myhowTo = isEmployer ? '/biz/howtouse'
                : isSeeker  ? '/seeker/howtouse'
                : '/public/howtouse'

  const mycontact = isEmployer ? '/contact/employer'
                : isSeeker  ? '/contact/seeker'
                : '/contact'

  const links: LinkDef[] = [
    { label: '求人情報', to: '/jobs' },
    { label: 'お知らせ', to: '/news' },
    { label: '特集', to: '/news/office' },
    { label: 'マイページ', to: mypageTo },
    { label: 'サイトの使い方', to: myhowTo },
    { label: 'サイトに関するお問い合わせ', to: mycontact },
    { label: 'よくあるご質問', to: '/faq' },
  ]

  // ★ 介護事業者のみ「操作マニュアル」ボタンを追加

  const manualTo = '/manuals' // 例）'/biz/manual' などに変更可能
  if (isEmployer) {
    links.push({ label: '操作マニュアル', to: manualTo })
  }

  const makeBtn = (text: string, path: string, extra = '') => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = `sm-btn${extra ? ' ' + extra : ''}`
    b.textContent = text
    b.setAttribute('data-to', path)
    return b
  }
  list.replaceChildren(...links.map(l => makeBtn(l.label, l.to)))

  /* ====== 開閉 ====== */
  const openMenu = () => {
    root.classList.add('is-open')
    document.documentElement.classList.add('__sm-lock')
    hamburger.style.visibility = 'hidden'
    hamburger.style.pointerEvents = 'none'
    setTimeout(() => closeBtn?.focus(), 0)
  }
  const closeMenu = () => {
    root.classList.remove('is-open')
    document.documentElement.classList.remove('__sm-lock')
    hamburger.style.visibility = ''
    hamburger.style.pointerEvents = ''
  }

  /* ====== クリックガード ====== */
  const guardInsideClickCapture = (e: Event) => {
    const t = e.target as Element
    // ▼ ロゴボタンも許可（ここで止めない）
    if (t && (t.closest('.sm-close') || t.closest('.sm-btn') || t.closest('.sm-logo-btn'))) return
    e.stopPropagation()
    ;(e as any).stopImmediatePropagation?.()
  }
  wrap.addEventListener('click', guardInsideClickCapture, true)

  // ハンバーガー → 開く
  hamburger.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    openMenu()
  })

  // ✖ → 閉じる
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    closeMenu()
  })

  // 各ボタン → 閉じて遷移
  list.addEventListener('click', (e) => {
    const t = e.target as Element
    const btn = t.closest('.sm-btn') as HTMLElement | null
    if (!btn) return
    e.preventDefault()
    e.stopPropagation()
    const to = btn.getAttribute('data-to') || '/'
    closeMenu()
    setTimeout(() => navigateHard(to), 40)
  })

// Escape で閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) closeMenu()
  })

  // ★ 初期描画が完了してからアニメーションを有効化
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.add('is-ready')
    })
  })
}

/* 自動マウント */
export default function useSlideMenu() {
  if (typeof window === 'undefined') return
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try { mountSlideMenu() } catch (e) { console.warn('[SlideMenu] mount error:', e) }
    })
  } else {
    setTimeout(() => {
      try { mountSlideMenu() } catch (e) { console.warn('[SlideMenu] mount error:', e) }
    }, 0)
  }
}
