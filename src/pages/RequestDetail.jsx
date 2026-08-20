import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bot, Check, CircleAlert, ClipboardCheck, LoaderCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { decideRequest, getRequest } from '../api/requests'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import Timeline from '../components/Timeline'

export default function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [working, setWorking] = useState('')
  const [error, setError] = useState('')
  const load = () => { setError(''); getRequest(id, 'STAFF').then((data) => { if (!data) setError('Request not found.'); else setRequest(data) }).catch(() => setError("CampusFlow couldn't load this request.")) }
  useEffect(() => { load() }, [id])
  const decision = async (choice) => { try { setWorking(choice); const updated = await decideRequest(id, choice); setRequest(updated); toast.success(choice === 'approve' ? 'Request approved' : 'Request rejected') } catch { toast.error('Unable to save your decision.') } finally { setWorking('') } }
  if (error) return <section className="error-panel"><CircleAlert size={24} /><h2>{error}</h2><button className="button button-primary" onClick={() => navigate('/requests')}>Back to requests</button></section>
  if (!request) return <div className="detail-loading"><LoaderCircle size={26} />Loading request…</div>
  const canDecide = request.status === 'PENDING_APPROVAL'
  return <><Link to="/requests" className="back-link"><ArrowLeft size={16} />All requests</Link><div className="detail-heading"><div><span className="eyebrow">REQUEST {request.id}</span><h1>{request.title}</h1><p>Submitted by {request.student || 'Student'} · {request.createdAt}</p></div><div className="detail-status"><PriorityBadge priority={request.priority} /><StatusBadge status={request.status} /></div></div><div className="detail-grid"><div className="detail-main"><section className="panel detail-section"><div className="section-label"><ClipboardCheck size={17} />ORIGINAL REQUEST</div><blockquote>“{request.originalRequest}”</blockquote></section><section className="panel detail-section ai-section"><div className="section-label"><Bot size={17} />AI UNDERSTANDING</div><p className="ai-summary">{request.summary}</p><div className="detail-fields"><div><span>Category</span><strong>{request.category}</strong></div><div><span>Priority</span><PriorityBadge priority={request.priority} /></div><div><span>Deadline</span><strong>{request.deadline}</strong></div><div><span>Suggested action</span><strong>{request.suggestedAction}</strong></div></div><div className="ai-note"><Bot size={17} /><p>{request.aiUnderstanding}</p></div>{request.missingInformation?.length ? <div className="missing-info"><CircleAlert size={18} /><div><strong>Missing information</strong><p>{request.missingInformation.join(' ')}</p></div></div> : <div className="complete-info"><Check size={17} />Required information detected</div>}</section><section className="panel detail-section"><div className="section-label">HUMAN DECISION</div>{canDecide ? <><p className="decision-copy">Review the AI recommendation, then approve or reject this workflow.</p><div className="decision-actions"><button className="button button-approve" onClick={() => decision('approve')} disabled={!!working}>{working === 'approve' ? 'Approving request...' : <><Check size={17} />Approve</>}</button><button className="button button-reject" onClick={() => decision('reject')} disabled={!!working}>{working === 'reject' ? 'Rejecting request...' : <><X size={17} />Reject</>}</button></div></> : <div className="decision-record"><Check size={18} /><div><strong>Decision recorded</strong><p>This request is {request.status.toLowerCase().replace('_', ' ')}.</p></div></div>}</section></div><aside className="detail-side"><section className="panel timeline-panel"><div className="section-label">WORKFLOW STATUS</div><Timeline status={request.status} /></section><section className="notion-card"><div><span className="online-dot" />Notion connected</div><p>Last synchronized just now</p></section></aside></div></>
}
