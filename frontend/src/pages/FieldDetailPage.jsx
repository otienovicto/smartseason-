import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../features/auth/authContext'
import { getField } from '../features/fields/fieldsService'
import FieldUpdates from '../features/fields/FieldUpdates'
import '../styles/ui.css'

export default function FieldDetailPage() {
  const { id } = useParams()
  const { user, loading: userLoading } = useContext(AuthContext)
  const [field, setField] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchField()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchField() {
    setLoading(true)
    setError(null)
    try {
      const data = await getField(id)
      setField(data)
    } catch (e) {
      setError('Could not load field')
    } finally {
      setLoading(false)
    }
  }

  const assigned = field && field.assigned_agent
  const assignedId = assigned ? (typeof assigned === 'object' ? assigned.id : assigned) : null
  const canUpdate = user && user.role && (user.role.toUpperCase() === 'ADMIN' || (user.role.toUpperCase() === 'AGENT' && user.id === assignedId))

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Field detail</h1>
          <div className="subtitle">Field information and updates</div>
        </div>

        <div>
          <button className="btn" onClick={fetchField}>Refresh</button>
        </div>
      </div>

      {userLoading && <div className="card">Loading user...</div>}
      {loading && <div className="card">Loading field...</div>}
      {error && <div className="card" style={{ color: '#ef4444' }}>{error}</div>}

      {field && (
        <div className="detail-grid">
          <div className="card">
            <div className="detail-item">
              <div className="detail-label">Name</div>
              <div className="detail-value">{field.name}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Crop</div>
              <div className="detail-value">{field.crop_type || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Planting date</div>
              <div className="detail-value">{field.planting_date || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Stage</div>
              <div className="detail-value">{field.current_stage || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Assigned</div>
              <div className="detail-value">{assigned ? (typeof assigned === 'object' ? (assigned.name || assigned.username || assigned.email) : assigned) : '—'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Status</div>
              <div className="detail-value">{field.status || '-'}</div>
            </div>
          </div>

          <div>
            <FieldUpdates fieldId={id} canUpdate={!!canUpdate} onUpdated={fetchField} />
          </div>
        </div>
      )}
    </div>
  )
}
