import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: fetch current session from Laravel if cookie-based /sanctum
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Example placeholder – integrate with Laravel auth route
    // const { data } = await api.post('/login', { email, password })
    setUser({ name: 'Nazim', role: 'student', avatar: null, email })
  }

  const register = async (payload) => {
    // await api.post('/register', payload)
    setUser({ name: payload.name, role: payload.role, email: payload.email, avatar: null })
  }

  const logout = async () => {
    // await api.post('/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
