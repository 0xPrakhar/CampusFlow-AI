import { Check, CircleDot } from 'lucide-react'

const steps = ['Received', 'AI analysed', 'Notion task created', 'Human approval', 'Action', 'Completed']
const progress = { PENDING_APPROVAL: 2, APPROVED: 3, PROCESSING: 4, COMPLETED: 5, REJECTED: 3 }

export default function Timeline({ status = 'PENDING_APPROVAL', logs = false }) {
  const activeAt = progress[status] ?? 2
  const items = logs || steps
  return <div className={`timeline ${logs ? 'log-timeline' : ''}`}>{items.map((step, index) => {
    const state = logs ? step.state : index < activeAt ? 'done' : index === activeAt ? 'active' : 'waiting'
    return <div className={`timeline-item ${state}`} key={logs ? step.id : step}><span className="timeline-marker">{state === 'done' ? <Check size={13} /> : state === 'active' ? <CircleDot size={14} /> : ''}</span><div><strong>{logs ? step.message : step}</strong>{logs && <small>{step.requestId} · {step.time}</small>}{!logs && state === 'active' && <small>{status === 'REJECTED' ? 'Decision recorded' : 'Current step'}</small>}</div></div>
  })}</div>
}
