import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Package, MapPin, User } from 'lucide-react'

const statusColor = {
  pending:          { bg: '#FEF9C3', color: '#854D0E' },
  picked_up:        { bg: '#DBEAFE', color: '#1E40AF' },
  processing:       { bg: '#EDE9FE', color: '#5B21B6' },
  out_for_delivery: { bg: '#FFEDD5', color: '#9A3412' },
  delivered:        { bg: '#DCFCE7', color: '#166534' },
}

const ALLOWED = ['picked_up', 'out_for_delivery', 'delivered']

const actionColor = {
  picked_up:        { bg: '#DBEAFE', color: '#1E40AF', hover: '#BFDBFE' },
  out_for_delivery: { bg: '#FFEDD5', color: '#9A3412', hover: '#FED7AA' },
  delivered:        { bg: '#DCFCE7', color: '#166534', hover: '#BBF7D0' },
}

export default function DriverOrders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/driver/assigned/').then(({ data }) => {
      setOrders(data.results || data)
    }).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/driver/${orderId}/status/`, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update status.')
    }
  }

  const card = { background: 'white', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A' }}>My Assigned Orders</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>{orders.length} orders assigned to you</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #0077B6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>
          <Package size={52} style={{ margin: '0 auto 16px', opacity: 0.2 }}/>
          <p style={{ fontSize: '16px', fontWeight: 500 }}>No orders assigned yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const sc = statusColor[order.status] || { bg: '#F3F4F6', color: '#374151' }
            return (
              <div key={order.id} style={{ ...card, padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '17px', fontWeight: 700, color: '#023E8A' }}>Order #{order.id}</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{order.service_detail?.service_name}</p>
                  </div>
                  <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', padding: '14px', background: '#F9FAFB', borderRadius: '10px' }}>
                  {[
                    { icon: <User size={14}/>, label: 'Customer', value: order.user },
                    { icon: <Package size={14}/>, label: 'Weight',  value: `${order.estimated_weight_kg} kg` },
                    { icon: <MapPin size={14}/>, label: 'Pickup',   value: order.pickup_detail?.street_address || '—' },
                    { icon: <MapPin size={14}/>, label: 'Delivery', value: order.delivery_detail?.street_address || '—' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: '#9CA3AF', marginTop: '1px', flexShrink: 0 }}>{row.icon}</span>
                      <div>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</p>
                        <p style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ALLOWED.filter(s => s !== order.status).map(s => {
                    const ac = actionColor[s]
                    return (
                      <button key={s} onClick={() => updateStatus(order.id, s)} style={{
                        padding: '8px 16px', borderRadius: '8px', border: 'none',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        background: ac.bg, color: ac.color, textTransform: 'capitalize',
                        transition: 'opacity 0.15s',
                      }}>
                        Mark as {s.replace(/_/g, ' ')}
                      </button>
                    )
                  })}
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