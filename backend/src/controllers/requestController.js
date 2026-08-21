import { findRequestByReference, createDraftRequest, deleteRequest, listStudentRequests, setNotionPageId, updateRequestAnalysis } from '../models/requestModel.js'
import { listRunLogs } from '../models/runLogModel.js'
import { analyseRequest } from '../services/aiService.js'
import { logEvent } from '../services/logService.js'
import { archiveNotionRequest, createNotionRequest } from '../services/notionService.js'
import { AppError } from '../utils/AppError.js'
import { requestResponse, runLogResponse } from '../utils/serializers.js'

async function syncNewRequestToNotion(request) {
  try {
    const sync = await createNotionRequest(requestResponse(request))
    if (sync.skipped) {
      await logEvent(request.id, 'NOTION_SYNC_SKIPPED', 'Notion sync is disabled for this environment.')
      return request
    }
    await logEvent(request.id, 'NOTION_CREATED', 'Notion page created for staff review.')
    return setNotionPageId(request.id, sync.pageId)
  } catch (error) {
    await logEvent(request.id, 'NOTION_FAILED', `Notion page could not be created: ${error.message}`)
    return request
  }
}

export async function createRequest(req, res) {
  const rawText = String(req.body?.text || '').trim()
  if (!rawText || rawText.length > 4000) throw new AppError(400, 'text is required and must be at most 4000 characters.', 'VALIDATION_ERROR')

  let request = await createDraftRequest(req.user.id, rawText)
  await logEvent(request.id, 'REQUEST_CREATED', 'Student request received.')
  await logEvent(request.id, 'AI_ANALYSIS_STARTED', 'AI analysis started. Human approval will still be required.')

  try {
    const analysis = await analyseRequest(rawText)
    request = await updateRequestAnalysis(request.id, analysis)
    await logEvent(request.id, 'AI_ANALYSIS_COMPLETED', 'AI analysis completed and validated.')
  } catch (error) {
    await logEvent(request.id, 'AI_ANALYSIS_FAILED', `AI analysis failed: ${error.message}`)
    throw error
  }

  request = await syncNewRequestToNotion(request)
  await logEvent(request.id, 'APPROVAL_PENDING', 'Request is waiting for staff approval.')
  res.status(201).json({ request: requestResponse(request) })
}

export async function getMyRequests(req, res) {
  const requests = await listStudentRequests(req.user.id)
  res.json({ requests: requests.map(requestResponse) })
}

export async function getMyRequestById(req, res) {
  const request = await findRequestByReference(req.params.id)
  if (!request) throw new AppError(404, 'Request not found.', 'NOT_FOUND')
  if (request.student_id !== req.user.id) throw new AppError(403, 'You can only view your own requests.', 'FORBIDDEN')
  res.json({ request: requestResponse(request) })
}

export async function getMyRequestLogs(req, res) {
  const request = await findRequestByReference(req.params.id)
  if (!request) throw new AppError(404, 'Request not found.', 'NOT_FOUND')
  if (request.student_id !== req.user.id) throw new AppError(403, 'You can only view your own requests.', 'FORBIDDEN')
  const logs = await listRunLogs(request.id)
  res.json({ logs: logs.map(runLogResponse) })
}

export async function deleteMyRequest(req, res) {
  const request = await findRequestByReference(req.params.id)
  if (!request) throw new AppError(404, 'Request not found.', 'NOT_FOUND')
  if (request.student_id !== req.user.id) throw new AppError(403, 'You can only delete your own requests.', 'FORBIDDEN')
  try {
    await archiveNotionRequest(request.notion_page_id)
  } catch {
    // Local deletion remains available if the external Notion page is already gone.
  }
  await deleteRequest(request.id)
  res.status(204).send()
}
