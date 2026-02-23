<!-- src/views/Contact/FaqPage.vue -->
 <!-- よくある質問ページ -->
<template>
  <body class="faq is-guest">
    <div class="wrap">
      <AppHeader data-app-header />
      <HamburgerMenu />
      <FooterNav />

      <main class="faq-page">
        <section class="l-sec">
          <div class="page-title maru">よくあるお問い合わせ</div>

          <ul class="faq-list" role="list">
            <li v-for="(it, i) in items" :key="i" class="faq-item">
              <!-- 質問行（Q + 太字質問文） -->
              <button
                class="q"
                type="button"
                :aria-expanded="opened[i] ? 'true' : 'false'"
                :aria-controls="`faq-panel-${i}`"
                :id="`faq-button-${i}`"
                @click="toggle(i)"
                @keydown.enter.prevent="toggle(i)"
                @keydown.space.prevent="toggle(i)"
              >
                <span class="q-left">
                  <span class="q-badge" aria-hidden="true">Q</span>
                  <span class="q-text" v-text="it.q" />
                </span>
                <span class="q-ico" aria-hidden="true">▾</span>
              </button>

              <!-- 回答ボックス（薄グレー背景＋枠） -->
              <div
                class="a-wrap"
                :id="`faq-panel-${i}`"
                role="region"
                :aria-labelledby="`faq-button-${i}`"
                :style="panelStyle(i)"
              >
                <div class="a-box">
                  <div class="a">
                    <span class="a-badge" aria-hidden="true">A</span>
                    <div class="a-text" v-html="it.a" />
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div class="btn-back">
            <a href="#" @click.prevent="$router.back()">
              <span class="ico"><img src="/src/assets/images/common/ico-back.svg" alt="戻る"></span>
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

/**
 *   - 質問: q（文字列）
 *   - 回答: a（HTML 可。改行は <br>）
 */
const items = ref([
  { q: '会員登録は必要ですか？',
    a: '求人詳細の閲覧や施設へのトーク・クリップ・グッドの送信には会員登録（無料）が必要です。' },
     { q: 'パスワードを忘れた場合はどうすればいいですか？',
    a: 'ログイン画面にある「パスワードをお忘れの方」リンクから再設定が可能です。登録しているメールアドレス宛に再設定用のURLが送信されますので、案内に従って新しいパスワードを設定してください。' },
     { q: '登録情報を変更したいのですが、どうすればいいですか？',
    a: 'ログイン後、マイページから「プロフィール編集」メニューを選択していただくことで、登録情報を変更できます。変更後は必ず「保存」ボタンを押して更新を完了してください。' },
     { q: 'アカウントを削除したいのですが、どうすればいいですか？',
    a: 'ログイン後、マイページの「アカウント設定」より「退会」手続きを行ってください。すべての情報が削除され、再度ご利用いただく場合は新規登録が必要になります。ご不明点がある場合は、お問い合わせフォームよりご連絡ください。' },
     { q: 'ログインできません。どうしたらいいですか？',
    a: 'まずは以下をご確認ください。<br>１.入力したメールアドレスとパスワードが正しいか<br>２.キーボードの大文字・小文字やスペースに誤りがないか<br>３.パスワードを忘れた場合は「パスワードをお忘れの方」から再設定をお願いします' },
     { q: 'サイトが正常に表示されません。',
    a: 'まずは以下をご確認ください。<br>１.ご利用のブラウザを最新版に更新してください<br>２.一度キャッシュを削除してから再読み込みをお試しください<br>３.別のブラウザやスマートフォンでアクセスして問題が解消するかご確認ください<br>それでも改善しない場合は、サイト側の一時的な不具合の可能性があります。時間をおいて再度アクセスいただくか、お問い合わせフォームより状況をご連絡ください<br><br>【推奨ブラウザについて】<br>当サイトは、より快適にご利用いただくために以下のブラウザでの閲覧を推奨しています。<br><br>スマートフォンの場合<br>iPhone：Safari（最新版）<br>Android：Google Chrome（最新版）<br>PCの場合<br>Google Chrome（最新版）<br>Microsoft Edge（最新版）<br>Safari（最新版・Macをご利用の場合）<br><br>※Internet Explorerなど一部の旧ブラウザでは、正しく表示されない場合があります。' },
     { q: 'マイページのプロフィール情報が消えた。',
    a: 'ログインしたブラウザを変えた場合に発生することがあります。<br>ログイン情報は同じブラウザ上で保存されます。<br>Google Chrome/Microsoft Edge/Safariなど<br>プロフィール情報が無い場合は一度ログアウトしてから再度ログインしてください。' },
])

