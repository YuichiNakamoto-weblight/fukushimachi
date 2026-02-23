<!-- src/views/TopView.vue -->

<template>
  <div class="top">

    <!-- 共通ヘッダー -->
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />


    <!-- 上部ツールバー（sticky） -->
    <header class="toolbar">
      <div class="toolbar-inner">
        <div class="brand" aria-label="site brand">ふくしまちケア</div>

        <nav class="links" aria-label="トップリンク">
          <router-link class="cta-contact" :to="{ name: 'InquiryForm' }">お問い合わせ</router-link>
          <span class="dot" aria-hidden="true">•</span>

          <!-- 常時表示するログアウトボタン -->
          <button class="link as-button logout-btn" type="button" @click="logout">
            ログアウト
          </button>

          <span class="dot" aria-hidden="true">•</span>
          <router-link to="/settings/MailReceiveSetting" class="link">メール受信設定</router-link>

          <span class="dot" aria-hidden="true">•</span>
          <router-link to="/public" class="link">ログイン前TOPページ</router-link>
        </nav>
      </div>
    </header>

    <!-- メイン：3ブロック -->
    <main class="content">
      <div class="blocks">
        <!-- ログイン前 -->
        <section class="block">
          <h2 class="block-title">ログイン前</h2>
          <div class="btnrow">
            <button class="btn -blue" @click="go('RegisterChoice')">アカウント登録</button>
            <router-link to="/login" class="btn -indigo as-button">ログイン</router-link>
            <!-- ▼ 追加：誰でも閲覧できる お知らせ一覧 -->
            <router-link :to="{ name: 'NewsPublic' }" class="btn -emerald as-button">📰 お知らせ一覧（公開）</router-link>
          </div>
        </section>

        <!-- 求職者 -->
        <section class="block">
          <h2 class="block-title">👤 求職者</h2>
          <div class="btnrow" aria-label="求職者メニュー">
            <button class="btn -teal"    @click="go('SeekerMyPage')">マ求職者イページ</button>
            <button class="btn -rose"    @click="goList('clips')">📎 クリップ一覧</button>
            <button class="btn -pink"    @click="goList('goods')">👍 グッド一覧</button>
            <button class="btn -orange"  @click="goList('talks')">💬 トーク一覧</button>
            <button class="btn -emerald" @click="go('Jobs')">🔎 求人一覧</button>
          </div>
        </section>

        <!-- 事業者 -->
        <section class="block">
          <h2 class="block-title">🏢 事業者</h2>
          <div class="btnrow" aria-label="事業者メニュー">
            <button class="btn -teal"    @click="go('BusinessMyPage')">🏢 事業者マイページ</button>
            <button class="btn -fuchsia" @click="go('JobRegisterForm')">📝 求人登録</button>
            <button class="btn -blue"    @click="goBiz('open')">募集中の求人</button>
            <button class="btn -orange"  @click="goBiz('paused')">募集休止中の求人</button>
            <button class="btn -rose"    @click="goBiz('closed')">募集終了した求人</button>
            <button class="btn -indigo"  @click="go('BizGoodsList')">👍 グッド一覧（事業者）</button>
            <button class="btn -indigo"  @click="go('BizTalkList')">💬 トーク一覧（事業者）</button>
            <button class="btn -emerald" @click="go('AnnouncementCreate')">📰 お知らせ新規登録</button>
          </div>
        </section>
      </div>

    </main>

          <AppFooter />
  </div>
    <PcModel />
</template>

<script setup>
import { useRouter } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
const router = useRouter()

// ログアウト処理
const logout = async () => {
  try {
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    await router.replace({ name: 'Login' })
  } catch (e) {
    console.error('[logout] failed:', e)
  }
}

