<!-- src/components/common/BizToastModal.vue 事業者用ポップアップコンポーネント-->
<template>
  <teleport to="body">
    <div v-if="open" class="toast-overlay" @click.self="onBackdrop">
      <div class="toast-panel" role="alertdialog" aria-live="polite">
        <p v-if="title" class="toast-title">{{ title }}</p>
        <p class="toast-msg">{{ message }}</p>

        <div class="toast-actions">
          <button
            v-if="showCancel"
            class="toast-btn ghost"
            :disabled="busy"
            @click="onCancel"
          >
            {{ cancelLabel }}
          </button>
          <button
            class="toast-btn"
            :disabled="busy"
            @click="onConfirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  open:         { type: Boolean, default: false },        // v-model:open
  title:        { type: String,  default: '' },
  message:      { type: String,  default: '' },
  showCancel:   { type: Boolean, default: false },        // 確認用：キャンセル表示
  confirmLabel: { type: String,  default: 'OK' },
  cancelLabel:  { type: String,  default: 'CANCEL' },
  autoCloseMs:  { type: Number,  default: 0 },            // 自動で閉じる（0=しない）
  closeOnBackdrop: { type: Boolean, default: true },
  busy:         { type: Boolean, default: false },        // 実行中はボタン無効
})
const emit = defineEmits(['update:open','confirm','cancel'])

let timer = null
const clear = () => { if (timer) { clearTimeout(timer); timer = null } }
const close = () => emit('update:open', false)

const onConfirm  = () => { emit('confirm'); if (props.autoCloseMs === 0) close() }
const onCancel   = () => { emit('cancel');  close() }
const onBackdrop = () => { if (props.closeOnBackdrop && !props.busy) close() }

watch(() => props.open, (v) => {
  clear()
  if (v && props.autoCloseMs > 0) {
    timer = setTimeout(close, props.autoCloseMs)
  }
})
onBeforeUnmount(clear)
</script>

<style scoped>
.toast-overlay{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: grid; place-items: center;
  z-index: 2000;
}
.toast-panel{
  width: min(92vw, 520px);
  background: #12b3e6; /* 青い吹き出し */
  color: #fff;
  border-radius: 14px;
  padding: 26px 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
}
.toast-title{ margin: 0 0 6px; font-size: 18px; font-weight: 700; }
.toast-msg{ margin: 0 0 16px; font-size: 16px; line-height: 1.6; }
.toast-actions{ display:flex; gap:12px; justify-content:center; }
.toast-btn{
  appearance: none; border: 0;
  background: #fff; color:#0b2c3a;
  font-weight: 700; border-radius: 999px;
  padding: 10px 20px; min-width: 180px; cursor: pointer;
}
.toast-btn.ghost{
  background: transparent; color:#fff; border:2px solid #fff;
}
.toast-btn:disabled{ opacity:.6; cursor:not-allowed; }
</style>
