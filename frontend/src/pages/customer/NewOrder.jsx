import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Package } from 'lucide-react'

const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #E5E7EB',
  borderRadius: '10px', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', background: 'white', color: '#111827',
}

export default function NewOrder() {
  const navigate = useNavigate()
  const [services,  setServices]  = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [form, setForm] = useState({
    service_id: '', pickup_address_id: '', delivery_address_id: '',
    scheduled_pickup: '', estimated_weight_kg: '', special_instructions: ''
  })

  useEffect(() => {
    api.get('/services/').then(({ data }) => setServices(data.results || data))
    api.get('/users/addresses/').then(({ data }) => setAddresses(data.results || data))
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/orders/', form)
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      const errors = err.response?.data
      const first  = errors ? Object.values(errors)[0][0] : 'Failed to place order.'
      toast.error(first)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A' }}>Place New Order</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Fill in the details below to schedule your laundry pickup.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB', padding: '28px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Service */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Select Service</label>
            <select name="service_id" required onChange={handleChange} value={form.service_id}
              style={{ ...inputStyle }}
              onFocus={e => e.target.style.borderColor = '#0077B6'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
              <option value="">-- Choose a service --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.service_name} — KES {s.base_price_per_kg}/kg ({s.estimated_turnaround_hrs}hrs)
                </option>
              ))}
            </select>
          </div>

          {/* Addresses side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Pickup Address</label>
              <select name="pickup_address_id" required onChange={handleChange} value={form.pickup_address_id}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                <option value="">-- Select --</option>
                {addresses.map(a => (
                  <option key={a.id} value={a.id}>{a.label} — {a.city}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Delivery Address</label>
              <select name="delivery_address_id" required onChange={handleChange} value={form.delivery_address_id}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                <option value="">-- Select --</option>
                {addresses.map(a => (
                  <option key={a.id} value={a.id}>{a.label} — {a.city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pickup time + weight side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Scheduled Pickup</label>
              <input name="scheduled_pickup" type="datetime-local" required
                onChange={handleChange} value={form.scheduled_pickup}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Estimated Weight (kg)</label>
              <input name="estimated_weight_kg" type="number" step="0.1" min="0.1" required
                onChange={handleChange} value={form.estimated_weight_kg}
                placeholder="e.g. 3.5"
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = '#0077B6'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
          </div>

          {/* Special instructions */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Special Instructions <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
            <textarea name="special_instructions" rows={3}
              onChange={handleChange} value={form.special_instructions}
              placeholder="Any special handling notes..."
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
              onFocus={e => e.target.style.borderColor = '#0077B6'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
          </div>

          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #0077B6, #023E8A)', color: 'white',
            border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
          }}>
            <Package size={16}/> {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  )
}