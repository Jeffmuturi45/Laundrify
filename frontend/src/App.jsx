import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Auth
import Login       from './pages/auth/Login'
import Register    from './pages/auth/Register'
import DriverLogin from './pages/auth/DriverLogin'

// Customer
import CustomerDashboard from './pages/customer/Dashboard'
import Orders            from './pages/customer/Orders'
import NewOrder          from './pages/customer/NewOrder'
import Profile           from './pages/customer/Profile'
import Notifications     from './pages/customer/Notifications'

// Driver
import DriverDashboard from './pages/driver/DriverDashboard'
import DriverOrders    from './pages/driver/DriverOrders'

// Misc
import Unauthorized from './pages/Unauthorized'

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right"/>
        <Routes>

          {/* Public */}
          <Route path="/login"         element={<Login/>}/>
          <Route path="/register"      element={<Register/>}/>
          <Route path="/driver/login"  element={<DriverLogin/>}/>
          <Route path="/unauthorized"  element={<Unauthorized/>}/>
          <Route path="/"              element={<Navigate to="/login" replace/>}/>

          {/* Customer routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><CustomerDashboard/></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><Orders/></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/orders/new" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><NewOrder/></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><Profile/></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><Notifications/></Layout>
            </ProtectedRoute>
          }/>

          {/* Driver routes */}
          <Route path="/driver/dashboard" element={
            <ProtectedRoute allowedRoles={['driver']}>
              <Layout><DriverDashboard/></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/driver/orders" element={
            <ProtectedRoute allowedRoles={['driver']}>
              <Layout><DriverOrders/></Layout>
            </ProtectedRoute>
          }/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}