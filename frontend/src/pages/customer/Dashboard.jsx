import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { Package, MapPin, CreditCard, Bell, TrendingUp, Clock } from 'lucide-react'

const statusColor = {
  pending:          { bg: '#FEF9C3', color: '#854D0E' },
  picked_up:        { bg: '#DBEAFE', color: '#1E40AF' },
  processing:       { bg: '#EDE9FE', color: '#5B21B6' },
  out_for_delivery: { bg: '#FFEDD5', color: '#9A3412' },
  delivered:        { bg: '#DCFCE7', color: '#166534' },
  cancelled:        { bg: '#FEE2E2', color: '#991B1B' },
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/').then(({ data }) => {
      setOrders(data.results || data)
    }).finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Orders',  value: orders.length,                                                             icon: <Package size={22}/>,    bg: '#EFF6FF', color: '#0077B6' },
    { label: 'Delivered',     value: orders.filter(o => o.status === 'delivered').length,                       icon: <TrendingUp size={22}/>,  bg: '#F0FDF4', color: '#16A34A' },
    { label: 'In Progress',   value: orders.filter(o => !['delivered','cancelled'].includes(o.status)).length,  icon: <Clock size={22}/>,       bg: '#FDF4FF', color: '#9333EA' },
    { label: 'Notifications', value: '—',                                                                       icon: <Bell size={22}/>,        bg: '#FFF7ED', color: '#EA580C' },
  ]

  const card = {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB',
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A', marginBottom: '4px' }}>
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Here's your laundry overview for today.</p>
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

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <Link to="/orders/new" style={{
          textDecoration: 'none', background: 'linear-gradient(135deg, #0077B6, #023E8A)',
          borderRadius: '16px', padding: '24px', color: 'white', display: 'block',
          transition: 'transform 0.15s, box-shadow 0.15s',
          boxShadow: '0 4px 16px rgba(0,119,182,0.3)',
        }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Package size={20}/>
          </div>
          <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Place New Order</p>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>Schedule a pickup now</p>
        </Link>

        <Link to="/addresses" style={{ textDecoration: 'none', ...card, padding: '24px', display: 'block', transition: 'box-shadow 0.15s' }}>
          <div style={{ width: '40px', height: '40px', background: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#0077B6' }}>
            <MapPin size={20}/>
          </div>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#111827', marginBottom: '4px' }}>My Addresses</p>
          <p style={{ fontSize: '12px', color: '#6B7280' }}>Manage pickup & delivery</p>
        </Link>

        <Link to="/payments" style={{ textDecoration: 'none', ...card, padding: '24px', display: 'block', transition: 'box-shadow 0.15s' }}>
          <div style={{ width: '40px', height: '40px', background: '#F0FDF4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#16A34A' }}>
            <CreditCard size={20}/>
          </div>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#111827', marginBottom: '4px' }}>Payments</p>
          <p style={{ fontSize: '12px', color: '#6B7280' }}>View payment history</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ ...card, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#023E8A' }}>Recent Orders</h2>
          <Link to="/orders" style={{ fontSize: '13px', color: '#0077B6', textDecoration: 'none', fontWeight: 500 }}>View All →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #0077B6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
            <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }}/>
            <p style={{ fontSize: '14px' }}>No orders yet. Place your first order!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {['Order', 'Service', 'Scheduled Pickup', 'Status', 'Total'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => {
                  const sc = statusColor[order.status] || { bg: '#F3F4F6', color: '#374151' }
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.1s' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 600, color: '#023E8A' }}>#{order.id}</td>
                      <td style={{ padding: '14px 12px', color: '#374151' }}>{order.service_detail?.service_name || '—'}</td>
                      <td style={{ padding: '14px 12px', color: '#6B7280' }}>{new Date(order.scheduled_pickup).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 600, color: '#0077B6' }}>KES {order.total_price || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}