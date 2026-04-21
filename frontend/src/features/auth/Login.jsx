import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './authContext'
import './Login.css'

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(true)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
      setLoading(true)
      try {
        await login({ username, password })
        if (remember) {
          try { localStorage.setItem('ss_remember', '1') } catch (e) {}
        } else {
          try { localStorage.removeItem('ss_remember') } catch (e) {}
        }
        navigate('/')
      } catch (err) {
        setError(err?.response?.data?.detail || 'Invalid credentials')
      } finally {
        setLoading(false)
    }
  }

    return (
      <div className="ss-login-page">
        <div className="ss-card" role="main">
          <div className="ss-side" aria-hidden="true">
            <div className="ss-side-illustration">🌾</div>
            <h2>Welcome back</h2>
            <p>Manage your fields, updates, and crop health in one place.</p>
          </div>

          <div className="ss-form-area">
            <div className="ss-brand">
              <div className="ss-logo">SS</div>
              <div>
                <h3 className="ss-title">SmartSeason</h3>
                <p className="ss-sub">Track crop progress across fields</p>
              </div>
            </div>

            <form className="ss-form" onSubmit={handleSubmit}>
              <div className="ss-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="your.username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(null) }}
                  required
                />
              </div>

              <div className="ss-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null) }}
                  required
                />
              </div>

              <div className="ss-actions">
                <label className="ss-remember">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span>Remember me</span>
                </label>

                <button type="submit" className="ss-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
              </div>

              {error && <div className="ss-error" role="alert" aria-live="assertive">{error}</div>}

              <div className="ss-footer">
                <div>Need an account? <a href="/register">Register</a></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
