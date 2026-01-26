import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.id || !body?.hash) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Telegram payload'
    })
  }

  const telegramId = Number(body.id)

  // ─────────────────────────────
  // Telegram signature validation
  // ─────────────────────────────
  const botToken = process.env.NUXT_PUBLIC_TELEGRAM_BOT_TOKEN
  if (!botToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Bot token not set'
    })
  }

  const checkString = Object.keys(body)
    .filter(k => k !== 'hash')
    .sort()
    .map(k => `${k}=${body[k]}`)
    .join('\n')

  const secret = crypto
    .createHash('sha256')
    .update(botToken)
    .digest()

  const hash = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex')

  if (hash !== body.hash) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Telegram hash invalid'
    })
  }

  // ─────────────────────────────
  // Read users.json
  // ─────────────────────────────
  const usersPath = path.resolve(process.cwd(), 'data/users/users.json')

  if (!fs.existsSync(usersPath)) {
    return { status: 'new' }
  }

  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))

  const user = users.find(
    (u: any) => Number(u.telegram_id) === telegramId
  )

  if (!user) {
    return { status: 'new' }
  }

  if (user.is_admin === true) {
    return { status: 'ok', role: 'admin' }
  }

  return { status: 'ok', role: 'user' }
})
