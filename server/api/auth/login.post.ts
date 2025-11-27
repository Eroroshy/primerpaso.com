import { defineEventHandler, readBody, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const db = usePostgres()

  const users = await db`
    SELECT * FROM users WHERE email = ${email}
  `
  const user = users[0]

  if (!user || user.password !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales incorrectas'
    })
  }

  // Crear token falso simple
  const token = Buffer.from(`${user.id_user}:${user.email}`).toString('base64')

  return {
    ok: true,
    token,
    user: { id: user.id_user, email: user.email }
  }
})
