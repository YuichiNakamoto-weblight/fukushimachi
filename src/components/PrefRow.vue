<!-- src/components/PrefRow.vue -->
<template>
  <div class="row">
    <div class="label">{{ label }}</div>
    <label class="toggle">
      <input type="checkbox" :checked="modelValue" @change="onChange" />
      <span class="track"><span class="knob"></span></span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: Boolean, required: true },
})
const emit = defineEmits(['update:modelValue','changed'])

function onChange(e) {
  const next = e.target.checked
  emit('update:modelValue', next) // v-model更新
  emit('changed', next)           // ✅ 親へ新値を渡す
}
</script>

<style scoped>
.row{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px dashed #d9d9d9;}
.label{margin-right:12px;}
.toggle{position:relative;width:44px;height:24px;}
.toggle input{position:absolute;inset:0;opacity:0;cursor:pointer;}
.track{position:absolute;inset:0;background:#e5e5e5;border-radius:999px;transition:.2s;}
.knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 2px rgba(0,0,0,.2);}
.toggle input:checked + .track{background:#4caf50;}
.toggle input:checked + .track .knob{transform:translateX(20px);}
</style>
