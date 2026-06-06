import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function DriverLogin() {
  const { loginDriver } = useAuth()
  const navigate        = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange  = e => setForm({ ...form, [e.target.name]: e.target.value })

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
    <div className="min-h-screen bg-[#023E8A] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0077B6]">🚗 Driver Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your driver account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required
              onChange={handleChange} value={form.email}
              placeholder="driver@example.com"
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"/>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required
              onChange={handleChange} value={form.password}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"/>
          </div>

          <button type="submit" disabled={loading}
            className="bg-[#0077B6] text-white py-2 rounded-lg font-semibold hover:bg-[#023E8A] transition disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In as Driver'}
          </button>
        </form>
      </div>
    </div>
  )
}