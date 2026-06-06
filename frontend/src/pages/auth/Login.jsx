import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
  const { loginUser } = useAuth()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/users/auth/login/', form)
      loginUser(data.user, data.tokens)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  // inside the Login component, add:
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const { data } = await api.post('/users/auth/google/', {
        token: tokenResponse.access_token,
      })
      loginUser(data.user, data.tokens)
      toast.success('Signed in with Google!')
      navigate('/dashboard')
    } catch {
      toast.error('Google sign-in failed.')
    }
  },
  onError: () => toast.error('Google sign-in failed.'),
})


  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #0077B6, #023E8A)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>
            🧺
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Sign in to your Laundrify account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
              <input name="email" type="email" required onChange={handleChange} value={form.email}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
              <input name="password" type="password" required onChange={handleChange} value={form.password}
                placeholder="••••••••"
                style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #0077B6, #023E8A)', color: 'white',
            border: 'none', padding: '13px', borderRadius: '10px', fontSize: '15px',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', transition: 'opacity 0.15s',
          }}>
            <LogIn size={16}/> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #F3F4F6' }}/>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>or continue with</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #F3F4F6' }}/>
        </div>

      
<button onClick={() => googleLogin()} type="button" style={{
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '10px', padding: '11px', border: '1.5px solid #E5E7EB', borderRadius: '10px',
  background: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
  color: '#374151',
}}>
  <img src="https://www.google.com/favicon.ico" style={{ width: '16px', height: '16px' }} alt=""/>
  Continue with Google
</button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '24px' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#0077B6', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </p>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '8px' }}>
          Are you a driver?{' '}
          <Link to="/driver/login" style={{ color: '#0077B6', fontWeight: 600, textDecoration: 'none' }}>Driver login →</Link>
        </p>
      </div>
    </div>
  )
}