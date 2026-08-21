import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ClipboardList, Clock3, Plus } from 'lucide-react'
import { getRequests } from '../api/requests'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import RequestTable from '../components/RequestTable'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getRequests('STUDENT').then((data) => setRequests(data.filter((request) => request.student === user.name))).finally(() => setLoading(false)) }, [user.name])
  const count = (status) => requests.filter((request) => request.status === status).length
  return <><div className="page-heading student-heading"><div><span className="eyebrow">STUDENT PORTAL</span><h1>Hi, {user.name.split(' ')[0]} <span>👋</span></h1><p>Submit requests and see exactly where they are in the process.</p></div><Link className="button button-primary" to="/student/requests?new=1"><Plus size={17} />Submit request</Link></div><section className="student-hero"><div><span className="eyebrow">CAMPUSFLOW FOR STUDENTS</span><h2>Your request, clearly tracked.</h2><p>Send a request in your own words. CampusFlow AI organises it and keeps you updated while the college team reviews it.</p><Link to="/student/requests?new=1" className="button button-primary">Start a request</Link></div><div className="student-hero-flow"><span>Describe it</span><i /><span>AI organises it</span><i /><span>Track progress</span></div></section><section className="stat-grid student-stats"><StatCard label="My requests" value={loading ? '—' : requests.length} icon={ClipboardList} tone="blue" hint="All requests" /><StatCard label="Awaiting review" value={loading ? '—' : count('PENDING_APPROVAL')} icon={Clock3} tone="amber" hint="With admin" /><StatCard label="Completed" value={loading ? '—' : count('COMPLETED')} icon={CheckCircle2} tone="green" hint="Ready for you" /></section><section className="panel recent-panel"><div className="panel-heading"><div><h2>My recent requests</h2><p>Latest updates from the college operations team.</p></div><Link to="/student/requests" className="text-link">View all</Link></div>{loading ? <div className="table-loading">Loading your requests…</div> : <RequestTable requests={requests.slice(0, 4)} compact detailsBase="/student/requests" />}</section></>
}
