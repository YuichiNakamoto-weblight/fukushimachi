<!-- src/components/common/AuthPromptModal.vue -->
 <!-- アカウント登録を促すポップアップコンポーネント -->
<template>
  <div v-if="open" class="apm-overlay" @click.self="close">
    <div class="apm-modal" role="dialog" aria-modal="true" aria-labelledby="apm-title">
      <button class="apm-close" @click="close" aria-label="閉じる">×</button>

      <h3 id="apm-title" class="apm-title">マイページ登録しませんか？</h3>

      <button class="apm-cta" @click="emit('register')">登録</button>

      <p class="apm-text">
        求人情報の詳細が閲覧できる他、介護施設へのメッセージ送信や
        気になる求人を保存することができます。
      </p>
      <p class="apm-text">ぜひ積極的にこのサイトをご活用ください！</p>

      <div class="apm-links">
        <button class="apm-link" @click="emit('login')">ログイン</button>
        <!-- ★「あとで」は continue を emit（閉じる＋続行） -->
        <button class="apm-link" @click="onContinue">あとで</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// JS版
const { open } = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['update:open', 'register', 'login', 'continue'])

const close = () => emit('update:open', false)
const onContinue = () => {
  emit('continue')
  emit('update:open', false)
}
</script>

<style scoped>
.apm-overlay{ position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.45); z-index:1000; }
.apm-modal{ width:min(520px,92vw); background:#fff; border-radius:18px; padding:24px 22px 20px; box-shadow:0 24px 60px rgba(0,0,0,.25); position:relative; }
.apm-close{ position:absolute; top:-12px; right:-12px; width:40px; height:40px; border-radius:999px; border:0; background:rgba(0,0,0,.55); color:#fff; font-size:22px; cursor:pointer; }
.apm-title{ margin:4px 0 14px; text-align:center; font-size:20px; font-weight:800; }
.apm-cta{ display:block; margin:0 auto 18px; width:220px; height:48px; border:0; border-radius:999px; cursor:pointer; background:#ff8f70; color:#fff; font-weight:800; font-size:18px; }
.apm-cta:hover{ filter:brightness(1.02) }
.apm-text{ margin:0 0 14px; text-align:center; line-height:1.9; color:#333; }
.apm-links{ display:flex; gap:12px; justify-content:center; margin-top:6px; }
.apm-link{ appearance:none; background:#f5f5f5; border:1px solid #ddd; color:#333; border-radius:8px; padding:8px 14px; cursor:pointer; font-weight:600; }
.apm-link:hover{ filter:brightness(1.03) }
</style>
