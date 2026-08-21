import { Router } from 'express'
import { deleteAccount, login, logout, me, register } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))
router.get('/me', authenticate, asyncHandler(me))
router.post('/logout', authenticate, asyncHandler(logout))
router.delete('/account', authenticate, asyncHandler(deleteAccount))

export default router
