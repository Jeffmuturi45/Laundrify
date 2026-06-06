import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,   setUser]   = useState(null)
  const [driver, setDriver] = useState(null)
  const [role,   setRole]   = useState(null) // 'customer' | 'driver' | 'admin'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser   = localStorage.getItem('user')
    const storedDriver = localStorage.getItem('driver')
    const storedRole   = localStorage.getItem('role')

    if (storedUser)   setUser(JSON.parse(storedUser))
    if (storedDriver) setDriver(JSON.parse(storedDriver))
    if (storedRole)   setRole(storedRole)

    setLoading(false)
  }, [])

  const loginUser = (userData, tokens) => {
    localStorage.setItem('access_token',  tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', 'customer')
    setUser(userData)
    setRole('customer')
  }

  const loginDriver = (driverData, tokens) => {
    localStorage.setItem('access_token',  tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('driver', JSON.stringify(driverData))
    localStorage.setItem('role', 'driver')
    setDriver(driverData)
    setRole('driver')
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setDriver(null)
    setRole(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, driver, role, loading, loginUser, loginDriver, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)