import React, { useEffect, useState } from 'react'
import { listFieldUpdates, createFieldUpdate } from './fieldsService'

const STAGES = ['Planted', 'Germination', 'Vegetative', 'Flowering', 'Maturation', 'Harvested', 'Other']

export default function FieldUpdates({ fieldId, canUpdate = false, onUpdated }) {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(STAGES[0])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUpdates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId])

  async function fetchUpdates() {
    setLoading(true)
    setError(null)
    try {
      const data = await listFieldUpdates(fieldId)
      setUpdates(data || [])
    } catch (e) {
      setError('Failed to load updates')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createFieldUpdate(fieldId, { stage, notes })
      setNotes('')
      setStage(STAGES[0])
      await fetchUpdates()
      if (onUpdated) onUpdated()
    } catch (err) {
      setError('Failed to post update')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Updates</h3>

      {canUpdate && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block' }}>Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block' }}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} style={{ width: '100%' }} />
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <div>
            <button type="submit" disabled={submitting}>{submitting ? 'Posting...' : 'Post update'}</button>
          </div>
        </form>
      )}

      {loading && <div>Loading updates...</div>}

      {!loading && updates.length === 0 && <div>No updates yet.</div>}

      {!loading && updates.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {updates.map((u) => {
            const agent = u.agent
            const agentLabel = agent ? (typeof agent === 'object' ? (agent.name || agent.username || agent.email) : agent) : '—'
            const time = u.created_at ? new Date(u.created_at).toLocaleString() : ''
            return (
              <li key={u.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                <div style={{ fontWeight: 600 }}>{u.stage} <span style={{ fontWeight: 400, color: '#666', marginLeft: 8 }}>{time}</span></div>
                <div style={{ color: '#333' }}>{u.notes}</div>
                <div style={{ color: '#666', fontSize: 12 }}>By: {agentLabel}</div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
