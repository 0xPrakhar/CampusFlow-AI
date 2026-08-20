import { query } from '../db/pool.js'

export async function logEvent(requestId, event, message) {
  await query('INSERT INTO run_logs (request_id, event, message) VALUES ($1, $2, $3)', [requestId, event, message])
}
