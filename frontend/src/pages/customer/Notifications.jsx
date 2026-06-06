import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Bell, CheckCircle } from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/notifications/').then(({ data }) => {
      setNotifications(data.results || data)
    }).finally(() => setLoading(false))
  }, [])

  const markRead = async id => {
    await api.patch(`/users/notifications/${id}/read/`)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const unread = notifications.filter(n => !n.is_read).length

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#023E8A' }}>Notifications</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <span style={{ background: '#EFF6FF', color: '#0077B6', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
            {unread} new
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #0077B6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>
          <Bell size={52} style={{ margin: '0 auto 16px', opacity: 0.2 }}/>
          <p style={{ fontSize: '16px', fontWeight: 500 }}>No notifications yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              background: 'white', borderRadius: '14px', padding: '16px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB',
              borderLeft: `4px solid ${n.is_read ? '#E5E7EB' : '#0077B6'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: n.is_read ? 400 : 700, color: n.is_read ? '#6B7280' : '#023E8A', marginBottom: '4px' }}>
                  {n.title}
                </p>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px' }}>{n.message}</p>
                <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.is_read ? (
                <button onClick={() => markRead(n.id)} style={{
                  background: '#EFF6FF', color: '#0077B6', border: 'none',
                  padding: '6px 12px', borderRadius: '8px', fontSize: '12px',
                  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <CheckCircle size={13}/> Mark read
                </button>
              ) : (
                <CheckCircle size={16} style={{ color: '#9CA3AF', flexShrink: 0 }}/>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}