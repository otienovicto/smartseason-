import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../features/auth/authContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext)
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles) {
    const role = user?.role ? String(user.role).toUpperCase() : null
    const allowed = allowedRoles.map((r) => String(r).toUpperCase())
    const isSuper = !!user?.is_superuser
    if (!isSuper && !role) return <Navigate to="/" replace />
    if (!isSuper && !allowed.includes(role)) return <Navigate to="/" replace />
  }
  return children
}
