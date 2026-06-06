import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-[#0077B6] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!role) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />

  return children
}