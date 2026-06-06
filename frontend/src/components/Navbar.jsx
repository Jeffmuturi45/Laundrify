import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, Menu, X, LogOut, User, Package, MapPin, CreditCard } from 'lucide-react'

export default function Navbar() {
  const { user, driver, role, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const name = role === 'customer' ? user?.full_name
             : role === 'driver'   ? driver?.full_name
             : 'Admin'

  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const links = {
    customer: [
      { to: '/dashboard',     label: 'Dashboard',     icon: <Package size={15}/> },
      { to: '/orders',        label: 'My Orders',     icon: <Package size={15}/> },
      { to: '/addresses',     label: 'Addresses',     icon: <MapPin size={15}/> },
      { to: '/profile',       label: 'Profile',       icon: <User size={15}/> },
      { to: '/notifications', label: 'Notifications', icon: <Bell size={15}/> },
    ],
    driver: [
      { to: '/driver/dashboard',     label: 'Dashboard',     icon: <Package size={15}/> },
      { to: '/driver/orders',        label: 'My Orders',     icon: <Package size={15}/> },
      { to: '/driver/profile',       label: 'Profile',       icon: <User size={15}/> },
      { to: '/driver/notifications', label: 'Notifications', icon: <Bell size={15}/> },
    ],
  }

  const activeLinks = links[role] || []
  const isActive = (path) => location.pathname === path

  return (
    <nav style={{ background: '#0077B6', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🧺
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>
              Laundrify
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
            {activeLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '14px', fontWeight: 500,
                color: isActive(link.to) ? '#0077B6' : 'rgba(255,255,255,0.9)',
                background: isActive(link.to) ? 'white' : 'transparent',
                transition: 'all 0.15s',
              }}>
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden-mobile">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '6px 12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#023E8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                {initials}
              </div>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{name?.split(' ')[0]}</span>
            </div>
            <button onClick={logout} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'white', color: '#0077B6', border: 'none',
              padding: '7px 14px', borderRadius: '8px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <LogOut size={14}/> Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'none' }} className="show-mobile">
            {open ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#023E8A', padding: '12px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {activeLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 0', textDecoration: 'none', fontSize: '14px',
              color: isActive(link.to) ? '#90E0EF' : 'rgba(255,255,255,0.85)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              fontWeight: isActive(link.to) ? 600 : 400,
            }}>
              {link.icon} {link.label}
            </Link>
          ))}
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px',
            background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '14px',
          }}>
            <LogOut size={14}/> Logout
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}