<template>
  <div class="page">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref(import.meta.env.VITE_APP_TITLE || 'fukushimachi')
</script>

<style scoped>
.page { padding: 16px; }
</style>
