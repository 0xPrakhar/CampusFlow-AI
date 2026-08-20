import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'

export default function RequestTable({ requests, compact = false, detailsBase = '/requests' }) {
  if (!requests.length) return <div className="empty-state">No requests match this view.</div>
  return (
    <div className={`request-table-wrap ${compact ? 'compact-table' : ''}`}>
      <table className="request-table">
        <thead><tr><th>Request</th><th>Category</th><th>Priority</th><th>Deadline</th><th>Status</th>{!compact && <th>Created</th>}<th></th></tr></thead>
        <tbody>{requests.map((request) => <tr key={request.id}>
          <td><Link className="request-title" to={`${detailsBase}/${request.id}`}><strong>{request.title}</strong><span>{request.id} · {request.student}</span></Link></td>
          <td><span className="category-tag">{request.category}</span></td>
          <td><PriorityBadge priority={request.priority} /></td>
          <td><span className="deadline"><CalendarDays size={14} />{request.deadline}</span></td>
          <td><StatusBadge status={request.status} /></td>
          {!compact && <td className="muted-cell">{request.createdAt}</td>}
          <td><Link aria-label={`View ${request.title}`} className="row-arrow" to={`${detailsBase}/${request.id}`}><ArrowUpRight size={17} /></Link></td>
        </tr>)}</tbody>
      </table>
    </div>
  )
}
