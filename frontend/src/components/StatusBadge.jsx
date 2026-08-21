const labels = {
  PENDING_APPROVAL: 'Pending approval',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  FAILED: 'Failed',
}

export default function StatusBadge({ status, subtle = false }) {
  const key = status || 'PENDING_APPROVAL'
  return <span className={`status-badge status-${key.toLowerCase()} ${subtle ? 'status-subtle' : ''}`}><i />{labels[key] || key.replaceAll('_', ' ')}</span>
}
