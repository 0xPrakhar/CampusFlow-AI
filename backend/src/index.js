import express from 'express'
import cors from 'cors'
import { assertConfig, config } from './config.js'
import { pool } from './db/pool.js'
import authRoutes from './routes/authRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import staffRoutes from './routes/staffRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { authenticate, requireStaff } from './middleware/auth.js'
import { getAllRunLogs } from './controllers/staffController.js'
import { asyncHandler } from './utils/asyncHandler.js'

assertConfig()

const app = express()
app.use(cors({ origin: config.clientOrigin }))
app.use(express.json({ limit: '32kb' }))

app.get('/health', async (req, res) => {
  await pool.query('SELECT 1')
  res.json({ status: 'ok' })
})
app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/staff', staffRoutes)
app.get('/api/run-logs', authenticate, requireStaff, asyncHandler(getAllRunLogs))

app.use(notFound)
app.use(errorHandler)

app.listen(config.port, () => console.log(`CampusFlow API listening on http://localhost:${config.port}`))
