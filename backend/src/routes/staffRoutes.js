import { Router } from 'express'
import { approveRequest, getAllRunLogs, getRequestById, getRequestLogs, listRequests, rejectRequest } from '../controllers/staffController.js'
import { authenticate, requireStaff } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(authenticate, requireStaff)
router.get('/requests', asyncHandler(listRequests))
router.get('/requests/:id', asyncHandler(getRequestById))
router.get('/requests/:id/logs', asyncHandler(getRequestLogs))
router.patch('/requests/:id/approve', asyncHandler(approveRequest))
router.patch('/requests/:id/reject', asyncHandler(rejectRequest))
router.get('/run-logs', asyncHandler(getAllRunLogs))

export default router
