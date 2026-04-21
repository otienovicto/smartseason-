import React from 'react'

export default function FieldsTable({ fields = [], onRefresh, onEdit }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Fields</h3>
        <div>
          <button className="btn btn-ghost" onClick={onRefresh}>Refresh</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Crop</th>
            <th>Planting</th>
            <th>Stage</th>
            <th>Assigned</th>
            <th>Status</th>
            {onEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {fields.length === 0 && (
            <tr><td colSpan="6">No fields found</td></tr>
          )}
          {fields.map((f) => {
            const agent = f.assigned_agent
            const agentLabel = agent ? (typeof agent === 'object' ? (agent.name || agent.username || agent.email) : agent) : '—'
            const planting = f.planting_date || f.created_at || '-'
            return (
              <tr key={f.id || f.name}>
                <td>{f.name}</td>
                <td>{f.crop_type || '-'}</td>
                <td>{planting}</td>
                <td>{f.current_stage || '-'}</td>
                <td>{agentLabel}</td>
                <td>{f.status || '-'}</td>
                {onEdit && (
                  <td>
                    <button className="btn btn-ghost" onClick={() => onEdit(f)}>Edit</button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
