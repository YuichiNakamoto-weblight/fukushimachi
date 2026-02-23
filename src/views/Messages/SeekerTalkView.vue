<!-- src/views/Messages/SeekerTalkView.vue -->
<!-- 求職者トーク画面 -->
<template>
  <div class="wrap is-guest">
    <TalkPanel
      :thread-id="Number(route.params.threadId)"
      role="seeker"
      :user-id="userId"
      :header-title="jobTitle"
      :sub-title="businessName"
      :back-to="backTo"
    />
  </div>
    <PcModel />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { http } from '@/api/http'
import TalkPanel from '@/components/talk/TalkPanel.vue'
import PcModel from '@/components/layout/PcModel.vue'

const route = useRoute()
const userId = Number(localStorage.getItem('userId'))
const jobTitle = ref('')
const businessName = ref('')
const backTo = ref('')

onMounted(async () => {
  const threadId = Number(route.params.threadId)
  try {
    // メタAPIで見出しと戻り先を取得
    const { data } = await http.get(`/talks/${threadId}/meta`)
    const m = data?.meta
    if (m) {
      jobTitle.value = m.job_title || ''
      businessName.value = m.facility_name || ''
      // backTo.value = m.job_id ? `/jobs/${m.job_id}` : ''
      backTo.value = m.job_id ? `/jobs/talks` : ''
      return
    }
  } catch {/* フォールバックへ */}

  // フォールバック：スレッド一覧から探す（互換）
  try {
    const { data } = await http.get('/talks/threads', { params: { role:'seeker', userId }})
    const t = (data.items || []).find(x => x.id === threadId)
    if (t) {
      jobTitle.value = t.job_title || ''
      businessName.value = t.business_name || ''
      // job_id が無い実装の場合は戻り先なし
      backTo.value = ''
    }
  } catch (e) {
    if (import.meta?.env?.DEV) {
      console.debug('[SeekerTalkView] fallback /talks/threads failed', e)
    }
  }
})
</script>
