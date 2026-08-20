import { findRequestByReference, listAllRequests, updateRequestStatus } from '../models/requestModel.js'
import { listRunLogs } from '../models/runLogModel.js'
import { executeRequestAction } from '../services/actionService.js'
import { logEvent } from '../services/logService.js'
import { updateNotionRequest } from '../services/notionService.js'
import { AppError } from '../utils/AppError.js'
import { requestResponse, runLogResponse } from '../utils/serializers.js'

async function syncStatusToNotion(request) {
  try {
    const sync = await updateNotionRequest(requestResponse(request))
    if (!sync.skipped) await logEvent(request.id, 'NOTION_UPDATED', `Notion status updated to ${request.status}.`)
  } catch (error) {
    await logEvent(request.id, 'NOTION_UPDATE_FAILED', `Notion status could not be updated: ${error.message}`)
  }
}

async function loadPendingRequest(reference) {
  const request = await findRequestByReference(reference)
  if (!request) throw new AppError(404, 'Request not found.', 'NOT_FOUND')
  if (request.status !== 'PENDING_APPROVAL') throw new AppError(409, `Request cannot be decided while status is ${request.status}.`, 'INVALID_STATUS')
  return request
}

export async function listRequests(req, res) {
  const requests = await listAllRequests()
  res.json({ requests: requests.map(requestResponse) })
}

export async function getRequestById(req, res) {
  const request = await findRequestByReference(req.params.id)
  if (!request) throw new AppError(404, 'Request not found.', 'NOT_FOUND')
  res.json({ request: requestResponse(request) })
}

export async function approveRequest(req, res) {
  let request = await loadPendingRequest(req.params.id)
  request = await updateRequestStatus(request.id, 'APPROVED')
  await logEvent(request.id, 'REQUEST_APPROVED', `Approved by staff member ${req.user.email}.`)
  await syncStatusToNotion(request)

  try {
    await logEvent(request.id, 'ACTION_STARTED', 'Safe predefined action started after human approval.')
    const action = await executeRequestAction(request)
    request = await updateRequestStatus(request.id, 'COMPLETED')
    await logEvent(request.id, 'ACTION_COMPLETED', action.message)
    await logEvent(request.id, 'REQUEST_COMPLETED', 'Request workflow completed.')
    await syncStatusToNotion(request)
    res.json({ request: requestResponse(request), action })
  } catch (error) {
    request = await updateRequestStatus(request.id, 'FAILED')
    await logEvent(request.id, 'ACTION_FAILED', `Safe action failed: ${error.message}`)
    await syncStatusToNotion(request)
    throw new AppError(500, 'The approved action failed. Request marked as FAILED.', 'ACTION_FAILED')
  }
}

export async function rejectRequest(req, res) {
  let request = await loadPendingRequest(req.params.id)
  request = await updateRequestStatus(request.id, 'REJECTED')
  await logEvent(request.id, 'REQUEST_REJECTED', `Rejected by staff member ${req.user.email}.`)
  await syncStatusToNotion(request)
  res.json({ request: requestResponse(request) })
}

export async function getRequestLogs(req, res) {
  const request = await findRequestByReference(req.params.id)
  if (!request) throw new AppError(404, 'Request not found.', 'NOT_FOUND')
  const logs = await listRunLogs(request.id)
  res.json({ logs: logs.map(runLogResponse) })
}

export async function getAllRunLogs(req, res) {
  const logs = await listRunLogs()
  res.json({ logs: logs.map(runLogResponse) })
}
