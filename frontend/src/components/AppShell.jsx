import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, ClipboardList, LayoutDashboard, LogOut, Menu, PanelLeftClose, Send, Trash2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Brand from './Brand'

const adminNavItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/requests', label: 'Requests', icon: ClipboardList },
  { to: '/run-logs', label: 'Run logs', icon: PanelLeftClose },
]

const studentNavItems = [
  { to: '/student/dashboard', label: 'My overview', icon: LayoutDashboard },
  { to: '/student/requests', label: 'My requests', icon: ClipboardList },
  { to: '/student/requests?new=1', label: 'Submit request', icon: Send },
]

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false)
  const { user, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const isStudent = user?.role === 'STUDENT'
  const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  const navItems = isStudent ? studentNavItems : adminNavItems
  const leave = () => { logout(); navigate('/login') }
  const removeAccount = async () => {
    if (!window.confirm('Delete your account and all of its requests permanently?')) return
    try {
      await deleteAccount()
      navigate('/login')
    } catch {
      window.alert('Account deletion failed. Please try again.')
    }
  }

  return (
    <div className="app-shell">
      <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
      {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top"><Brand light /><button className="close-menu" onClick={() => setOpen(false)}><X size={20} /></button></div>
        <div className="workspace-label">{isStudent ? 'STUDENT PORTAL' : 'WORKSPACE'}</div>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => <NavLink key={label} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} />{label}</NavLink>)}
        </nav>
        <div className="sidebar-footer">
          <div className="notion-state"><span className="online-dot" />{isStudent ? 'Request tracking active' : 'Workflow sync active'}</div>
          <div className="profile-row"><div className="avatar">{(user?.name || 'A').slice(0, 1)}</div><div><strong>{user?.name || 'Admin'}</strong><span>{isStudent ? 'Student' : 'Operations staff'}</span></div><button onClick={leave} aria-label="Sign out"><LogOut size={16} /></button></div>
          {isStudent && <button className="account-delete" onClick={removeAccount}><Trash2 size={14} />Delete account</button>}
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="topbar-spacer" /><div className="topbar-actions"><span className="demo-pill">{demoMode ? 'DEMO MODE' : 'API CONNECTED'}</span><button className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button><div className="user-chip"><span className="avatar avatar-small">{(user?.name || 'A').slice(0, 1)}</span><span>{user?.name || 'Admin'}</span><ChevronDown size={15} /></div></div></header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}
