// In dev, requests go through the Vite proxy (see vite.config.js), so paths stay relative.
const BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(status, message, fieldErrors = null) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// The API returns ASP.NET problem details: { title, detail } or { errors: { Field: [msg] } }.
// Some 404s come back with an empty body.
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  const contentType = res.headers.get('Content-Type') ?? ''

  // Without VITE_API_URL the request hits the Vite dev server, which answers with index.html.
  if (contentType.includes('text/html')) {
    throw new ApiError(res.status, 'Could not reach the API. Check VITE_API_URL in .env and restart the dev server.')
  }
  const data = text && contentType.includes('json') ? JSON.parse(text) : text

  if (!res.ok) {
    const fieldErrors = data?.errors ?? null
    const message =
      data?.detail ??
      (fieldErrors ? Object.values(fieldErrors).flat().join(' ') : null) ??
      data?.title ??
      (res.status === 404 ? 'Not found' : `Request failed (${res.status})`)
    throw new ApiError(res.status, message, fieldErrors)
  }

  return data || null
}

export const api = {
  health: () => request('/healthz'),

  listContacts: () => request('/api/contacts'),
  getContact: (id) => request(`/api/contacts/${id}`),
  createContact: (contact) => request('/api/contacts', { method: 'POST', body: contact }),
  updateContact: (id, contact) => request(`/api/contacts/${id}`, { method: 'PUT', body: contact }),
  deleteContact: (id) => request(`/api/contacts/${id}`, { method: 'DELETE' }),

  listMessages: () => request('/api/messages'),
  getMessage: (id) => request(`/api/messages/${id}`),
  sendMessage: (message) => request('/api/messages', { method: 'POST', body: message }),
  editMessage: (id, content) => request(`/api/messages/${id}`, { method: 'PUT', body: { content } }),
  markRead: (id) => request(`/api/messages/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id) => request(`/api/messages/${id}`, { method: 'DELETE' }),

  conversation: (contactId, otherId) => request(`/api/contacts/${contactId}/conversations/${otherId}`),
  inbox: (contactId) => request(`/api/contacts/${contactId}/messages/inbox`),
  sent: (contactId) => request(`/api/contacts/${contactId}/messages/sent`),
}
