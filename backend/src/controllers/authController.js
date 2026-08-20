import bcrypt from 'bcryptjs'
import { clearRefreshToken, createUser, findUserByEmail, setRefreshToken } from '../models/userModel.js'
import { AppError } from '../utils/AppError.js'
import { userResponse } from '../utils/serializers.js'
import { createAccessToken, createRefreshToken } from '../utils/tokens.js'

function cleanUsername(value, email) {
  const proposed = (value || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_.-]/g, '')
  return proposed.slice(0, 80)
}

function sessionResponse(user, accessToken) {
  return { accessToken, token: accessToken, user: userResponse(user) }
}

export async function register(req, res) {
  const { email, password } = req.body || {}
  const fullName = String(req.body?.fullName || req.body?.name || '').trim()
  const username = cleanUsername(req.body?.username, String(email || ''))
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password || String(password).length < 6 || !fullName || !username) {
    throw new AppError(400, 'username, fullName, valid email, and a password of at least 6 characters are required.', 'VALIDATION_ERROR')
  }
  if (await findUserByEmail(email)) throw new AppError(409, 'An account with this email already exists.', 'EMAIL_IN_USE')
  const user = await createUser({ username, email, fullName, passwordHash: await bcrypt.hash(password, 12), role: 'STUDENT' })
  const refreshToken = createRefreshToken(user)
  await setRefreshToken(user.id, refreshToken)
  res.status(201).json(sessionResponse(user, createAccessToken(user)))
}

export async function login(req, res) {
  const { email, password } = req.body || {}
  if (!email || !password) throw new AppError(400, 'email and password are required.', 'VALIDATION_ERROR')
  const user = await findUserByEmail(email)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) throw new AppError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS')
  const refreshToken = createRefreshToken(user)
  await setRefreshToken(user.id, refreshToken)
  res.json(sessionResponse(user, createAccessToken(user)))
}

export async function me(req, res) {
  res.json({ user: userResponse(req.user) })
}

export async function logout(req, res) {
  await clearRefreshToken(req.user.id)
  res.status(204).send()
}
