import React from 'react'

function normalizeBreakdown(breakdown) {
  const map = {}
  Object.entries(breakdown || {}).forEach(([k, v]) => {
    const key = ('' + k).trim().toLowerCase()
    if (key.includes('complete')) map['Completed'] = v
    else if (key.includes('risk')) map['At Risk'] = v
    else if (key.includes('active') || key.includes('in progress')) map['Active'] = v
    else map[k] = v
  })
  map['Active'] = map['Active'] ?? 0
  map['At Risk'] = map['At Risk'] ?? 0
  map['Completed'] = map['Completed'] ?? 0
  return map
}

function Card({ title, value, percent, color = '#4CAF50' }) {
  return (
    <div className="card" style={{ flex: 1, padding: 12 }}>
      <div style={{ fontSize: 12 }} className="muted">{title}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
      <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, marginTop: 8 }}>
        <div style={{ height: '100%', background: color, width: `${percent}%`, borderRadius: 4 }} />
      </div>
    </div>
  )
}

export default function DashboardCards({ total = 0, breakdown = {} }) {
  const parts = normalizeBreakdown(breakdown)
  const active = parts['Active'] || 0
  const risk = parts['At Risk'] || 0
  const completed = parts['Completed'] || 0
  const safeTotal = total || active + risk + completed || 1
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      <Card title="Total Fields" value={total} percent={100} color="#1976d2" />
      <Card title="Active" value={active} percent={Math.round((active / safeTotal) * 100)} color="#4CAF50" />
      <Card title="At Risk" value={risk} percent={Math.round((risk / safeTotal) * 100)} color="#ff9800" />
      <Card title="Completed" value={completed} percent={Math.round((completed / safeTotal) * 100)} color="#9e9e9e" />
    </div>
  )
}
