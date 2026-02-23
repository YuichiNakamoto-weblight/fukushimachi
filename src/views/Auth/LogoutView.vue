<!-- src/views/Auth/LogoutView.vue -->
 <!-- ログアウト完了ページ -->
<template>
    <div class="logout">
        <div class="wrap">
            <AppHeader />
            <!-- <HamburgerMenu /> -->
            <!-- <FooterNav /> -->

            <div class="content">
                <main>
                    <section class="l-sec mypage-detail">
                        <div class="page-title maru">ログアウト</div>
                            <div class="inner">
                                <p class="txt-center">ログアウトしました。</p>
                                  <div class="btn-base maru">
                                    <button type="button" class="btn-outline" @click="goTopPublic">
                                      トップページへ
                                    </button>
                                  </div>
                            </div>
                    </section>
                </main>
            </div>

            <AppFooter />
        </div>

        <div class="body-bg pc">
            <img src="/src/assets/images/common/bg-pc.png" alt>
        </div>

        <!-- <div class="hero-copy pc">
            <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
        </div> -->

        <div class="pc">
            <h1 class="sitelogo guest-content">
                <a href="/">
                    <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
                </a>
            </h1>
        </div>

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


        <!-- <div class="pc">
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
                    </a>
                </div>
                <span class="mypage-link-txt">マイページ</span>

            </div> -->
        <!-- </div> -->
    </div>
  <PcModel />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
// import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
// import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
// import { RouterLink } from 'vue-router'

const router = useRouter()

/** トップへ。まず name:'7TopPublic' を試し、無ければ '/' に置換。最後はフルリロードで保険 */
async function goTopPublic () {
  try {
    const r = router.resolve({ name: 'TopPublic' }) // ← ここが実際の名称
    if (r?.href && r.href !== '#') {
      await router.replace({ name: 'TopPublic' })
      return
    }
  } catch {console.log}
  try {
    await router.replace('/') // ルート名が違う/存在しない場合のフォールバック
  } catch {
    window.location.replace('/') // 最終手段（SPAが効かない環境向け）
  }
}


/** ここで確実にログアウト（必要なキーを全消去） */
onMounted(() => {
  const KEYS = ['token', 'userId', 'userType']
  try {
    KEYS.forEach(k => localStorage.removeItem(k))
    // 他にも保存しているキーがあればここに追加
 } catch (e) {
    if (import.meta?.env?.DEV) console.debug('[logout] localStorage remove failed:', e)
  }
})
</script>

<style scoped>
.logout { min-height: 50vh; display: grid; place-items: center; }
.inner { text-align: center; }
.title { font-size: 24px; font-weight: 800; letter-spacing: .2em; margin-bottom: 12px; }
.lead  { color:#4b5563; margin-bottom: 18px; }
.btn-outline{
  display:inline-block; padding:12px 28px; border-radius: 999px;
  border:2px solid #fb6a4a; color:#fb6a4a; text-decoration:none; font-weight:800;
}
.btn-outline:hover{ background:#fff5f2; }

/* クリックを遮る装飾レイヤーはクリック不可に */
.body-bg,
.hero-copy,
.sitelogo,
.login-content { pointer-events: none; }

/* クリックさせたい中身を最前面へ */
.wrap { position: relative; z-index: 10; }

</style>
