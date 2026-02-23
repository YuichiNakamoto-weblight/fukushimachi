<template>
  <div class="otp-wrap">
    <input
      v-for="(_, i) in props.length"
      :key="i"
      ref="boxes"
      class="otp-box"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      @input="onInput($event, i)"
      @keydown.backspace.prevent="onBackspace(i)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  length: { type: Number, default: 6 },
})

const emit = defineEmits(['complete'])

const boxes = ref([])

onMounted(() => {
  nextTick(() => boxes.value[0]?.focus())
})

function onInput(e, i) {
  const el = e.target
  el.value = el.value.replace(/\D/g, '').slice(0, 1)
  if (el.value && i < props.length - 1) boxes.value[i + 1]?.focus()
  const val = boxes.value.map(b => b?.value || '').join('')
  if (val.length === props.length) emit('complete', val)
}

function onBackspace(i) {
  const cur = boxes.value[i]
  if ((!cur || !cur.value) && i > 0) boxes.value[i - 1]?.focus()
}
</script>

<style scoped>
.otp-wrap { display:flex; gap:8px; }
.otp-box { width:40px; height:48px; text-align:center; font-size:20px; border:1px solid #ccc; border-radius:6px; }
</style>
