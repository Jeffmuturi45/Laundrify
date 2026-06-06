import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function DriverLogin() {
  const { loginDriver } = useAuth()
  const navigate        = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/drivers/auth/login/', form)
      loginDriver(data.driver, data.tokens)
      toast.success('Welcome back, Driver!')
      navigate('/driver/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 60%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #023E8A, #0077B6)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>
            🚗
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A', marginBottom: '6px' }}>Driver Portal</h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Sign in to manage your deliveries</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
              <input name="email" type="email" required onChange={handleChange} value={form.email}
                placeholder="driver@example.com"
                style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
              <input name="password" type="password" required onChange={handleChange} value={form.password}
                placeholder="••••••••"
                style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #023E8A, #0077B6)', color: 'white',
            border: 'none', padding: '13px', borderRadius: '10px', fontSize: '15px',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
          }}>
            <LogIn size={16}/> {loading ? 'Signing in...' : 'Sign In as Driver'}
          </button>
        </form>
      </div>
    </div>
  )
}