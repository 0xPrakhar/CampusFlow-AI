import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export function createAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiresIn })
}

export function createRefreshToken(user) {
  return jwt.sign({ sub: user.id }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiresIn })
}
