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
  const payload = {
    [config.notionTitleProperty]: {
      title: [{ type: "text", text: { content: request.id } }],
    },

    // NOTE: trailing space in Notion property name:
    "Student ": richText(request.student),

    // Category is rich_text in your database (NOT select):
    "Category": richText(request.category),

    // Priority is a select in your database:
    "Priority": select(request.priority),

    "Summary": richText(request.summary),
    "Deadline": richText(request.deadline),
    "Suggested Action": richText(request.suggestedAction),

    // NOTE: two trailing spaces in Notion property name:
    "Status  ": select(request.status),
  }

  return payload
}

export async function createNotionRequest(request) {
  if (!config.notionEnabled) return { skipped: true, pageId: null }
  const notion = getClient()
  const payload = properties(request)
  const page = await notion.pages.create({ parent: { database_id: config.notionDatabaseId }, properties: payload })
  return { skipped: false, pageId: page.id }
}

export async function updateNotionRequest(request) {
  if (!config.notionEnabled || !request.notionPageId) return { skipped: true }
  const notion = getClient()
  const payload = properties(request)
  await notion.pages.update({ page_id: request.notionPageId, properties: payload })
  return { skipped: false }
}

export async function archiveNotionRequest(pageId) {
  if (!config.notionEnabled || !pageId) return { skipped: true }
  const notion = getClient()
  await notion.pages.update({ page_id: pageId, archived: true })
  return { skipped: false }
}
