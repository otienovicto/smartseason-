import React, { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../features/auth/authContext'

export default function NavBar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Hide navbar on the login page
  if (location && location.pathname === '/login') return null
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const isAdmin = !!user && (user.is_superuser || (user.role && String(user.role).toUpperCase() === 'ADMIN'))
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid #eee', background:'#fff' }}>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <Link to="/" style={{ textDecoration:'none', color:'#0b1224', fontWeight:800, fontSize:18 }}>SmartSeason</Link>
        <Link to="/" style={{ textDecoration:'none', color:'#334155', marginLeft:12 }}>Dashboard</Link>
        <Link to="/fields" style={{ textDecoration:'none', color:'#334155', marginLeft:8 }}>Fields</Link>
        {isAdmin && <Link to="/admin" style={{ textDecoration:'none', color:'#334155', marginLeft:8 }}>Admin</Link>}
      </div>
      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        {user && <div style={{ color:'#0f172a', fontWeight:600 }}>{user.name || user.username || user.email}</div>}
        <button onClick={handleLogout} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #e6e9ee', background:'#fff', cursor:'pointer' }}>Logout</button>
      </div>
    </nav>
  )
}
