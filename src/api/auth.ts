// src/api/auth.ts
import axios from 'axios'

// すべての API の基点（.env 未設定なら /api）
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
})

// 送信ログ（password はマスク）
API.interceptors.request.use((config) => {
  const safeData = config.data
    ? JSON.parse(JSON.stringify(config.data, (k, v) => (k === 'password' ? '***' : v)))
    : undefined
  if (import.meta.env.DEV) console.debug('[API:req]', config.method?.toUpperCase(), config.url, safeData)
  return config
})

// 受信ログ
API.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) console.debug('[API:res]', res.status, res.config.url, res.data)
    return res
  },
  (err) => {
    const status = err.response?.status
    const url = err.config?.url
    const data = err.response?.data
    console.error('[API:err]', status, url, data || err.message)
    return Promise.reject(err)
  }
)

export type RegisterPayload = {
  username: string
  email: string
  password: string
  user_type: 'employer' | 'seeker'
}

export type RegisterResult = {
  user_id: number
  email: string
  need_verify: boolean
}

export async function register(payload: RegisterPayload) {
  const { data } = await API.post<RegisterResult>('/auth/register', payload)
  return data
}

export async function verifyOtp(user_id: number, otp_code: string) {
  const { data } = await API.post<{ verified: true }>('/auth/verify-otp', { user_id, otp_code })
  return data
}

export async function verifyOtpByEmail(email: string, otp: string) {
  const { data } = await API.post('/auth/verify-otp', { email, otp })
  return data
}

export async function resendOtp(email: string) {
  const { data } = await API.post<{ resent: true }>('/auth/resend-otp', { email })
  return data
}

export async function login(email: string, password: string) {
  // ★ baseURL が /api なので、ここは /auth/login（/api を重ねない）
  const { data } = await API.post<{ login: boolean; user_id: number; user_type: 'employer' | 'seeker' }>(
    '/auth/login',
    { email, password }
  )
  return data
}

/* ========= パスワード再設定フロー ========= */
/** リセットコード送信（存在の有無はぼかしたメッセージで返る） */
export async function forgotPassword(email: string) {
  const { data } = await API.post<{ message: string }>('/auth/forgot-password', { email })
  return data
}

/** リセットコード検証（有効なら 200） */
export async function verifyResetCode(email: string, code: string) {
  const { data } = await API.post<{ message: string }>('/auth/verify-reset', { email, code })
  return data
}

/** 新パスワード設定（code が正しければ更新） */
export async function resetPassword(email: string, code: string, new_password: string) {
  const { data } = await API.post<{ message: string }>(
    '/auth/reset-password',
    { email, code, new_password }
  )
  return data
}

export async function requestPasswordReset(email: string) {
  const { data } = await API.post('/auth/forgot-password', { email })
  return data
}

// === メール変更用 OTP ===
export async function verifyEmailChangeOtp(email: string, otp: string) {
  const { data } = await API.post('/auth/verify-email-change-otp', { email, otp })
  return data // { token?, userId }
}

export async function requestEmailChangeOtp(email: string) {
  // サーバ実装は /auth/request-email-change なのでこちらに合わせる
  const { data } = await API.post('/auth/request-email-change', { email })
  return data
}
