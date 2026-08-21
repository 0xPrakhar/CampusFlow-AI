export default function Brand({ light = false }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <span className="brand-mark"><i></i><i></i><i></i></span>
      <span>CampusFlow <b>AI</b></span>
    </div>
  )
}
