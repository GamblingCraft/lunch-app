import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Auth request received:', {
    telegramId: body?.id,
    hasHash: !!body?.hash,
    allParams: Object.keys(body || {})
  })

  if (!body?.id || !body?.hash) {
    console.error('Invalid Telegram payload:', body)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Telegram payload: missing id or hash'
    })
  }

  const telegramId = Number(body.id)

  // ─────────────────────────────
  // Telegram signature validation
  // ─────────────────────────────
  const botToken = process.env.NUXT_PUBLIC_TELEGRAM_BOT_TOKEN || '8208807830:AAFz6ESQXnZx-rQWslr5tFh9X-m-E0gom3g'
  
  if (!botToken) {
    console.error('Bot token not set')
    throw createError({
      statusCode: 500,
      statusMessage: 'Bot token not set'
    })
  }

  console.log('Validating Telegram hash...')
  
  // Create check string
  const checkString = Object.keys(body)
    .filter(k => k !== 'hash')
    .sort()
    .map(k => `${k}=${body[k]}`)
    .join('\n')

  console.log('Check string:', checkString)

  const secret = crypto
    .createHash('sha256')
    .update(botToken)
    .digest()

  const hash = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex')

  console.log('Calculated hash:', hash)
  console.log('Received hash:', body.hash)

  if (hash !== body.hash) {
    console.error('Telegram hash mismatch')
    throw createError({
      statusCode: 403,
      statusMessage: 'Telegram hash invalid - possible tampering'
    })
  }

  console.log('Telegram hash validated successfully')

  // ─────────────────────────────
  // Read users.json
  // ─────────────────────────────
  const usersPath = path.resolve(process.cwd(), 'data/users/users.json')
  
  console.log('Looking for users file at:', usersPath)

  if (!fs.existsSync(usersPath)) {
    console.log('Users file not found, creating directory...')
    
    // Create directory if it doesn't exist
    const dirPath = path.dirname(usersPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    // Create empty users file
    fs.writeFileSync(usersPath, JSON.stringify([], null, 2))
    
    console.log('Users file created, user is new')
    return { status: 'new', telegramId }
  }

  let users = []
  try {
    const usersContent = fs.readFileSync(usersPath, 'utf-8')
    users = JSON.parse(usersContent)
    console.log('Loaded users:', users.length)
  } catch (error) {
    console.error('Error reading users file:', error)
    return { status: 'new', telegramId }
  }

  // Find user - ищем по telegram_id
  const user = users.find(
    (u: any) => Number(u.telegram_id) === telegramId
  )

  console.log('Found user:', user)

  if (!user) {
    console.log('User not found, needs registration')
    return { status: 'new', telegramId, telegramData: body }
  }

  // Create session (если используете nuxt-auth или сессии)
  const session = {
    user: {
      id: user.id,
      telegram_id: user.telegram_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      fio: user.fio,
      department: user.department,
      is_admin: user.is_admin,
      photo_url: body.photo_url || user.photo_url
    },
    loggedInAt: new Date().toISOString()
  }

  // Set session cookie (пример)
  setCookie(event, 'auth_token', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 неделя
  })

  // Return role
  if (user.is_admin === true) {
    console.log('User is admin')
    return { 
      status: 'ok', 
      role: 'admin',
      user: session.user
    }
  }

  console.log('User is regular user')
  return { 
    status: 'ok', 
    role: 'user',
    user: session.user
  }
})