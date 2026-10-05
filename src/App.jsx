import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'
import ContactList from './components/ContactList.jsx'
import ContactForm from './components/ContactForm.jsx'
import MessagesPanel from './components/MessagesPanel.jsx'

export default function App() {
  const [contacts, setContacts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | contact
  const [health, setHealth] = useState('checking')
  const [error, setError] = useState('')

  const loadContacts = useCallback(async () => {
    try {
      const data = await api.listContacts()
      setContacts(Array.isArray(data) ? data : [])
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => {
    loadContacts()
    api.health().then(
      () => setHealth('healthy'),
      () => setHealth('down'),
    )
  }, [loadContacts])

  const selected = contacts.find((c) => c.id === selectedId) ?? null

  async function handleSave(values) {
    const saved =
      editing === 'new'
        ? await api.createContact(values)
        : await api.updateContact(editing.id, values)
    await loadContacts()
    setSelectedId(saved.id)
    setEditing(null)
  }

  async function handleDelete(contact) {
    if (!confirm(`Delete ${contact.name}?`)) return
    try {
      await api.deleteContact(contact.id)
      if (selectedId === contact.id) setSelectedId(null)
      await loadContacts()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Contacts</h1>
        <span className={`health health--${health}`}>API {health}</span>
      </header>

      {!import.meta.env.VITE_API_URL && (
        <p className="banner">
          <code>VITE_API_URL</code> is not set. Copy <code>.env.example</code> to <code>.env</code> and restart the dev server.
        </p>
      )}
      {error && (
        <p className="banner banner--error" onClick={() => setError('')}>
          {error}
        </p>
      )}

      <div className="layout">
        <aside className="sidebar">
          <button className="btn btn--primary" onClick={() => setEditing('new')}>
            + New contact
          </button>
          <ContactList
            contacts={contacts}
            selectedId={selectedId}
            onSelect={(c) => {
              setSelectedId(c.id)
              setEditing(null)
            }}
          />
        </aside>

        <main className="main">
          {editing ? (
            <ContactForm
              key={editing === 'new' ? 'new' : editing.id}
              initial={editing === 'new' ? null : editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          ) : selected ? (
            <>
              <div className="contact-header">
                <div>
                  <h2>{selected.name}</h2>
                  <p className="muted">{selected.phone}</p>
                </div>
                <div className="actions">
                  <button className="btn" onClick={() => setEditing(selected)}>Edit</button>
                  <button className="btn btn--danger" onClick={() => handleDelete(selected)}>Delete</button>
                </div>
              </div>
              <MessagesPanel key={selected.id} contact={selected} contacts={contacts} />
            </>
          ) : (
            <p className="empty">Select a contact or create a new one.</p>
          )}
        </main>
      </div>
    </div>
  )
}
