export default function ContactList({ contacts, selectedId, onSelect }) {
  if (contacts.length === 0) return <p className="muted">No contacts yet.</p>

  return (
    <ul className="contact-list">
      {contacts.map((c) => (
        <li key={c.id}>
          <button
            className={c.id === selectedId ? 'contact-item contact-item--active' : 'contact-item'}
            onClick={() => onSelect(c)}
          >
            <span className="contact-name">{c.name}</span>
            <span className="muted">{c.phone}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
