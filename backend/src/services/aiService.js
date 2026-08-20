import { config } from '../config.js'
import { AppError } from '../utils/AppError.js'

const VALID_CATEGORIES = new Set(['NOC', 'LEAVE', 'CERTIFICATE', 'GENERAL_REQUEST'])
const VALID_PRIORITIES = new Set(['LOW', 'MEDIUM', 'HIGH'])

function mockAnalysis(text) {
  const normalized = text.toLowerCase()
  const category = /noc|internship/.test(normalized) ? 'NOC' : /leave|chutti|absence/.test(normalized) ? 'LEAVE' : /bonafide|certificate/.test(normalized) ? 'CERTIFICATE' : 'GENERAL_REQUEST'
  const priority = /urgent|asap|today|friday/.test(normalized) ? 'HIGH' : category === 'LEAVE' ? 'MEDIUM' : 'LOW'
  const deadlineMatch = text.match(/today|tomorrow|friday|monday|tuesday|wednesday|thursday|saturday|sunday|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?/i)
  const deadline = deadlineMatch ? deadlineMatch[0] : 'Not specified'
  const descriptions = {
    NOC: 'Student requires an NOC for an internship.',
    LEAVE: 'Student submitted a leave request.',
    CERTIFICATE: 'Student requires a bonafide certificate.',
    GENERAL_REQUEST: 'Student submitted a college operations request.',
  }
  const actions = { NOC: 'Process NOC', LEAVE: 'Review leave request', CERTIFICATE: 'Prepare certificate', GENERAL_REQUEST: 'Review request manually' }
  return { category, priority, summary: descriptions[category], deadline, missingInformation: [], suggestedAction: actions[category] }
}

function parseJson(content) {
  if (typeof content === 'object' && content) return content
  const clean = String(content || '').trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim()
  return JSON.parse(clean)
}

export function validateAiAnalysis(value) {
  if (!value || typeof value !== 'object') throw new AppError(422, 'AI returned an invalid analysis.', 'AI_INVALID_RESPONSE')
  const category = String(value.category || '').trim().toUpperCase().replace(/\s+/g, '_')
  const priority = String(value.priority || '').trim().toUpperCase()
  const summary = String(value.summary || '').trim()
  const deadline = String(value.deadline || '').trim()
  const suggestedAction = String(value.suggestedAction || '').trim()
  const missingInformation = Array.isArray(value.missingInformation) ? value.missingInformation.map((item) => String(item).trim()).filter(Boolean) : null
  if (!VALID_CATEGORIES.has(category) || !VALID_PRIORITIES.has(priority) || !summary || summary.length > 500 || !deadline || deadline.length > 120 || !suggestedAction || suggestedAction.length > 250 || !missingInformation || missingInformation.some((item) => item.length > 250)) {
    throw new AppError(422, 'AI returned an invalid analysis.', 'AI_INVALID_RESPONSE')
  }
  return { category, priority, summary, deadline, missingInformation, suggestedAction }
}

export async function analyseRequest(rawText) {
  if (config.aiMode === 'mock') return validateAiAnalysis(mockAnalysis(rawText))
  if (config.aiMode !== 'live') throw new AppError(500, 'AI_MODE must be mock or live.', 'AI_CONFIGURATION_ERROR')
  if (!config.aiApiKey) throw new AppError(500, 'AI_API_KEY is required when AI_MODE=live.', 'AI_CONFIGURATION_ERROR')

  const prompt = `Analyse this student college operations request. Return JSON only, with exactly: category (NOC, LEAVE, CERTIFICATE, or GENERAL_REQUEST), priority (LOW, MEDIUM, HIGH), summary, deadline, missingInformation (array), suggestedAction. Never approve or execute the request. Student request: ${rawText}`
  const response = await fetch(`${config.aiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.aiApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: config.aiModel, temperature: 0.1, messages: [{ role: 'system', content: 'You are a strict JSON analysis service. Return no markdown.' }, { role: 'user', content: prompt }] }),
  })
  if (!response.ok) throw new AppError(502, 'AI analysis service is unavailable.', 'AI_PROVIDER_ERROR')
  const payload = await response.json()
  const content = payload?.choices?.[0]?.message?.content
  try { return validateAiAnalysis(parseJson(content)) }
  catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(422, 'AI returned invalid JSON.', 'AI_INVALID_RESPONSE')
  }
}
