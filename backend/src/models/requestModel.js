import { query } from '../db/pool.js'

const baseSelect = `
  SELECT r.*, u.full_name AS student_name, u.email AS student_email
  FROM requests r
  JOIN users u ON u.id = r.student_id
`

export async function createDraftRequest(studentId, rawText) {
  const { rows } = await query(
    `INSERT INTO requests (student_id, raw_text, status)
     VALUES ($1, $2, 'FAILED') RETURNING *`,
    [studentId, rawText],
  )
  const created = rows[0]
  const publicId = `CF-${1000 + Number(created.id)}`
  await query('UPDATE requests SET public_id = $1 WHERE id = $2', [publicId, created.id])
  return findRequestByReference(publicId)
}

export async function updateRequestAnalysis(requestId, analysis) {
  await query(
    `UPDATE requests
     SET category = $2, priority = $3, summary = $4, deadline = $5,
         missing_information = $6::jsonb, suggested_action = $7, status = 'PENDING_APPROVAL'
     WHERE id = $1`,
    [requestId, analysis.category, analysis.priority, analysis.summary, analysis.deadline, JSON.stringify(analysis.missingInformation), analysis.suggestedAction],
  )
  return findRequestByReference(String(requestId))
}

export async function setNotionPageId(requestId, pageId) {
  await query('UPDATE requests SET notion_page_id = $2 WHERE id = $1', [requestId, pageId])
  return findRequestByReference(String(requestId))
}

export async function updateRequestStatus(requestId, status) {
  await query('UPDATE requests SET status = $2 WHERE id = $1', [requestId, status])
  return findRequestByReference(String(requestId))
}

export async function findRequestByReference(reference) {
  const { rows } = await query(`${baseSelect} WHERE r.public_id = $1 OR CAST(r.id AS TEXT) = $1`, [reference])
  return rows[0] || null
}

export async function listStudentRequests(studentId) {
  const { rows } = await query(`${baseSelect} WHERE r.student_id = $1 ORDER BY r.created_at DESC`, [studentId])
  return rows
}

export async function deleteRequest(requestId) {
  const { rowCount } = await query('DELETE FROM requests WHERE id = $1', [requestId])
  return rowCount > 0
}

export async function listAllRequests() {
  const { rows } = await query(`${baseSelect} ORDER BY CASE r.status WHEN 'PENDING_APPROVAL' THEN 0 ELSE 1 END, r.created_at DESC`)
  return rows
}
