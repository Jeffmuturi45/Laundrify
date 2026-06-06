import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { Package, CheckCircle, Clock, MapPin } from 'lucide-react'

const statusColor = {
  pending:          { bg: '#FEF9C3', color: '#854D0E' },
  picked_up:        { bg: '#DBEAFE', color: '#1E40AF' },
  processing:       { bg: '#EDE9FE', color: '#5B21B6' },
  out_for_delivery: { bg: '#FFEDD5', color: '#9A3412' },
  delivered:        { bg: '#DCFCE7', color: '#166534' },
}

export default function DriverDashboard() {
  const { driver } = useAuth()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/driver/assigned/').then(({ data }) => {
      setOrders(data.results || data)
    }).finally(() => setLoading(false))
  }, [])

  const card = { background: 'white', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }

  const stats = [
    { label: 'Total Assigned', value: orders.length,                                      icon: <Package size={22}/>,     bg: '#EFF6FF', color: '#0077B6' },
    { label: 'Delivered',      value: orders.filter(o => o.status === 'delivered').length, icon: <CheckCircle size={22}/>, bg: '#F0FDF4', color: '#16A34A' },
    { label: 'Pending',        value: orders.filter(o => o.status === 'pending').length,   icon: <Clock size={22}/>,       bg: '#FEF9C3', color: '#854D0E' },
  ]

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A' }}>
          Hey, {driver?.full_name?.split(' ')[0]} 🚗
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Here are your deliveries for today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent assignments */}
      <div style={{ ...card, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#023E8A' }}>Assigned Orders</h2>
          <Link to="/driver/orders" style={{ fontSize: '13px', color: '#0077B6', textDecoration: 'none', fontWeight: 500 }}>View All →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #0077B6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
            <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.2 }}/>
            <p style={{ fontSize: '14px' }}>No orders assigned yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.slice(0, 6).map(order => {
              const sc = statusColor[order.status] || { bg: '#F3F4F6', color: '#374151' }
              return (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '12px', border: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077B6' }}>
                      <MapPin size={16}/>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#023E8A' }}>Order #{order.id}</p>
                      <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{order.pickup_detail?.street_address || 'Pickup address'}</p>
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}