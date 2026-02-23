// トークのドラフト保存用
import { defineStore } from 'pinia'

type DraftKey = string // e.g. "talk:role:userId:threadId"

export const useTalkDrafts = defineStore('talkDrafts', {
  state: () => ({
    drafts: {} as Record<DraftKey, string>,
  }),
  actions: {
    get(key: DraftKey) {
      return this.drafts[key] ?? ''
    },
    set(key: DraftKey, value: string) {
      this.drafts[key] = value
    },
    clear(key: DraftKey) {
      delete this.drafts[key]
    },
    clearAllByPrefix(prefix: string) {
      Object.keys(this.drafts)
        .filter(k => k.startsWith(prefix))
        .forEach(k => delete this.drafts[k])
    },
  },
})
