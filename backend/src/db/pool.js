import pg from 'pg'
import { config } from '../config.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: config.databaseUrl,
  // Neon requires TLS in every environment, including local development.
  ssl: config.databaseUrl?.includes('neon.tech') || config.databaseUrl?.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
})

export async function query(text, params) {
  return pool.query(text, params)
}
