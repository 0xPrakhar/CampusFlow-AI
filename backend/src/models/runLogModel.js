import { query } from '../db/pool.js'

export async function listRunLogs(requestId = null) {
  const values = requestId ? [requestId] : []
  const filter = requestId ? 'WHERE l.request_id = $1' : ''
  const { rows } = await query(
    `SELECT l.*, r.public_id FROM run_logs l JOIN requests r ON r.id = l.request_id ${filter} ORDER BY l.created_at DESC`,
    values,
  )
  return rows
}
