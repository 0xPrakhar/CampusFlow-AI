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
    const currentUser = session?.user || session || null
    const accessToken = session?.accessToken || session?.token
    if (accessToken) localStorage.setItem('campusflow-token', accessToken)
    if (currentUser) localStorage.setItem('campusflow-user', JSON.stringify(currentUser))
    setUser(currentUser)
    return currentUser
  }

  const clearSession = () => {
    localStorage.removeItem('campusflow-token')
    localStorage.removeItem('campusflow-user')
    setUser(null)
  }

  const logout = async () => {
    try {
      if (user) await authApi.logout()
    } finally {
      clearSession()
    }
  }

  const deleteAccount = async () => {
    await authApi.deleteAccount()
    clearSession()
  }

  return <AuthContext.Provider value={{ user, loading, login: async (data) => persist(await authApi.login(data)), register: async (data) => persist(await authApi.register(data)), logout, deleteAccount }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
