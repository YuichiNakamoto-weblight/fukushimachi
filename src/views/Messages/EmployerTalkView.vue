<!-- src/views/Messages/EmployerTalkView.vue -->
<!-- 事業者向け画面 -->
<template>
  <div class="wrap is-biz">
    <TalkPanel
      :thread-id="Number(route.params.threadId)"
      role="employer"
      :user-id="employerUserId"
      :header-title="headerTitle"
      :sub-title="subTitle"
      :back-to="backTo"
    />
  </div>
    <PcModel />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { http } from '@/api/http'
import TalkPanel from '@/components/talk/TalkPanel.vue'
import PcModel from '@/components/layout/PcModel.vue'

const route = useRoute()

// 事業者の users.id を取得（数値 or JSON どちらでもOK）
const employerUserId = (() => {
  try {
    const raw = localStorage.getItem('userId') || sessionStorage.getItem('userId')
      || localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
    if (!raw) return 0
    if (/^\s*\d+\s*$/.test(raw)) return Number(raw)
    const o = JSON.parse(raw)
    return Number(o?.id ?? o?.userId ?? o?.user?.id) || 0
  } catch { return 0 }
})()

const headerTitle = ref('') // 求職者名
const subTitle    = ref('') // 市町村＋性別＋年齢
const backTo      = '/biz/talks' // 一覧へ戻る

onMounted(async () => {
  const id = Number(route.params.threadId)
  try {
    const { data } = await http.get(`/talks/${id}/meta`)
    const m = data?.meta || {}

    // APIが新フォーマットを返す場合（今回の修正）
    const age = (m.seeker_age ?? '') !== '' && m.seeker_age != null ? `${m.seeker_age}歳` : ''
    const sub = [m.seeker_city, m.seeker_gender_label, age].filter(Boolean).join(' ')

    headerTitle.value = m.seeker_name || m.seeker_username || ''
    subTitle.value    = sub

    // フォールバック（万一 API 未更新でも空にならないように）
    if (!headerTitle.value) {
      headerTitle.value = m.job_title || ''
      subTitle.value    = m.facility_name || ''
    }
  } catch {
    headerTitle.value = ''
    subTitle.value = ''
  }
})
</script>
