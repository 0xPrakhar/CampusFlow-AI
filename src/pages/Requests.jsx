import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { getRequests } from '../api/requests'
import RequestTable from '../components/RequestTable'

const filters = [['ALL', 'All'], ['PENDING_APPROVAL', 'Pending'], ['APPROVED', 'Approved'], ['COMPLETED', 'Completed'], ['REJECTED', 'Rejected'], ['FAILED', 'Failed']]

export default function Requests() {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const refresh = () => getRequests('STAFF').then(setRequests).finally(() => setLoading(false))
  useEffect(() => { refresh() }, [])
  const visible = useMemo(() => requests.filter((request) => (filter === 'ALL' || request.status === filter) && `${request.title} ${request.category} ${request.id}`.toLowerCase().includes(search.toLowerCase())), [requests, filter, search])
  return <><div className="page-heading"><div><span className="eyebrow">REQUEST INBOX</span><h1>Requests</h1><p>Review student requests and approve safe workflows.</p></div></div><section className="panel requests-panel"><div className="request-tools"><div className="filter-tabs">{filters.map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={filter === value ? 'selected' : ''}>{label}</button>)}</div><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests..." /></label><button className="filter-icon" aria-label="More filters"><SlidersHorizontal size={17} /></button></div>{loading ? <div className="table-loading">Loading requests…</div> : <RequestTable requests={visible} />}</section></>
}
