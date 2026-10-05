import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'

const TABS = [
  { id: 'conversation', label: 'Conversation' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'sent', label: 'Sent' },
]

// The API returns UTC timestamps without a zone suffix; without the "Z" they'd parse as local time.
const formatDate = (iso) =>
  iso ? new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`).toLocaleString() : ''

export default function MessagesPanel({ contact, contacts }) {
  const others = contacts.filter((c) => c.id !== contact.id)
  const [tab, setTab] = useState('conversation')
  const [otherId, setOtherId] = useState(others[0]?.id ?? '')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (tab === 'conversation' && !otherId) {
      setMessages([])
      return
    }
    setLoading(true)
    try {
      const data =
        tab === 'inbox' ? await api.inbox(contact.id)
        : tab === 'sent' ? await api.sent(contact.id)
        : await api.conversation(contact.id, otherId)
      setMessages(data)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [tab, otherId, contact.id])

  useEffect(() => {
    load()
  }, [load])

  async function run(action) {
    try {
      await action()
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  function handleSend(e) {
    e.preventDefault()
    if (!draft.trim()) return
    run(async () => {
      await api.sendMessage({ senderId: contact.id, recipientId: Number(otherId), content: draft.trim() })
      setDraft('')
    })
  }

  function handleEdit(m) {
    const content = prompt('Edit message', m.content)
    if (content === null || content.trim() === m.content) return
    run(() => api.editMessage(m.id, content.trim()))
  }

  function handleDelete(m) {
    if (!confirm('Delete this message?')) return
    run(() => api.deleteMessage(m.id))
  }

  return (
    <section className="card messages">
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? 'tab tab--active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'conversation' && (
        <label className="inline-field">
          With
          <select value={otherId} onChange={(e) => setOtherId(Number(e.target.value))}>
            {others.length === 0 && <option value="">No other contacts</option>}
            {others.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="field-error">{error}</p>}

      <ul className="message-list">
        {!loading && messages.length === 0 && <li className="muted">No messages.</li>}
        {messages.map((m) => {
          const mine = m.senderId === contact.id
          return (
            <li key={m.id} className={mine ? 'message message--mine' : 'message'}>
              <div className="message-meta">
                <strong>{m.senderName}</strong> → {m.recipientName}
                <span className="muted"> · {formatDate(m.createdAt)}</span>
              </div>
              <p className="message-content">{m.content}</p>
              <div className="message-footer">
                <span className="muted">
                  {m.readAt ? `Read ${formatDate(m.readAt)}` : 'Unread'}
                </span>
                <span className="actions">
                  {!mine && !m.readAt && (
                    <button className="link" onClick={() => run(() => api.markRead(m.id))}>Mark read</button>
                  )}
                  {mine && <button className="link" onClick={() => handleEdit(m)}>Edit</button>}
                  <button className="link link--danger" onClick={() => handleDelete(m)}>Delete</button>
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      {tab === 'conversation' && otherId !== '' && (
        <form className="composer" onSubmit={handleSend}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message as ${contact.name}…`}
          />
          <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>Send</button>
        </form>
      )}
    </section>
  )
}
