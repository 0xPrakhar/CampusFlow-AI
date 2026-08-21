export default function PriorityBadge({ priority }) {
  return <span className={`priority priority-${(priority || 'low').toLowerCase()}`}><i />{priority || 'LOW'}</span>
}
