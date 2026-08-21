export default function StatCard({ label, value, icon: Icon, tone = 'blue', hint }) {
  return <article className="stat-card"><div className={`stat-icon stat-${tone}`}><Icon size={19} strokeWidth={2} /></div><div><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div></article>
}
