import { query } from '../db/pool.js'

export async function findUserByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
  return rows[0] || null
}

export async function createUser({ username, email, fullName, passwordHash, role = 'STUDENT' }) {
  const { rows } = await query(
    `INSERT INTO users (username, email, full_name, password_hash, role, auth_provider)
     VALUES ($1, $2, $3, $4, $5, 'local') RETURNING *`,
    [username, email.toLowerCase(), fullName, passwordHash, role],
  )
  return rows[0]
}

export async function setRefreshToken(userId, refreshToken) {
  await query('UPDATE users SET refresh_token = $2 WHERE id = $1', [userId, refreshToken])
}

export async function clearRefreshToken(userId) {
  await query('UPDATE users SET refresh_token = NULL WHERE id = $1', [userId])
}

export async function findUserById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id])
  return rows[0] || null
}

export async function deleteUser(userId) {
  const { rowCount } = await query('DELETE FROM users WHERE id = $1', [userId])
  return rowCount > 0
}
