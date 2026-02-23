// src/api/http.ts
import axios, { AxiosError } from 'axios'

// ← ここで .env の値を読む（無ければ '/api' を使う）
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'
export const http = axios.create({ baseURL })


// 開発時に接続先を確認できるようログ
if (import.meta.env.DEV) {
  console.info('[HTTP:init] baseURL =', baseURL)
}

// 送信ログ（password はマスク）
// http.interceptors.request.use((config) => {
//   const safeData = config.data
//     ? JSON.parse(JSON.stringify(config.data, (k, v) => (k === 'password' ? '***' : v)))
//     : undefined
//   console.debug('[HTTP:req]', config.method?.toUpperCase(), config.url, safeData)
//   return config
// })

// ▼ 追加：localStorage の userId / userType を毎リクエストに付与
http.interceptors.request.use((config) => {
  const uidRaw = localStorage.getItem('userId')
  const utype  = localStorage.getItem('userType') || ''
  const uid = uidRaw ? String(uidRaw).replace(/"/g, '') : ''

  config.headers = config.headers ?? {}
  if (uid) {
    (config.headers as any)['X-User-Id'] = uid
    if (utype) (config.headers as any)['X-User-Type'] = utype
  }
  // トークン運用はしない
  if ((config.headers as any).Authorization) delete (config.headers as any).Authorization
  return config
})


// 受信ログ（エラー時は baseURL を含めて出力）
http.interceptors.response.use(
  (res) => {
    console.debug('[HTTP:res]', res.status, res.config.url, res.data)
    return res
  },
  (err: AxiosError<any>) => {
    const status = err.response?.status
    const url = err.config?.baseURL ? `${err.config.baseURL}${err.config.url}` : err.config?.url
    const data = err.response?.data
    console.error('[HTTP:err]', status, url, data || err.message)
    return Promise.reject(err)
  }
)

