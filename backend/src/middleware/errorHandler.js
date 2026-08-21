export function notFound(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Endpoint not found.' } })
}

export function errorHandler(error, req, res, _next) {
  const status = error.statusCode || (error.code === '23505' ? 409 : 500)
  const message = error.code === '23505' ? 'A record with that value already exists.' : error.message || 'Internal server error.'
  if (status >= 500) console.error('[API] request failed', { status, code: error.code || 'INTERNAL_ERROR' })
  res.status(status).json({ error: { code: error.code || 'INTERNAL_ERROR', message } })
}
