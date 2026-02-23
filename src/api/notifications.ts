// src/api/notifications.ts
// 通知設定 API（オプトアウト: 未登録=ON, 登録あり=OFF）

import axios from 'axios'
import { API } from '@/stores/authLocal'
export type Role = 'seeker' | 'employer'
export type Channel = 'email' | 'push'
export type PrefKey =
  | 'good_received'
  | 'good_target_update'
  | 'talk_received'
  | 'talk_actor_update'
  | 'clip_target_update'
  | 'news_new_job'
  | 'news_update'
  | 'news_feature_update'

export type PrefItem = {
  key: PrefKey
  label?: string
  enabled: boolean // true=通知する(=記録なし), false=通知しない(=オプトアウト記録あり)
}

export type PrefsPayload = {
  email: PrefItem[]
  push: PrefItem[]
}

/** fallback用のdefaults/disabled 形 */
type DefaultsResp = {
  email: Array<{ key: PrefKey; label?: string; label_ja?: string }>
  push: Array<{ key: PrefKey; label?: string; label_ja?: string }>
}
type DisabledResp = { email: PrefKey[]; push: PrefKey[] }

/**
 * マスタ(表示用) + ユーザーの無効リストをマージして
 * { email: [{key,label,enabled}], push: [...] } を返す
 * - まず unified エンドポイント /api/notifications?role=seeker を試す
 * - 無ければ fallback として defaults / disabled を2本叩いてマージ
 */
export async function fetchAllPrefs(role: Role): Promise<PrefsPayload> {
  // 1) unified エンドポイント（サーバが実装済ならこれが最短）
  try {
    const { data } = await axios.get<PrefsPayload>('/api/notifications', { params: { role } })
    if (data?.email && data?.push) return data
  } catch {
    /* noop → fallback へ */
  }

  // 2) fallback: マスタと無効（オプトアウト）を別々に取得してマージ
  const [defsRes, offRes] = await Promise.all([
    axios.get<DefaultsResp>('/api/notifications/defaults', { params: { role } }),
    axios.get<DisabledResp>('/api/notifications/disabled', { params: { role } }),
  ])

  const defs = defsRes.data ?? { email: [], push: [] }
  const off = offRes.data ?? { email: [], push: [] }

  const emailOff = new Set<PrefKey>(off.email ?? [])
  const pushOff = new Set<PrefKey>(off.push ?? [])

  return {
    email: (defs.email ?? []).map((it) => ({
      key: it.key,
      label: it.label ?? it.label_ja ?? it.key,
      enabled: !emailOff.has(it.key),
    })),
    push: (defs.push ?? []).map((it) => ({
      key: it.key,
      label: it.label ?? it.label_ja ?? it.key,
      enabled: !pushOff.has(it.key),
    })),
  }
}

/**
 * トグル即時保存
 * enabled === false → OFF にする → INSERT（/disable）
 * enabled === true  → ON  にする → DELETE（/disable）
 */
export async function togglePref(
  role: Role,
  channel: Channel,
  key: PrefKey,
  enabled: boolean
): Promise<any> {
  // まず統一トグル API を試す（サーバが用意されていればこれでOK）
  try {
    const { data } = await axios.patch('/api/notifications/toggle', {
      role,
      channel,
      key,
      enabled,
    })
    return data
  } catch {
    /* noop → fallback へ */
  }

  if (enabled === false) {
    // OFF にする（= オプトアウト登録を追加）
    const { data } = await axios.post('/api/notifications/disable', { role, channel, key })
    return data
  } else {
    // ON に戻す（= オプトアウト登録を削除）
    const { data } = await axios.delete('/api/notifications/disable', {
      data: { role, channel, key }, // axios の DELETE は body を data に入れる
    })
    return data
  }
}

/**
 * （任意）一括保存：
 * map は { key:boolean } 形式（true=ON, false=OFF）
 * サーバ側は、指定 channel の既存レコード削除 → false のキーだけ一括 INSERT する想定
 */
export async function saveChannel(
  role: Role,
  channel: Channel,
  map: Record<PrefKey, boolean>
): Promise<any> {
  const disabledKeys = (Object.keys(map) as PrefKey[]).filter((k) => map[k] === false)

  // bulk エンドポイントがあるなら最短
  try {
    const { data } = await axios.put('/api/notifications/bulk', {
      role,
      channel,
      disabledKeys,
    })
    return data
  } catch {
    // 無ければ個別トグルで後方互換
    const tasks = (Object.keys(map) as PrefKey[]).map((k) => togglePref(role, channel, k, map[k]))
    return Promise.allSettled(tasks)
  }
}


export async function fetchEmailPrefs(role: 'seeker'|'employer', userId: number) {
  const { data } = await API.get('/notifications/prefs', {
    params: { role, channel: 'email', user_id: userId },
  })
  // サーバ側コメントより、返却は { items: [{ pref_key, label, enabled }] } 想定
  return data.items as Array<{ pref_key: string; enabled: 0|1 }>
}

// メール通知
export async function saveEmailPref(
  role: 'seeker'|'employer',
  key: string,
  enabled: boolean,
  userId: number
) {
  await API.post('/notifications/prefs', {
    role,
    channel: 'email',
    pref_key: key,
    enabled: enabled ? 1 : 0, // ← サーバ仕様に合わせる
    user_id: userId,          // ← ここが超重要
  })
}

// プッシュ通知
export async function fetchPushPrefs(role: 'seeker'|'employer', userId: number) {
  const { data } = await API.get('/notifications/prefs', {
    params: { role, channel: 'push', user_id: userId },
  })
  return data.items as Array<{ pref_key: string; enabled: 0|1 }>
}

export async function savePushPref(
  role: 'seeker'|'employer',
  key: string,
  enabled: boolean,
  userId: number
) {
  await API.post('/notifications/prefs', {
    role,
    channel: 'push',
    pref_key: key,
    enabled: enabled ? 1 : 0, // 1=通知ON(削除), 0=通知OFF(挿入)
    user_id: userId,
  })
}
