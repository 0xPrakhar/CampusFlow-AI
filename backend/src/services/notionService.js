import { Client } from '@notionhq/client'
import { config } from '../config.js'
import { AppError } from '../utils/AppError.js'

function getClient() {
  if (!config.notionApiKey || !config.notionDatabaseId) throw new AppError(500, 'Notion credentials are missing.', 'NOTION_CONFIGURATION_ERROR')
  return new Client({ auth: config.notionApiKey })
}

function select(name) { return { select: { name } } }
function richText(content) { return { rich_text: [{ type: 'text', text: { content: String(content || '').slice(0, 1900) } }] } }

function properties(request) {
  return {
    [config.notionTitleProperty]: { title: [{ type: 'text', text: { content: request.id } }] },
    Student: richText(request.student),
    Category: select(request.category),
    Priority: select(request.priority),
    Summary: richText(request.summary),
    Deadline: richText(request.deadline),
    'Suggested Action': richText(request.suggestedAction),
    Status: select(request.status),
  }
}

export async function createNotionRequest(request) {
  if (!config.notionEnabled) return { skipped: true, pageId: null }
  const notion = getClient()
  const page = await notion.pages.create({ parent: { database_id: config.notionDatabaseId }, properties: properties(request) })
  return { skipped: false, pageId: page.id }
}

export async function updateNotionRequest(request) {
  if (!config.notionEnabled || !request.notionPageId) return { skipped: true }
  const notion = getClient()
  await notion.pages.update({ page_id: request.notionPageId, properties: properties(request) })
  return { skipped: false }
}