// 開閉状態
const opened = ref([])

/* 初期化（全部閉じる） */
onMounted(() => {
  opened.value = items.value.map(() => false)
  // ハッシュ（#q3 など）が来たら該当項目を開く
  nextTick(() => {
    const m = String(location.hash || '').match(/^#q(\d+)$/i)
    if (m) {
      const idx = Number(m[1]) - 1
      if (idx >= 0 && idx < items.value.length) {
        opened.value[idx] = true
        // スクロール
        const el = document.getElementById(`faq-button-${idx}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })
  // ▼ ヘッダー高さを反映
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight, { passive: true })
 })

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})

// ===== スマホのヘッダー被り対策：実測高さ → CSS変数 =====
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

function toggle(i){
  opened.value[i] = !opened.value[i]
}

/** スムース開閉：height を 0 / scrollHeight にする */
function panelStyle(i){
  return {
    height: opened.value[i] ? 'auto' : '0px',
  }
}
</script>

<style scoped>
.faq-page{ max-width:960px; margin:0 auto; padding:20px 16px 48px; }
.page-title{ text-align:center; font-weight:800; font-size:24px; margin:8px 0 18px; }

/* リスト */
.faq-list{ list-style:none; padding:0; margin:0; display:grid; gap:12px; }

/* 各アイテム */
.faq-item{
  border:1px solid #e5e7eb; border-radius:14px; background:#fff;
  /* box-shadow:0 8px 24px rgba(0,0,0,.06); */
  overflow:hidden;
}

/* 質問ボタン */
.q{
  width:100%; text-align:left; display:flex; align-items:center; justify-content:space-between;
  gap:12px; background:#f9fafb; border:0; padding:16px 18px; cursor:pointer;
  font-size:16px; font-weight:700; color:#111827;
}
.q:hover{ background:#f3f4f6; }
.q:focus{ outline:3px solid rgba(99,102,241,.35); outline-offset:2px; }

.q-label{ display:flex; align-items:center; gap:10px; }
.q-badge{ display:inline-grid; place-items:center; width:24px; height:24px; border-radius:6px;
  color:#0d9adb; font-weight:800; }
.q-ico{ transition: transform .2s ease; }
[aria-expanded="true"] .q-ico{ transform: rotate(180deg); }

/* 回答ラッパ（高さアニメ） */
.a-wrap{
  background:#fff;
  transition: height .24s ease;
}

/* 回答本文 */
.a{ display:flex; gap:12px; padding:16px 30px 18px; }
.a-badge{ display:inline-grid; place-items:center; flex:0 0 24px; height:24px; border-radius:6px;
  color:#ff8566; font-weight:800; }
.a-text{ color:#111827; line-height:1.8; }

/* 戻る */
/* .btn-back{ text-align:center; margin:26px 0 0; }
.btn-back a{ display:inline-flex; align-items:center; gap:6px; color:#2563eb; font-weight:700; }
.btn-back a:hover{ text-decoration:underline; } */

/* モバイル微調整 */
@media (max-width:480px){
  .q{ font-size:15px; padding:14px 14px; }
  .a{ padding:14px; }
}

/* ▼ スマホでヘッダーに隠れないよう main を下げる */
@media (max-width: 768px){
  :root{ --header-height: 72px; } /* 初期値。JS の実測で上書きされます */
  .faq-page{
    /* 既存の上パディング(20px) + ヘッダー分を足す */
    padding-top: calc(var(--header-height) + 20px);
  }
  /* 先頭セクションの相殺マージン対策（保険） */
  .faq-page > .l-sec:first-child{ margin-top: 0; }
}
</style>
