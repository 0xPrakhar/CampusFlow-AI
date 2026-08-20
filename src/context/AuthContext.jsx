import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('campusflow-user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const persist = (session) => {
    const currentUser = session.user || session
    if (session.token) localStorage.setItem('campusflow-token', session.token)
    localStorage.setItem('campusflow-user', JSON.stringify(currentUser))
    setUser(currentUser)
    return currentUser
  }

  const logout = () => {
    localStorage.removeItem('campusflow-token')
    localStorage.removeItem('campusflow-user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login: async (data) => persist(await authApi.login(data)), register: async (data) => persist(await authApi.register(data)), logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
