import React, { useEffect, useState } from 'react'
import { createField, listAgents } from './fieldsService'

export default function FieldForm({ onCreated }) {
  const [name, setName] = useState('')
  const [cropType, setCropType] = useState('')
  const [plantingDate, setPlantingDate] = useState('')
  const [currentStage, setCurrentStage] = useState('planted')
  const [assignedAgent, setAssignedAgent] = useState('')
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    listAgents()
      .then(list => {
        if (mounted) setAgents(list)
      })
      .catch(() => {})
    return () => (mounted = false)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        name,
        crop_type: cropType,
        planting_date: plantingDate || null,
        current_stage: currentStage,
        assigned_agent: assignedAgent || null,
      }
      await createField(payload)
      setName('')
      setCropType('')
      setPlantingDate('')
      setCurrentStage('planted')
      setAssignedAgent('')
      if (onCreated) onCreated()
    } catch (err) {
      // Try to show meaningful backend errors when available
      const resp = err && err.response && err.response.data
      if (resp) {
        if (typeof resp === 'string') setError(resp)
        else if (resp.detail) setError(resp.detail)
        else {
          try {
            const parts = Object.entries(resp).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            setError(parts.join(' | '))
          } catch (e) {
            setError('Failed to create field')
          }
        }
      } else {
        setError('Failed to create field')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
      <h3 className="section-title">Create Field</h3>
      <div className="form">
        <div className="field">
          <label>Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="field">
          <label>Crop type</label>
          <input className="input" value={cropType} onChange={(e) => setCropType(e.target.value)} required />
        </div>

        <div className="field">
          <label>Planting date</label>
          <input className="input" type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} />
        </div>

        <div className="field">
          <label>Current stage</label>
          <select className="select" value={currentStage} onChange={(e) => setCurrentStage(e.target.value)}>
            <option value="planted">Planted</option>
            <option value="growing">Growing</option>
            <option value="ready">Ready</option>
            <option value="harvested">Harvested</option>
          </select>
        </div>

        <div className="field">
          <label>Assign to agent</label>
          <select className="select" value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)}>
            <option value="">— unassigned —</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name || a.username || a.email}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="muted" style={{ color: 'red' }}>{error}</div>}

        <div className="actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Field'}</button>
        </div>
      </div>
    </form>
  )
}
