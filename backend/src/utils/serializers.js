function titleForCategory(category) {
  if (category === 'NOC') return 'Internship NOC'
  if (category === 'LEAVE') return 'Leave Request'
  if (category === 'CERTIFICATE') return 'Bonafide Certificate'
  return 'Campus Request'
}

export function userResponse(user) {
  return { id: user.id, username: user.username, email: user.email, name: user.full_name, fullName: user.full_name, role: user.role, authProvider: user.auth_provider, createdAt: user.created_at }
}

export function requestResponse(row) {
  if (!row) return null
  const category = row.category || 'GENERAL_REQUEST'
  return {
    id: row.public_id || `CF-${1000 + row.id}`,
    internalId: row.id,
    title: titleForCategory(category),
    studentId: row.student_id,
    student: row.student_name,
    rawText: row.raw_text,
    originalRequest: row.raw_text,
    category,
    priority: row.priority,
    summary: row.summary,
    deadline: row.deadline,
    missingInformation: row.missing_information || [],
    suggestedAction: row.suggested_action,
    aiUnderstanding: `CampusFlow identified this as a ${category.toLowerCase().replace('_', ' ')} request${row.deadline ? ` with a ${row.deadline} deadline` : ''}.`,
    status: row.status,
    notionPageId: row.notion_page_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function runLogResponse(row) {
  return { id: row.id, requestId: row.public_id, event: row.event, message: row.message, createdAt: row.created_at }
}
