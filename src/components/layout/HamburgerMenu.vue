<!-- src/components/layout/HamburgerMenu.vue -->
<!-- ハンバーガーメニュー-->
<!-- src/components/layout/HamburgerMenu.vue -->
<template>
  <div class="hamburger"><span></span><span></span><span></span></div>

  <div class="slide-menu">
    <div class="slide-menu-wrap">
      <div class="slide-menu-summary">
        <div class="slide-menu-logo guest-content">
          <a href="/"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしまちHOME" /></a>
        </div>
        <div class="slide-menu-logo user-content">
          <a href="/user/"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしまちHOME" /></a>
        </div>
        <div class="slide-menu-logo employer-content">
          <a href="/employer/"><img src="/src/assets/images/common/sitelogo.svg" alt="ふくしまちHOME" /></a>
        </div>
      </div>
    </div>
  </div>

  <SlideMenu />
</template>

<script setup>
import { onMounted } from 'vue'
import SlideMenu from './SlideMenu.vue'
import useSlideMenu from './SlideMenu.ts'
onMounted(() => {
  useSlideMenu()
})
</script>
