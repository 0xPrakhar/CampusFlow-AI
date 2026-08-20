import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { query } from '../db/pool.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) throw new AppError(401, 'Authentication token is required.', 'UNAUTHENTICATED')
  let payload
  try { payload = jwt.verify(header.slice(7), config.accessTokenSecret) }
  catch { throw new AppError(401, 'Authentication token is invalid or expired.', 'UNAUTHENTICATED') }
  const { rows } = await query('SELECT id, username, email, full_name, role, auth_provider, created_at FROM users WHERE id = $1', [payload.sub])
  if (!rows[0]) throw new AppError(401, 'User account no longer exists.', 'UNAUTHENTICATED')
  req.user = rows[0]
  next()
})

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return next(new AppError(403, 'You do not have access to this resource.', 'FORBIDDEN'))
  next()
}

export const requireStudent = requireRole('STUDENT')
export const requireStaff = requireRole('STAFF')