// 遷移用関数
const go = async (name) => { try { await router.push({ name }) } catch (e) { console.error(e) } }
const goList = async (view) => { try { await router.push({ name: 'Jobs', query: { view } }) } catch (e) { console.error(e) } }
const goBiz = async (status) => {
  const name = status === 'paused' ? 'BizJobsPaused'
              : status === 'closed' ? 'BizJobsClosed'
              : 'BizJobsOpen'
  try { await router.push({ name }) } catch (e) { console.error(e) }
}
</script>

<style scoped>
:root{ --bg1:#f7fafc; --bg2:#eef2ff; --text:#111827; --muted:#6b7280; --ring:rgba(99,102,241,.35);
  --panel:#ffffffcc; --panel2:#ffffff; --shadow:0 10px 30px rgba(0,0,0,.12); }
.top{ min-height:100vh; background:
  radial-gradient(1000px 500px at 85% -20%, var(--bg2), transparent 50%),
  radial-gradient(900px 500px at -10% 100%, #e0f2fe, transparent 55%),
  var(--bg1); }

.toolbar{ position: sticky; top: 0; z-index: 50; backdrop-filter: blur(10px);
  background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.65));
  border-bottom: 1px solid rgba(255,255,255,.7); box-shadow: 0 6px 24px rgba(0,0,0,.08); }
.toolbar-inner{ max-width:1200px; margin:0 auto; padding:10px 16px;
  display:flex; align-items:center; gap:16px; justify-content:space-between; }
.brand{ font-weight:900; letter-spacing:.03em; color:#111827; }

.content{ max-width: 1100px; margin: 24px auto; padding: 0 16px; }
.blocks{ display:grid; gap:18px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.block{ background: var(--panel); border: 1px solid rgba(255,255,255,.78); backdrop-filter: blur(6px);
  border-radius: 16px; padding: 16px; box-shadow: var(--shadow); }
.block-title{ font-size: 14px; font-weight: 800; letter-spacing: .04em; color: var(--muted); margin-bottom: 10px; }

.links{ white-space:nowrap; }
.link{ color:#374151; text-decoration:none; border-bottom:1px dashed rgba(55,65,81,.4); background:none; }
.link:hover{ color:#111827; border-color:rgba(17,24,39,.7); }
.cta-contact{ margin-right:12px; text-decoration:none; }
.dot{ margin: 0 .5rem; color:#9ca3af; }
.as-button{ display:inline-flex; align-items:center; border:none; padding:0; cursor:pointer; background:none; }

.btnrow{ display:flex; gap:8px; flex-wrap: wrap; }
.btn{ appearance:none; border:none; border-radius: 12px; padding: 10px 12px; font-size: 14px; font-weight: 800; letter-spacing:.02em; color:#fff; cursor:pointer;
  display:inline-flex; align-items:center; justify-content:center; gap:.5rem; box-shadow: 0 6px 18px rgba(0,0,0,.12);
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease; white-space: nowrap; }
.btn:hover{ transform: translateY(-1px); filter: brightness(1.03); }
.btn:active{ transform: translateY(0);   filter: brightness(.98); }
.btn:focus-visible{ outline:3px solid var(--ring); outline-offset:2px; }
.btn.-blue    { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.btn.-indigo  { background: linear-gradient(135deg, #6366f1, #4f46e5); }
.btn.-rose    { background: linear-gradient(135deg, #f43f5e, #e11d48); }
.btn.-pink    { background: linear-gradient(135deg, #ec4899, #db2777); }
.btn.-orange  { background: linear-gradient(135deg, #fb923c, #f97316); color:#1f2937; }
.btn.-emerald { background: linear-gradient(135deg, #10b981, #059669); }
.btn.-teal    { background: linear-gradient(135deg, #14b8a6, #0d9488); }
.btn.-fuchsia { background: linear-gradient(135deg, #d946ef, #a21caf); }

.logout-btn{ font-weight:700; color:#ef4444; border:none; background:none; cursor:pointer; }
.logout-btn:hover{ text-decoration: underline; }
</style>
