import React, { useEffect, useState } from 'react'
import { getDashboard } from '../features/dashboard/dashboardService'
import DashboardCards from '../features/dashboard/DashboardCards'
import RecentUpdates from '../features/dashboard/RecentUpdates'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    setLoading(true)
    setError(null)
    try {
      const resp = await getDashboard()
      setData(resp)
    } catch (e) {
      setError('Could not load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const total = data?.total_fields ?? data?.total ?? 0
  const breakdown = data?.status_breakdown ?? data?.status ?? data?.statuses ?? {}
  const updates = data?.recent_updates ?? data?.recent ?? data?.updates ?? []

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Overview of field activity, crop status, and recent updates
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchDashboard}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* STATES */}
      {loading && (
        <div className="card" style={{ marginTop: 12 }}>
          Loading dashboard...
        </div>
      )}

      {error && (
        <div className="card" style={{ marginTop: 12, color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* MAIN CONTENT */}
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* SUMMARY CARDS */}
          <DashboardCards total={total} breakdown={breakdown} />

          {/* RECENT UPDATES */}
          <div className="card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <h2 style={{ margin: 0 }}>Recent Updates</h2>
              <span className="muted">{updates.length} records</span>
            </div>

            <RecentUpdates updates={updates} />
          </div>

        </div>
      )}
    </div>
  )
}
