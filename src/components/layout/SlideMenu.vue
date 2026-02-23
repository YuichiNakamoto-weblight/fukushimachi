<!-- src/components/layout/SlideMenu.vue -->
<!-- SlideMenu.vue -->
<template>
  <teleport v-if="mounted && hasTarget" to=".slide-menu-wrap">
    <div class="sm-mini">
      <button class="sm-close" @click="close">✕</button>
      <!-- <button class="sm-btn" @click="go('/jobs')">求人情報</button>
      <button class="sm-btn" @click="go('/login')">ログイン</button> -->
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const mounted = ref(false)
const hasTarget = ref(false)

onMounted(() => {
  mounted.value = true
  hasTarget.value = !!document.querySelector('.slide-menu-wrap')
})

// function go(path) {
//   location.href = path
// }

function close() {
  console.log('✖ ボタンクリック → closeSlideMenu 発火')
  window.dispatchEvent(new Event('closeSlideMenu'))
}
</script>

<style scoped>
.sm-close {
  position: absolute;
  left: 1rem;
  top: 1rem;
  font-size: 2rem;
  background: none;
  border: none;
}
.sm-btn {
  display: block;
  padding: 1rem;
}
</style>
