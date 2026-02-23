<!-- src/views/Auth/BusinessProfileEditComplete.vue -->
<template>
  <div class="wrap is-employer">
    <!-- 共通ヘッダー -->
    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec complete">
        <div class="inner">
          <h1 class="title">プロフィールを更新しました</h1>
          <p class="lead">プロフィールを更新しました</p>

          <div class="actions">
            <button class="btn outline" type="button" @click="goMyPage">
              マイページへ
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 共通フッター -->
    <AppFooter />

    <!-- 背景（任意） -->
    <div class="body-bg pc">
      <img :src="bgPc" alt="" />
    </div>
  </div>
  <PcModel />
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import bgPc from '@/assets/images/common/bg-pc.png'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()

function routeNameExists (name) {
  return !!router.getRoutes().find(r => r.name === name)
}
function canResolve (to) {
  const r = router.resolve(to)
  return r && r.matched && r.matched.length > 0
}

async function goMyPage () {
  const nameCandidates = [
    'BusinessMyPage',
    'EmployerMyPage',
    'FacilityDashboard',
    'SeekerMyPage'
  ]
  for (const n of nameCandidates) {
    if (routeNameExists(n)) {
      try {
        await router.push({ name: n })
        return
      } catch (err) {
        // 次候補へ（開発時のみログ）
        if (import.meta.env.DEV) console.debug('[goMyPage:name]', n, err?.message)
      }
    }
  }

  const pathCandidates = [
    '/employer/mypage',
    '/business/mypage',
    '/dashboard/facility',
    '/seeker/MyPage'
  ]
  for (const p of pathCandidates) {
    if (canResolve({ path: p })) {
      try {
        await router.push(p)
        return
      } catch (err) {
        // 次候補へ（開発時のみログ）
        if (import.meta.env.DEV) console.debug('[goMyPage:path]', p, err?.message)
      }
    }
  }

  // 最終フォールバック
  window.location.assign('/employer/mypage')
}

</script>

<style scoped>
.complete { padding: 60px 0 80px; }
.inner { max-width: 760px; margin: 0 auto; text-align: center; }
.title {
  font-size: 26px; font-weight: 700; color: #333; margin-bottom: 16px;
}
.lead { color: #666; margin-bottom: 24px; }
.actions { margin-top: 8px; display: flex; justify-content: center; }
.btn.outline{
  background:#fff; color:#42b2e6; padding:12px 28px;
  border:2px solid #42b2e6; border-radius:999px; font-weight:700; cursor:pointer;
}
.body-bg img { width: 100%; height: auto; display: block; opacity: .08; }
</style>
