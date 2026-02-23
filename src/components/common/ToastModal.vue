<!-- src/components/common/ToastModal.vue 求職者用ポップアップコンポーネント-->
<template>
  <teleport to="body">
    <div v-if="open" class="toast-overlay" @click.self="close">
      <div class="toast-panel" role="alertdialog" aria-live="polite">
        <p class="toast-msg">{{ message }}</p>

        <!-- ★ 追加: アクション置き場。未指定なら従来の CLOSE ボタンを出す -->
        <div class="toast-actions">
          <slot name="actions">
            <button class="toast-btn" @click="close">{{ closeText }}</button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  message: { type: String, default: '' },
  autoCloseMs: { type: Number, default: 1800 },
  // ★ 追加（既存デフォルトを維持）
  closeText: { type: String, default: 'CLOSE' },
})
const emit = defineEmits(['update:open'])

let timer = null
const clear = () => { if (timer) { clearTimeout(timer); timer = null } }
const close = () => { clear(); emit('update:open', false) }

watch(() => props.open, (v) => {
  clear()
  if (v && props.autoCloseMs > 0) {
    timer = setTimeout(close, props.autoCloseMs)
  }
})

onBeforeUnmount(clear)
</script>

<style scoped>
.toast-overlay{ position: fixed; inset: 0; background: rgba(0,0,0,.45); display: grid; place-items: center; z-index: 9999; }
.toast-panel{ width: min(92vw, 520px); background: #ff7043; color:#fff; border-radius: 14px; padding: 28px 20px 16px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,.2); }
.toast-msg{ margin: 0 0 16px; font-size: 16px; line-height: 1.6; }
/* ★ 追加：アクションの並び */
.toast-actions{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
.toast-btn{ appearance:none; border:0; background:#fff; color:#ff7043; font-weight:700; border-radius:999px; padding:8px 18px; cursor:pointer; }
.toast-btn:focus-visible{ outline:3px solid rgba(255,255,255,.55); outline-offset:2px; }
</style>
