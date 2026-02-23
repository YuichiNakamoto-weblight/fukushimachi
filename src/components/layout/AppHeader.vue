<!-- src/components/layout/AppHeader.vue -->
<!-- ヘッダー-->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import siteLogo from '@/assets/images/common/sitelogo.svg?url'
import userIcon from '@/assets/images/common/ico-user.svg?url'

/** userType の値だけでロールを決定する */
function roleFromUserType () {
  const raw = localStorage.getItem('userType')
  if (!raw) return 'guest'
  const t = String(raw).trim().toLowerCase()

  // 必要に応じてここを調整（1/2 を使っているならマップを入れ替え可）
  const MAP = {
    seeker: 'seeker', user: 'seeker', '求職者': 'seeker', '1': 'seeker',
    employer: 'employer', business: 'employer', facility: 'employer', '事業者': 'employer', '2': 'employer',
  }
  return MAP[t] ?? 'guest'
}

const role = ref('guest')
const setRole = () => { role.value = roleFromUserType() }

/** ロールごとの遷移先（name はプロジェクトに合わせて） */
const ROUTE_BY_ROLE = {
  guest:    { name: 'TopPublic' },    // ない場合は { name: 'Top' } or { path: '/' }
  seeker:   { name: 'SeekerMyPage' },
  employer: { name: 'BusinessMyPage' },
}

const iconTo = computed(() => ROUTE_BY_ROLE[role.value] ?? ROUTE_BY_ROLE.guest)
const iconLabel = computed(() =>
  role.value === 'seeker'   ? 'マイページ' :
  role.value === 'employer' ? 'マイページ' :
                              'トップへ'
)

/** 別タブ等で userType が更新されたら追従 */
function onStorage(e) {
  if (e && e.key === 'userType') setRole()
}
onMounted(() => { setRole(); window.addEventListener('storage', onStorage) })
onBeforeUnmount(() => window.removeEventListener('storage', onStorage))
</script>

<template>
  <header class="sp">
    <h1 class="sitelogo">
      <router-link :to="{ name: 'TopGate' }">
        <img :src="siteLogo" alt="ふくしま介護福祉就職情報サイト「ふくしまち」" />
      </router-link>
    </h1>

    <!-- プッシュ通知設定のテスト用 -->
    <!-- <router-link to="/settings/push" class="link">通知設定</router-link> -->

    <div class="login-content">
      <div class="mypage-link">
        <router-link :to="iconTo">
          <div class="mypage-link-tmb"><img :src="userIcon" :alt="iconLabel" /></div>
          <span class="mypage-link-txt">{{ iconLabel }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* モバイルのヘッダーをビューポート固定に */
@media (max-width: 768px){
  header.sp{
    position: fixed;
    top: env(safe-area-inset-top, 0);
    left: 0;
    right: 0;
    /* z-index: 2000;            slide-menu(3000)より下、他より上 */
    background: #fff;         /* 透け防止 */
    /* 必要なら影 */
    /* box-shadow: 0 2px 8px rgba(0,0,0,.06); */
  }
}

/* ヘッダー分の余白を本文に付与（ずれ防止） */
@media (max-width: 768px){
  .content,
  main,
  .talk-page, .talk-wrap {     /* 該当レイアウトに合わせて */
    padding-top: calc(56px + env(safe-area-inset-top, 0)); /* ヘッダー実高さに合わせる */
  }
}

</style>
