<!-- src/views/Contact/ManualPage.vue -->
<template>
  <body class="manuals is-guest">
    <div class="wrap">
      <AppHeader data-app-header />
      <HamburgerMenu />
      <FooterNav />

      <main class="manuals-page">
        <section class="l-sec">
          <div class="page-title maru">ふくしまち操作マニュアル</div>

          <!-- まずはこちらから！（単一ボタン） -->
          <h2 class="section-title maru">まずはこちらから！ </h2>
          <ul class="link-list maru is-compact is-single" role="list" style="--single-max: 600px;">
            <li class="link-item maru">
              <a
                class="pdf-link"
                :href="urls.all"
                :download="filenames.all"
                target="_blank"
                rel="noopener"
                @click.prevent="downloadOrOpen(urls.all, filenames.all)"
                aria-label="操作マニュアル（全体版）をダウンロード or 新しいページで開く"
              >
                操作マニュアル（全体版）<span class="badge">PDF(15MB)</span>
              </a>
            </li>
          </ul>

          <!-- テーマ別（1列固定。幅は --single-max で調整） -->
          <h2 class="section-title maru">やりたいことに合わせてテーマ別マニュアルをチェック！</h2>
          <ul class="link-list maru is-compact is-single" role="list" style="--single-max: 600px;">
            <li class="link-item maru">
              <a class="pdf-link" :href="urls.newregist" :download="filenames.newregist" target="_blank" rel="noopener"
                 @click.prevent="downloadOrOpen(urls.newregist, filenames.newregist)">
                新規登録 <span class="badge">PDF(2MB)</span>
              </a>
            </li>
            <li class="link-item maru">
              <a class="pdf-link" :href="urls.jobregist" :download="filenames.jobregist" target="_blank" rel="noopener"
                 @click.prevent="downloadOrOpen(urls.jobregist, filenames.jobregist)">
                求人 <span class="badge">PDF(490KB)</span>
              </a>
            </li>
            <li class="link-item maru">
              <a class="pdf-link" :href="urls.login" :download="filenames.login" target="_blank" rel="noopener"
                 @click.prevent="downloadOrOpen(urls.login, filenames.login)">
                ログイン <span class="badge">PDF(2MB)</span>
              </a>
            </li>
            <li class="link-item maru">
              <a class="pdf-link" :href="urls.top" :download="filenames.top" target="_blank" rel="noopener"
                 @click.prevent="downloadOrOpen(urls.top, filenames.top)">
                トップページとメニュー一覧 <span class="badge">PDF(940KB)</span>
              </a>
            </li>
            <li class="link-item maru">
              <a class="pdf-link" :href="urls.mypage" :download="filenames.mypage" target="_blank" rel="noopener"
                 @click.prevent="downloadOrOpen(urls.mypage, filenames.mypage)">
                マイページ <span class="badge">PDF(5.8MB)</span>
              </a>
            </li>
            <li class="link-item maru">
              <a class="pdf-link" :href="urls.jobinfo" :download="filenames.jobinfo" target="_blank" rel="noopener"
                 @click.prevent="downloadOrOpen(urls.jobinfo, filenames.jobinfo)">
                求人情報 <span class="badge">PDF(1.3MB)</span>
              </a>
            </li>
            <li class="link-item maru">
              <a class="pdf-link" :href="urls.others" :download="filenames.others" target="_blank" rel="noopener"
                 @click.prevent="downloadOrOpen(urls.others, filenames.others)">
                その他<br>（特集／サイトの使い方／お問合わせ／よくあるご質問／ふくしまちをスマートフォン画面に保存）
                <span class="badge">PDF(2.4MB)</span>
              </a>
            </li>
          </ul>

          <div class="btn-back">
            <a href="#" @click.prevent="$router.back()">
              <span class="ico"><img src="/src/assets/images/common/ico-back.svg" alt="" /></span>
              戻る
            </a>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
    <PcModel />
  </body>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const base = import.meta.env.BASE_URL
const join = (a, b) => `${a.endsWith('/') ? a.slice(0,-1) : a}/${b.startsWith('/') ? b.slice(1) : b}`

const urls = computed(() => ({
  all:       join(base, '/assets/manual/manual_all.pdf'),
  newregist: join(base, '/assets/manual/manual_newregist.pdf'),
  jobregist: join(base, '/assets/manual/manual_jobregist.pdf'),
  login:     join(base, '/assets/manual/manual_login.pdf'),
  top:       join(base, '/assets/manual/manual_top.pdf'),
  mypage:    join(base, '/assets/manual/manual_mypage.pdf'),
  jobinfo:   join(base, '/assets/manual/manual_jobinfo.pdf'),
  others:    join(base, '/assets/manual/manual_others.pdf'),
}))

const filenames = {
  all: 'manual_all.pdf', newregist: 'manual_newregist.pdf', jobregist: 'manual_jobregist.pdf',
  login: 'manual_login.pdf', top: 'manual_top.pdf', mypage: 'manual_mypage.pdf',
  jobinfo: 'manual_jobinfo.pdf', others: 'manual_others.pdf',
}

async function downloadOrOpen (url, filename) {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = filename || (url.split('/').pop() ?? 'file.pdf')
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

function updateHeaderHeight () {
  const headerEl = document.querySelector('[data-app-header]') || document.querySelector('header')
  if (!headerEl) return
  const h = Math.round(headerEl.getBoundingClientRect().height)
  if (h > 0) document.documentElement.style.setProperty('--header-height', `${h}px`)
}
onMounted(() => { updateHeaderHeight(); window.addEventListener('resize', updateHeaderHeight, { passive: true }) })
onBeforeUnmount(() => { window.removeEventListener('resize', updateHeaderHeight) })
</script>

<style scoped>
.maru { font-family: "Zen Maru Gothic", sans-serif; }
.manuals-page { max-width: 960px; margin: 0 auto; padding: 20px 16px 56px; }

/* タイトル・見出しを中央寄せ */
.page-title { text-align: center; font-weight: 800; font-size: 24px; margin: 8px 0 18px; }
.section-title { text-align: center; font-weight: 800; font-size: 18px; margin: 50px 0 15px; color: #2563eb; }

/* リスト基礎 */
.link-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 18px; }
.link-item { border: 1px solid #e5e7eb; border-radius: 12px; background: #36aee2; }

/* ボタン（中央寄せの見た目を保つ） */
.pdf-link { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; text-decoration: none; color: #ffffff; font-weight: 700; }
.pdf-link:hover { background: #f9fafb; color: #000000; }
.badge { display: inline-block; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: #eff6ff; color: #2563eb; }

/* ===== ボタン位置：中央揃え ===== */
/* 複数列でも中央に */
.manuals-page .link-list.is-compact { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); justify-content: center; }
/* 1列固定でも中央に */
.manuals-page .link-list.is-compact.is-single { grid-template-columns: 1fr !important; justify-content: center; }
/* カード自体も中央に（幅を絞る場合に効く） */
.manuals-page .link-list .link-item { width: 100%; max-width: none; margin-left: auto; margin-right: auto; }
/* 1列時の最大幅（ULの style で --single-max を調整） */
.manuals-page .link-list.is-compact.is-single .link-item { max-width: var(--single-max, 360px); }

/* スマホは1列でOK（任意） */
@media (max-width: 480px) { .manuals-page .link-list.is-compact { grid-template-columns: 1fr; } }

/* ヘッダーの下に押し下げ（既存） */
@media (max-width: 768px) {
  :root { --header-height: 72px; }
  .manuals-page { padding-top: calc(var(--header-height) + 20px); }
}
</style>
