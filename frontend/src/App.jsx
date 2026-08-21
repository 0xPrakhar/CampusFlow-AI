import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Requests from './pages/Requests'
import RequestDetail from './pages/RequestDetail'
import RunLogs from './pages/RunLogs'
import StudentDashboard from './pages/StudentDashboard'
import StudentRequests from './pages/StudentRequests'
import StudentRequestDetail from './pages/StudentRequestDetail'
import Landing from './pages/Landing'

function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function RoleRoute({ role }) {
  const { user } = useAuth()
  const destination = user?.role === 'STUDENT' ? '/student/dashboard' : '/dashboard'
  return user?.role === role ? <Outlet /> : <Navigate to={destination} replace />
}

function RoleHome() {
  const { user } = useAuth()
  return <Navigate to={user?.role === 'STUDENT' ? '/student/dashboard' : '/dashboard'} replace />
}

function PublicHome() {
  const { user } = useAuth()
  return user ? <RoleHome /> : <Landing />
}

function WorkspaceLayout() {
  return <AppShell><Outlet /></AppShell>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<WorkspaceLayout />}>
          <Route element={<RoleRoute role="STAFF" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/run-logs" element={<RunLogs />} />
          </Route>
          <Route element={<RoleRoute role="STUDENT" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/requests" element={<StudentRequests />} />
            <Route path="/student/requests/:id" element={<StudentRequestDetail />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PublicHome />} />
    </Routes>
  )
}
