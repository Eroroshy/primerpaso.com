import { defineEventHandler, getHeader, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization')

  if (!auth || !auth.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'No token provided' })
  }

  const token = auth.replace('Bearer ', '')
  const decoded = Buffer.from(token, 'base64').toString('utf8') // "id:email"
  const [id_user, email] = decoded.split(':')

  const db = usePostgres()
  const users = await db`
    SELECT id_user, email, rol
    FROM users 
    WHERE id_user = ${id_user} AND email = ${email}
  `

  const user = users[0]

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  return {
    ok: true,
    user
  }
})
