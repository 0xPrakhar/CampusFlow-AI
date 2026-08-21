import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getRequests } from '../api/requests'
import { useAuth } from '../context/AuthContext'
import RequestComposer from '../components/RequestComposer'
import RequestTable from '../components/RequestTable'

export default function StudentRequests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [composer, setComposer] = useState(params.get('new') === '1')
  const refresh = () => getRequests('STUDENT').then((data) => setRequests(data.filter((request) => request.student === user.name))).finally(() => setLoading(false))
  useEffect(() => { refresh() }, [user.name])
  useEffect(() => { setComposer(params.get('new') === '1') }, [params])
  const visible = useMemo(() => requests.filter((request) => `${request.title} ${request.category} ${request.status}`.toLowerCase().includes(search.toLowerCase())), [requests, search])
  const closeComposer = () => { setComposer(false); navigate('/student/requests') }
  return <><div className="page-heading"><div><span className="eyebrow">STUDENT PORTAL</span><h1>My requests</h1><p>Submit a request, then follow every step from review to completion.</p></div><button className="button button-primary" onClick={() => composer ? closeComposer() : navigate('/student/requests?new=1')}>{composer ? <X size={17} /> : <Plus size={17} />}{composer ? 'Close request form' : 'Submit request'}</button></div>{composer && <RequestComposer student={user.name} onCreated={refresh} onClose={(id) => navigate(`/student/requests/${id}`)} />}<section className="panel requests-panel"><div className="student-request-tools"><div><h2>Request history</h2><p>Only your own requests are visible here.</p></div><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search my requests..." /></label></div>{loading ? <div className="table-loading">Loading your requests…</div> : <RequestTable requests={visible} detailsBase="/student/requests" />}</section></>
}
