import { defineStore } from 'pinia'
import axios from 'axios'

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
})

type UserType = 'seeker' | 'employer' | null

export const useAuthLocal = defineStore('authLocal', {
  state: () => ({
    userId: null as number | null,
    userType: null as UserType,
    email: '' as string,
    loading: false,
  }),
  getters: {
    isAuthed: (s) => Number.isFinite(s.userId) && (s.userId as any) > 0,
    isSeeker: (s) => s.userType === 'seeker',
    isEmployer: (s) => s.userType === 'employer',
  },
  actions: {
    /** 起動時に localStorage から復元 */
    restore() {
      const id = Number(localStorage.getItem('userId') || '0')
      this.userId = Number.isFinite(id) && id > 0 ? id : null
      const ut = localStorage.getItem('userType') as UserType
      this.userType = (ut === 'seeker' || ut === 'employer') ? ut : null
      this.email = localStorage.getItem('email') || ''
    },

    /** 既存API /api/auth/login を使用（auth.jsは変更しない） */
    async login(email: string, password: string) {
      this.loading = true
      try {
        const { data } = await API.post('/auth/login', { email, password })
        // 期待レスポンス: { message, user: { id, email, user_type } }
        const uid = Number(data?.user?.id || 0)
        const utype = (data?.user?.user_type === 'employer' ? 'employer'
                    : data?.user?.user_type === 'seeker'   ? 'seeker' : null) as UserType

        if (!Number.isFinite(uid) || uid <= 0) throw new Error('invalid user id')

        // ■ 原則 userId を保存
        localStorage.setItem('userId', String(uid))

        // UI制御用に最小限プラスα（あくまで補助）
        if (utype) localStorage.setItem('userType', utype)
        localStorage.setItem('email', data?.user?.email || email)

        // ストアへ反映
        this.userId = uid
        this.userType = utype
        this.email = data?.user?.email || email
      } finally {
        this.loading = false
      }
    },

    /** フロントだけで完了（サーバ側へは通知しない） */
    logout() {
      localStorage.removeItem('userId')
      localStorage.removeItem('userType')
      localStorage.removeItem('email')
      this.userId = null
      this.userType = null
      this.email = ''
    },
  },
})
