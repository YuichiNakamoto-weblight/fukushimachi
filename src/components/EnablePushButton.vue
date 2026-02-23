<!-- src/components/EnablePushButton.vue -->
 <!-- プッシュ通知メッセージ -->
<template>
  <button @click="enable" :disabled="busy">
    {{ busy ? '設定中…' : '通知を有効にする' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { urlBase64ToUint8Array } from '@/utils/push'

const busy = ref(false)

async function enable () {
  try {
    busy.value = true

    // ブラウザ対応チェック
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('このブラウザはプッシュ通知に対応していません。')
      return
    }

    // 1) 権限確認（ユーザー操作内で呼ぶ）
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') {
      alert('通知が許可されませんでした')
      return
    }

    // 2) SW 準備完了を待つ
    const reg = await navigator.serviceWorker.ready

    // 3) VAPID 公開鍵
    const vapidPublic = import.meta.env.VITE_VAPID_PUBLIC

    if (typeof vapidPublic !== 'string' || !vapidPublic) {
      alert('VITE_VAPID_PUBLIC が未設定です（.env を確認）')
      return
    }
    const appServerKey = urlBase64ToUint8Array(vapidPublic)

    // 4) 購読を作成
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: appServerKey
    })

    // 5) API に保存
    const userId = localStorage.getItem('userId')
    await axios.post('/api/push/subscribe', { subscription: sub, userId })

    alert('プッシュ通知を有効化しました')
  } catch (e) {
    console.error('[enable-push]', e)
    alert('設定に失敗しました')
  } finally {
    busy.value = false
  }
}
</script>

