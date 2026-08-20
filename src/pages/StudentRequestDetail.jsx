import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bot, Check, CircleAlert, ClipboardCheck, LoaderCircle } from 'lucide-react'
import { getRequest } from '../api/requests'
import { useAuth } from '../context/AuthContext'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import Timeline from '../components/Timeline'

export default function StudentRequestDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { getRequest(id, 'STUDENT').then((data) => { if (!data || (import.meta.env.VITE_DEMO_MODE !== 'false' && data.student !== user.name)) setError('This request is not available.'); else setRequest(data) }).catch(() => setError("CampusFlow couldn't load this request.")) }, [id, user.name])
  if (error) return <section className="error-panel"><CircleAlert size={24} /><h2>{error}</h2><Link className="button button-primary" to="/student/requests">Back to my requests</Link></section>
  if (!request) return <div className="detail-loading"><LoaderCircle size={26} />Loading your request…</div>
  return <><Link to="/student/requests" className="back-link"><ArrowLeft size={16} />My requests</Link><div className="detail-heading"><div><span className="eyebrow">REQUEST {request.id}</span><h1>{request.title}</h1><p>Submitted {request.createdAt}</p></div><div className="detail-status"><PriorityBadge priority={request.priority} /><StatusBadge status={request.status} /></div></div><div className="detail-grid"><div className="detail-main"><section className="panel detail-section"><div className="section-label"><ClipboardCheck size={17} />YOUR REQUEST</div><blockquote>“{request.originalRequest}”</blockquote></section><section className="panel detail-section ai-section"><div className="section-label"><Bot size={17} />HOW CAMPUSFLOW UNDERSTOOD IT</div><p className="ai-summary">{request.summary}</p><div className="detail-fields"><div><span>Category</span><strong>{request.category}</strong></div><div><span>Priority</span><PriorityBadge priority={request.priority} /></div><div><span>Deadline</span><strong>{request.deadline}</strong></div><div><span>Next step</span><strong>{request.suggestedAction}</strong></div></div><div className="ai-note"><Bot size={17} /><p>{request.aiUnderstanding}</p></div>{request.missingInformation?.length ? <div className="missing-info"><CircleAlert size={18} /><div><strong>More information may be needed</strong><p>{request.missingInformation.join(' ')}</p></div></div> : <div className="complete-info"><Check size={17} />Your request has all the required information</div>}</section></div><aside className="detail-side"><section className="panel timeline-panel"><div className="section-label">REQUEST STATUS</div><Timeline status={request.status} /></section><section className="student-help"><strong>Need to make a change?</strong><p>Contact your college operations team with your request number.</p></section></aside></div></>
}
