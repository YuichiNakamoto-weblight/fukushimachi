<!-- src/components/common/ConfirmGoodModal.vue -->
<template>
  <div v-if="open" class="cg-overlay" @click.self="close">
    <div class="cg-modal" role="dialog" aria-modal="true" aria-labelledby="cg-title">
      <button class="cg-close" @click="close" aria-label="閉じる">×</button>
      <h3 id="cg-title" class="cg-title">グッドしますか？</h3>
      <p class="cg-text">グッドを押すと、あなたの情報が施設に届きます。</p>

      <div class="cg-actions">
        <button class="cg-btn -primary" @click="doConfirm">グッドする</button>
        <button class="cg-btn" @click="close">戻る</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// ★不要な import を削除（computed など）
const { open } = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['update:open', 'confirm'])

const close = () => emit('update:open', false)
const doConfirm = () => emit('confirm')
</script>

<style scoped>
/* 既存のスタイルそのまま */
.cg-overlay{ position:fixed; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; z-index:1000; }
.cg-modal{ width:min(520px,92vw); background:#fff; border-radius:14px; padding:22px 18px; box-shadow:0 20px 60px rgba(0,0,0,.25); position:relative; }
/* .cg-close{ position:absolute; right:10px; top:10px; width:34px; height:34px; border-radius:999px; border:0; background:#444; color:#fff; font-size:18px; cursor:pointer; } */
.cg-title{ margin:4px 0 10px; font-size:20px; font-weight:800; text-align:center; }
.cg-text{ margin:4px 0 14px; text-align:center; line-height:1.9; }
.cg-actions{ display:flex; gap:12px; justify-content:center; margin-top:12px; }
.cg-btn{ appearance:none; border:1px solid #d1d5db; background:#f9fafb; color:#111827; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:700; }
.cg-btn.-primary{ background:#10b981; color:#fff; border-color:#10b981; }
.cg-btn:hover{ filter:brightness(1.03) }
/* 置き換え版 .cg-close */
.cg-close{
  position:absolute; right:10px; top:10px;
  width:34px; height:34px; border-radius:999px;
  border:0; background:#444; cursor:pointer;
  /* 中央基準で疑似要素を置くための基点 */
  display:block; /* ← 中のテキストは使わない */
}
.cg-close::before,
.cg-close::after{
  content:"";
  position:absolute; inset:0; margin:auto;   /* 完全中央 */
  width:16px; height:2px;                    /* 線の長さ/太さ */
  background:#fff; border-radius:2px;
}
.cg-close::before{ transform:rotate(45deg); }
.cg-close::after { transform:rotate(-45deg); }

.cg-close:hover{ filter:brightness(1.05); }
.cg-close:active{ transform:scale(.98); }

</style>
