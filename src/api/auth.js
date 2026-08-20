import api from './axios'

const demoMode = import.meta.env.VITE_DEMO_MODE !== 'false'

const createDemoSession = (email, role) => ({
  token: 'campusflow-demo-token',
  user: {
    name: role === 'STUDENT' ? 'Demo Student' : 'Admin',
    email: email || (role === 'STUDENT' ? 'student@campusflow.ai' : 'admin@campusflow.ai'),
    role: role || 'STAFF',
  },
})

export async function login(credentials) {
  if (demoMode) return createDemoSession(credentials.email, credentials.role)
  const { data } = await api.post('/api/auth/login', credentials)
  return data
}

export async function register(details) {
  if (demoMode) return createDemoSession(details.email, 'STUDENT')
  const { data } = await api.post('/api/auth/register', details)
  return data
}
