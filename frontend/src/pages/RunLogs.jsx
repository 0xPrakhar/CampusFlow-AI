import { useEffect, useState } from 'react'
import { CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react'
import { getRunLogs } from '../api/requests'
import Timeline from '../components/Timeline'

export default function RunLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const refresh = () => { setLoading(true); getRunLogs().then(setLogs).finally(() => setLoading(false)) }
  useEffect(() => { refresh() }, [])
  return <><div className="page-heading"><div><span className="eyebrow">TRANSPARENT AUTOMATION</span><h1>Run logs</h1><p>A complete record of everything CampusFlow does.</p></div><button className="button button-secondary" onClick={refresh}><RefreshCw size={16} />Refresh</button></div><section className="log-intro"><ShieldCheck size={21} /><div><strong>Nothing happens invisibly.</strong><p>Every automated step is available for review.</p></div></section><section className="panel logs-panel"><div className="panel-heading"><div><h2>Latest workflow activity</h2><p>Live audit trail across your operations.</p></div><span className="log-count"><CheckCircle2 size={16} />{logs.length} events</span></div>{loading ? <div className="table-loading">Loading run logs…</div> : <Timeline logs={logs} />}</section></>
}
