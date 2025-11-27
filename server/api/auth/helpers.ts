import { H3Event, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'

export async function getUserFromToken(event: H3Event) {
  const db = usePostgres()

  const header = event.node.req.headers['authorization']
  if (!header) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing token'
    })
  }

  const token = header.replace('Bearer ', '').trim()

  let decoded = ''
  try {
    decoded = Buffer.from(token, 'base64').toString('utf8')
  } catch (e) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token format'
    })
  }

  const [id_user, email] = decoded.split(':')

  if (!id_user || !email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  const users = await db`
    SELECT id_user, email, rol
    FROM users
    WHERE id_user = ${id_user} AND email = ${email}
  `

  const user = users[0]

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid user'
    })
  }

  return user
}

export async function getStudentId(db, id_user) {
  const rows = await db`
    SELECT id_student 
    FROM students 
    WHERE id_user = ${id_user}
  `
  return rows[0]?.id_student ?? null
}

