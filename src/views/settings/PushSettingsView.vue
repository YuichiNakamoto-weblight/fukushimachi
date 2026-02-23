<template>
  <main class="l-sec" style="padding:24px">
    <h1 class="page-title maru">通知設定</h1>
    <p class="q-mb-md">プッシュ通知を有効化して、動作確認のテスト通知を受け取ります。</p>

    <!-- ① 通知を有効にする（既に作った EnablePushButton を使う） -->
    <EnablePushButton />

    <!-- ② テスト通知を自分に送る -->
    <div style="margin-top:16px">
      <button @click="sendTest" :disabled="busy">
        {{ busy ? '送信中…' : 'テスト通知を自分に送る' }}
      </button>
    </div>

    <p style="margin-top:12px; font-size:12px; color:#666">
      ※ iOS はホーム画面に追加した Web アプリでのみ受信可能です（HTTPS必須）
    </p>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import EnablePushButton from '@/components/EnablePushButton.vue'

const busy = ref(false)

async function sendTest () {
  try {
    busy.value = true
    const userId = localStorage.getItem('userId') // あなたの仕様に合わせて
    await axios.post('/api/push/test', {
      userId,                         // 自分宛（nullなら全員宛）
      title: 'テスト通知',
      body: '届いたらOK。タップでトークへ移動します',
      url: '/talks'                   // クリック時に開く画面
    })
    alert('テスト通知を送信しました')
  } catch (e) {
    console.error('[push:test]', e)
    alert('テスト通知の送信に失敗しました')
  } finally {
    busy.value = false
  }
}
</script>
