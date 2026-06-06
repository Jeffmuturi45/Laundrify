import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { Package } from 'lucide-react'

const statusColor = {
  pending:          { bg: '#FEF9C3', color: '#854D0E' },
  picked_up:        { bg: '#DBEAFE', color: '#1E40AF' },
  processing:       { bg: '#EDE9FE', color: '#5B21B6' },
  out_for_delivery: { bg: '#FFEDD5', color: '#9A3412' },
  delivered:        { bg: '#DCFCE7', color: '#166534' },
  cancelled:        { bg: '#FEE2E2', color: '#991B1B' },
}

const FILTERS = ['all','pending','processing','out_for_delivery','delivered','cancelled']

export default function Orders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    api.get('/orders/').then(({ data }) => {
      setOrders(data.results || data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const card = { background: 'white', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A' }}>My Orders</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>{orders.length} total orders</p>
        </div>
        <Link to="/orders/new" style={{
          textDecoration: 'none', background: 'linear-gradient(135deg, #0077B6, #023E8A)',
          color: 'white', padding: '10px 20px', borderRadius: '10px',
          fontSize: '14px', fontWeight: 600,
        }}>
          + New Order
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer', border: 'none',
            textTransform: 'capitalize', transition: 'all 0.15s',
            background: filter === s ? '#0077B6' : 'white',
            color: filter === s ? 'white' : '#6B7280',
            boxShadow: filter === s ? '0 2px 8px rgba(0,119,182,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #0077B6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>
          <Package size={52} style={{ margin: '0 auto 16px', opacity: 0.2 }}/>
          <p style={{ fontSize: '16px', fontWeight: 500 }}>No orders found</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Try a different filter or place a new order</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map(order => {
            const sc = statusColor[order.status] || { bg: '#F3F4F6', color: '#374151' }
            return (
              <div key={order.id} style={{ ...card, padding: '20px', transition: 'box-shadow 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#023E8A', fontSize: '16px' }}>Order #{order.id}</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { label: 'Service',  value: order.service_detail?.service_name || '—' },
                    { label: 'Pickup',   value: new Date(order.scheduled_pickup).toLocaleString() },
                    { label: 'Weight',   value: `${order.estimated_weight_kg} kg` },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#9CA3AF' }}>{row.label}</span>
                      <span style={{ color: '#374151', fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #F3F4F6' }}>
                  <span style={{ fontWeight: 700, color: '#0077B6', fontSize: '15px' }}>
                    KES {order.total_price || '—'}
                  </span>
                  <Link to={`/orders/${order.id}`} style={{ fontSize: '13px', color: '#0077B6', textDecoration: 'none', fontWeight: 500 }}>
                    View details →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}