<!-- Pc画面背景 -->
<!-- src/components/layout/PcModel.vue -->
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt>
  </div>

  <div class="hero-copy pc">
    <img src="/src/assets/images/home/hero-copy3.svg" alt="気になるをトークで聞けるしごと探し">
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <RouterLink to="/">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </RouterLink>
    </h1>

    <h1 class="sitelogo user-content">
      <RouterLink to="/user">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </RouterLink>
    </h1>

    <h1 class="sitelogo employer-content">
      <RouterLink to="/employer">
        <img src="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </RouterLink>
    </h1>
  </div>

  <div class="pc">
    <div class="user-content login-content">
      <div class="mypage-link">
        <RouterLink to="/seeker/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </RouterLink>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <RouterLink to="/business/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

