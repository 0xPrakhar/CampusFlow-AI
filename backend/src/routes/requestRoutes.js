import { Router } from 'express'
import { createRequest, getMyRequestById, getMyRequestLogs, getMyRequests } from '../controllers/requestController.js'
import { authenticate, requireStudent } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(authenticate, requireStudent)
router.post('/', asyncHandler(createRequest))
router.get('/my', asyncHandler(getMyRequests))
router.get('/:id/logs', asyncHandler(getMyRequestLogs))
router.get('/:id', asyncHandler(getMyRequestById))

export default router
