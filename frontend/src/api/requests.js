import api from './axios'
import { demoRequests, demoRunLogs } from '../data/demoData'

const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'
const storeKey = 'campusflow-demo-requests'

function getStore() {
  const saved = localStorage.getItem(storeKey)
  return saved ? JSON.parse(saved) : demoRequests
}

function saveStore(requests) { localStorage.setItem(storeKey, JSON.stringify(requests)) }
function delay(value, ms = 520) { return new Promise((resolve) => window.setTimeout(() => resolve(value), ms)) }

function analyse(text) {
  const lower = text.toLowerCase()
  const category = lower.includes('leave') ? 'LEAVE' : lower.includes('bonafide') || lower.includes('certificate') ? 'CERTIFICATE' : 'NOC'
  const priority = lower.includes('friday') || lower.includes('urgent') ? 'HIGH' : category === 'LEAVE' ? 'MEDIUM' : 'LOW'
  const deadline = lower.match(/friday|tomorrow|monday|today/i)?.[0] || 'Not specified'
  const title = category === 'NOC' ? 'Internship NOC' : category === 'LEAVE' ? 'Leave Request' : 'Bonafide Certificate'
  return { title, category, priority, deadline: deadline[0].toUpperCase() + deadline.slice(1), status: 'PENDING_APPROVAL', summary: category === 'NOC' ? 'Student requires an NOC for an internship.' : category === 'LEAVE' ? 'Student submitted a leave request.' : 'Student requires a bonafide certificate.', suggestedAction: category === 'NOC' ? 'Process NOC' : category === 'LEAVE' ? 'Review leave request' : 'Prepare certificate', missingInformation: [], aiUnderstanding: `CampusFlow identified this as a ${category.toLowerCase()} request${deadline !== 'Not specified' ? ` with a ${deadline} deadline` : ''}.` }
}

function unwrapRequest(data) { return data.request || data }
function unwrapRequests(data) { return Array.isArray(data) ? data : data.requests || [] }

export async function getRequests(role) {
  if (demoMode) return delay(getStore())
  const { data } = await api.get(role === 'STAFF' ? '/api/staff/requests' : '/api/requests/my')
  return unwrapRequests(data)
}

export async function getRequest(id, role) {
  if (demoMode) return delay(getStore().find((request) => request.id === id))
  const endpoint = role === 'STAFF' ? `/api/staff/requests/${id}` : `/api/requests/${id}`
  const { data } = await api.get(endpoint)
  return unwrapRequest(data)
}

export async function deleteRequest(id) {
  if (demoMode) {
    saveStore(getStore().filter((request) => request.id !== id))
    return
  }
  await api.delete(`/api/requests/${id}`)
}

export async function createRequest(payload) {
  if (!demoMode) {
    const { data } = await api.post('/api/requests', { text: payload.message || payload.text || payload.originalRequest })
    return unwrapRequest(data)
  }
  const requests = getStore()
  const analysis = analyse(payload.message || payload.originalRequest || '')
  const highestId = Math.max(...requests.map((request) => Number(request.id.replace('CF-', ''))))
  const created = { id: `CF-${highestId + 1}`, createdAt: 'Just now', originalRequest: payload.message || payload.originalRequest, student: payload.student || 'Demo Student', ...analysis }
  saveStore([created, ...requests])
  return delay(created, 1050)
}

export async function decideRequest(id, decision) {
  if (!demoMode) {
    const { data } = await api.patch(`/api/staff/requests/${id}/${decision}`)
    return unwrapRequest(data)
  }
  const status = decision === 'approve' ? 'COMPLETED' : 'REJECTED'
  const updated = getStore().map((request) => request.id === id ? { ...request, status } : request)
  saveStore(updated)
  return delay(updated.find((request) => request.id === id), 650)
}

export async function getRunLogs() {
  if (demoMode) return delay(demoRunLogs)
  const { data } = await api.get('/api/staff/run-logs')
  return (data.logs || []).map((log) => ({ ...log, time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), state: 'done' }))
}
