import type { PiniaPluginContext } from 'pinia';

type PersistUserOptions = {
  key?: string;
  storage?: Storage; // localStorage / sessionStorage
  paths?: Array<'userId' | 'userType' | 'email' | 'emailVerified'>;
};

export function createUserPersistPlugin(options: PersistUserOptions = {}) {
  const {
    key = 'user',
    storage = localStorage,
    paths = ['userId', 'userType', 'email', 'emailVerified'],
  } = options;

  return (ctx: PiniaPluginContext) => {
    // 対象ストアのみ（id: 'user'）
    if (ctx.store.$id !== 'user') return;

    // 1) 初期化時に復元
    try {
      const raw = storage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, unknown>;
        ctx.store.$patch((state: any) => {
          for (const p of paths) {
            if (p in saved) (state as any)[p] = (saved as any)[p];
          }
        });
      }
    } catch {
      // 破損してたら無視
    }

    // 2) 以降の変更を保存
    ctx.store.$subscribe((_mutation, state) => {
      const data: Record<string, unknown> = {};
      for (const p of paths) data[p] = (state as any)[p];
      try {
        storage.setItem(key, JSON.stringify(data));
      } catch {
        // 保存不可（容量超など）は無視
      }
    });
  };
}
