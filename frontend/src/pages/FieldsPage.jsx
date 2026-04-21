import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../features/auth/authContext'
import { listFields, updateField, listAgents } from '../features/fields/fieldsService'
import FieldForm from '../features/fields/FieldForm'
import FieldsTable from '../features/fields/FieldsTable'

export default function FieldsPage() {
  const { user, loading } = useContext(AuthContext)
  const [fields, setFields] = useState([])
  const [loadingFields, setLoadingFields] = useState(false)
  const [error, setError] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', crop_type: '', planting_date: '', current_stage: 'planted', assigned_agent: '' })
  const [agents, setAgents] = useState([])
  const [editError, setEditError] = useState(null)

  useEffect(() => {
    fetchFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function fetchFields() {
    setLoadingFields(true)
    setError(null)
    try {
      let data = await listFields()
      if (user && user.role && user.role.toUpperCase() === 'AGENT') {
        const uid = user.id
        data = data.filter((f) => {
          const a = f.assigned_agent
          if (!a) return false
          if (typeof a === 'object') return a.id === uid
          return a === uid
        })
      }
      setFields(data)
    } catch (e) {
      setError('Could not load fields')
    } finally {
      setLoadingFields(false)
    }
  }

  const handleCreated = () => fetchFields()

  useEffect(() => {
    let mounted = true
    listAgents().then((list) => { if (mounted) setAgents(list) }).catch(() => {})
    return () => (mounted = false)
  }, [])

  function startEdit(field) {
    setEditingField(field)
    setEditForm({
      name: field.name || '',
      crop_type: field.crop_type || '',
      planting_date: field.planting_date || '',
      current_stage: field.current_stage || 'planted',
      assigned_agent: field.assigned_agent ? (typeof field.assigned_agent === 'object' ? field.assigned_agent.id : field.assigned_agent) : ''
    })
    setEditError(null)
  }

  function cancelEdit() {
    setEditingField(null)
    setEditForm({ name: '', crop_type: '', planting_date: '', current_stage: 'planted', assigned_agent: '' })
    setEditError(null)
  }

  async function saveEdit(e) {
    e.preventDefault()
    setEditError(null)
    try {
      const payload = {
        name: editForm.name,
        crop_type: editForm.crop_type,
        planting_date: editForm.planting_date || null,
        current_stage: editForm.current_stage,
        assigned_agent: editForm.assigned_agent || null,
      }
      await updateField(editingField.id, payload)
      cancelEdit()
      fetchFields()
    } catch (err) {
      setEditError('Failed to update field')
    }
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Fields</h1>
          <p className="subtitle">Manage fields, assignments, and crop progress</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={fetchFields}>{loadingFields ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>

      {loading && <div className="card">Loading user...</div>}

      {error && <div className="card" style={{ color: '#ef4444' }}>{error}</div>}

      <div className="card-row" style={{ gap: 20 }}>
        {user && user.role && user.role.toUpperCase() === 'ADMIN' && (
          <div className="card" style={{ flex: 1, maxWidth: 420 }}>
            <h3 style={{ marginTop: 0 }}>Create Field</h3>
            <FieldForm onCreated={handleCreated} />
          </div>
        )}

        <div style={{ flex: 2 }}>
          {editingField && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginTop: 0 }}>Edit Field</h3>
              <form onSubmit={saveEdit} className="form">
                <div className="field"><label>Name</label><input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></div>
                <div className="field"><label>Crop type</label><input className="input" value={editForm.crop_type} onChange={(e) => setEditForm({ ...editForm, crop_type: e.target.value })} required /></div>
                <div className="field"><label>Planting date</label><input className="input" type="date" value={editForm.planting_date || ''} onChange={(e) => setEditForm({ ...editForm, planting_date: e.target.value })} /></div>
                <div className="field"><label>Current stage</label>
                  <select className="select" value={editForm.current_stage} onChange={(e) => setEditForm({ ...editForm, current_stage: e.target.value })}>
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="ready">Ready</option>
                    <option value="harvested">Harvested</option>
                  </select>
                </div>
                <div className="field"><label>Assigned agent</label>
                  <select className="select" value={editForm.assigned_agent || ''} onChange={(e) => setEditForm({ ...editForm, assigned_agent: e.target.value })}>
                    <option value="">— unassigned —</option>
                    {agents.map((a) => <option key={a.id} value={a.id}>{a.name || a.username || a.email}</option>)}
                  </select>
                </div>
                {editError && <div className="muted" style={{ color: 'red' }}>{editError}</div>}
                <div className="actions">
                  <button className="btn btn-primary" type="submit">Save</button>
                  <button className="btn btn-ghost" type="button" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            </div>
          )}
          <FieldsTable fields={fields} onRefresh={fetchFields} onEdit={user && user.role && user.role.toUpperCase() === 'ADMIN' ? startEdit : null} />
          {loadingFields && <div className="muted">Loading fields...</div>}
        </div>
      </div>
    </div>
  )
}
