// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
})

type User = {
  id: number
  email: string
  name?: string
  name_sei?: string
  name_mei?: string
  role?: string
  icon_image?: string | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false as boolean,
    error: '' as string,
  }),
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        const { data } = await API.post('/auth/login', { email, password })
        this.user = data.user ?? null
        return true
      } catch (e: any) {
        this.error = e?.response?.data?.message || e?.response?.data?.error || 'ログインに失敗しました。'
        return false
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      try {
        await API.post('/auth/logout')
      } finally {
        this.user = null
        this.loading = false
      }
    },
    async me() {
      try {
        const { data } = await API.get('/auth/me')
        this.user = data.user ?? null
      } catch {
        this.user = null
      }
    },
    // 必要なら永続化系ユーティリティ
    saveToStorage() {
      if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user))
    },
    loadFromStorage() {
      try {
        const raw = localStorage.getItem('auth_user')
        if (raw) this.user = JSON.parse(raw)
      } catch {
        this.user = null
      }
    },
  },
})
