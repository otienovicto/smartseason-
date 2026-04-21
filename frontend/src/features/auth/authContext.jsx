import React, { createContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../../services/api'
import * as authService from './authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          setAuthToken(token)
          const res = await api.get('/users/me/')
          if (mounted) setUser(res.data)
        }
      } catch (e) {
        setAuthToken(null)
        setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    init()
    return () => (mounted = false)
  }, [])

  const login = async (credentials) => {
    const { user } = await authService.login(credentials)
    setUser(user)
    return user
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
