import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Lock } from 'lucide-react'

const fields = [
  { name: 'full_name',    label: 'Full Name',    type: 'text',     placeholder: 'John Doe',          icon: User },
  { name: 'email',        label: 'Email',        type: 'email',    placeholder: 'you@example.com',   icon: Mail },
  { name: 'phone_number', label: 'Phone Number', type: 'tel',      placeholder: '+254700000000',     icon: Phone },
  { name: 'password',     label: 'Password',     type: 'password', placeholder: '••••••••',          icon: Lock },
]

export default function Register() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ full_name: '', email: '', phone_number: '', password: '', auth_provider: 'email' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/users/auth/register/', form)
      loginUser(data.user, data.tokens)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data
      const first  = errors ? Object.values(errors)[0][0] : 'Registration failed.'
      toast.error(first)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #0077B6, #023E8A)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>
            🧺
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A', marginBottom: '6px' }}>Create account</h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Join Laundrify today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
            <div key={name}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
                <input name={name} type={type} required onChange={handleChange} value={form[name]}
                  placeholder={placeholder}
                  style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#0077B6'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #0077B6, #023E8A)', color: 'white',
            border: 'none', padding: '13px', borderRadius: '10px', fontSize: '15px',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: '4px',
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0077B6', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}