import dotenv from 'dotenv'
dotenv.config()


const required = ['DATABASE_URL', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET']

export function assertConfig() {
  const missing = required.filter((name) => !process.env[name])
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`)
}

export const config = {
  port: Number(process.env.PORT || 8080),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '8h',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  aiMode: process.env.AI_MODE || 'mock',
  aiApiKey: process.env.AI_API_KEY,
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
  aiBaseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
  notionEnabled: process.env.NOTION_ENABLED === 'true',
  notionApiKey: process.env.NOTION_API_KEY,
  notionDatabaseId: process.env.NOTION_DATABASE_ID,
  notionTitleProperty: process.env.NOTION_TITLE_PROPERTY || 'Name',
}
