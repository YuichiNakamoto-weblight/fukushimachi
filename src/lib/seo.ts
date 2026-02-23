// src/lib/seo.ts
export function setCanonical (absoluteUrl: string): void {
  const head = document.head
  let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    head.appendChild(link)
  }
  link.setAttribute('href', absoluteUrl)
}

export function setTitle (title: string): void {
  document.title = title
}

export function setMetaDescription (content: string): void {
  const head = document.head
  let meta = head.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}
