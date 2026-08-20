import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { assertConfig } from '../src/config.js'
import { pool } from '../src/db/pool.js'
import { createUser, findUserByEmail } from '../src/models/userModel.js'

assertConfig()

const email = process.env.STAFF_EMAIL
const password = process.env.STAFF_PASSWORD
const fullName = process.env.STAFF_FULL_NAME || 'Campus Admin'
const username = process.env.STAFF_USERNAME || 'campusadmin'

if (!email || !password) throw new Error('STAFF_EMAIL and STAFF_PASSWORD are required to seed staff.')

try {
  if (await findUserByEmail(email)) {
    console.log(`Staff account already exists for ${email}.`)
  } else {
    await createUser({ username, email, fullName, passwordHash: await bcrypt.hash(password, 12), role: 'STAFF' })
    console.log(`Staff account created for ${email}.`)
  }
} finally {
  await pool.end()
}
