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
  const rows = await db`
    SELECT 
      u.id_user,
      u.email,
      u.rol,

      s.id_student,
      s.name_student,
      s.last_name_student,
      s.telephone_student,
      s.id_career

    FROM users u
    LEFT JOIN students s ON s.id_user = u.id_user
    WHERE u.id_user = ${id_user} AND u.email = ${email}
  `

  const user = rows[0]

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  return {
    ok: true,
    user: {
      ...user,
      name: `${user.name_student ?? ''} ${user.last_name_student ?? ''}`.trim()
    }
  }
})
