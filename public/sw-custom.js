// push を受け取って通知を出す
self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data?.json() ?? {} } catch {console.log}

  const title = data.title || 'お知らせ'
  const options = {
    body: data.body || '',
    icon: 'icons/fukushim192.png',
    badge: 'icons/fukushim192.png',
    data: data.data || {} // { url: '/talks' } など
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// クリックで既存タブをフォーカス or 新規オープン
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification?.data?.url || '/'

  event.waitUntil((async () => {
    // ★ 'clients' ではなく 'self.clients' を使うと no-undef を避けやすい
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })

    for (const client of allClients) {
      // 既存タブを前面に
      if ('focus' in client) {
        await client.focus()
        // 必要なら SPA 側で message を拾って遷移
        client.postMessage({ type: 'OPEN_URL', url: targetUrl })
        return
      }
    }
    // タブが無ければ新規オープン
    if (self.clients.openWindow) await self.clients.openWindow(targetUrl)
  })())
})
