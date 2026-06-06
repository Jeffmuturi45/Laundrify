import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Camera } from 'lucide-react'

const inputStyle = {
  width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E5E7EB',
  borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}

export default function Profile() {
  const { user, loginUser } = useAuth()
  const [form, setForm]     = useState({ full_name: '', phone_number: '' })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile]       = useState(null)

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name, phone_number: user.phone_number })
  }, [user])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFile = e => {
    const f = e.target.files[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('full_name',    form.full_name)
      formData.append('phone_number', form.phone_number)
      if (file) formData.append('profile_picture', file)

      const { data } = await api.patch('/users/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Profile updated!')
      const tokens = { access: localStorage.getItem('access_token'), refresh: localStorage.getItem('refresh_token') }
      loginUser(data.user, tokens)
    } catch {
      toast.error('Update failed.')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A' }}>My Profile</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Update your personal information</p>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB', padding: '28px' }}>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #0077B6, #023E8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid #E5E7EB' }}>
              {preview || user?.profile_picture ? (
                <img src={preview || user.profile_picture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              ) : (
                <span style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{initials}</span>
              )}
            </div>
            <label style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', background: '#0077B6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }}>
              <Camera size={13} color="white"/>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile}/>
            </label>
          </div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{user?.full_name}</p>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full name */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
              <input name="full_name" type="text" required onChange={handleChange} value={form.full_name}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
              <input name="phone_number" type="tel" required onChange={handleChange} value={form.phone_number}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
          </div>

          {/* Email (readonly) */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(cannot change)</span></label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}/>
              <input value={user?.email || ''} disabled
                style={{ ...inputStyle, background: '#F9FAFB', color: '#9CA3AF', cursor: 'not-allowed' }}/>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #0077B6, #023E8A)', color: 'white',
            border: 'none', padding: '13px', borderRadius: '10px', fontSize: '15px',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: '4px',
          }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}