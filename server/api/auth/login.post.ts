import { defineEventHandler, readBody, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const db = usePostgres()

  // Buscar usuario
  const users = await db`
    SELECT * FROM users WHERE email = ${email}
  `
  const user = users[0]

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales incorrectas'
    })
  }

  // Comparar hashes
  const matches = await bcrypt.compare(password, user.password)

  if (!matches) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales incorrectas'
    })
  }

  // Crear token simple (puedes reemplazar por JWT después)
  const token = Buffer.from(`${user.id_user}:${user.email}`).toString('base64')

  return {
    ok: true,
    token,
    user: { id: user.id_user, email: user.email }
  }
})
