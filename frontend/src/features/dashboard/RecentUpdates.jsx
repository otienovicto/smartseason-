import React from 'react'
import { Link } from 'react-router-dom'

export default function RecentUpdates({ updates = [] }) {
  return (
    <div>
      <h3>Recent Updates</h3>
      {updates.length === 0 && <div>No recent updates.</div>}
      {updates.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {updates.map((u) => {
            const field = u.field && typeof u.field === 'object' ? u.field.name : u.field_name || u.field
            const fieldId = (u.field && u.field.id) || u.field_id || u.field
            const agent = u.agent
            const agentLabel = agent ? (typeof agent === 'object' ? agent.name || agent.username || agent.email : agent) : '—'
            const time = u.created_at ? new Date(u.created_at).toLocaleString() : ''
            return (
              <li key={u.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <strong>{u.stage}</strong> <span style={{ color: '#666', marginLeft: 8 }}>{time}</span>
                </div>
                <div style={{ marginTop: 4 }}>{u.notes}</div>
                <div style={{ marginTop: 6, color: '#666', fontSize: 12 }}>
                  Field: {fieldId ? <Link to={`/fields/${fieldId}`}>{field || `#${fieldId}`}</Link> : (field || '—')} — By: {agentLabel}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
