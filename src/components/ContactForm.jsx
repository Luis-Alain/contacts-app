import { useState } from 'react'

export default function ContactForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setMessage('')
    try {
      await onSave({ name: name.trim(), phone: phone.trim() })
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      if (!err.fieldErrors) setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{initial ? 'Edit contact' : 'New contact'}</h2>

      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana Pérez" />
        {errors.Name && <span className="field-error">{errors.Name.join(' ')}</span>}
      </label>

      <label>
        Phone
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+50761234567" />
        {errors.Phone && <span className="field-error">{errors.Phone.join(' ')}</span>}
      </label>

      {message && <p className="field-error">{message}</p>}

      <div className="actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
