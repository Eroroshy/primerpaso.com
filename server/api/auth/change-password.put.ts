import { defineEventHandler, readBody, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'
import { getUserFromToken } from './helpers'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const user = await getUserFromToken(event)
  const body = await readBody(event)

  const rows = await db`
    SELECT password FROM users WHERE id_user = ${user.id_user}
  `
  const currentPass = rows[0].password

  if (currentPass !== body.current) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Contraseña actual incorrecta'
    })
  }

  await db`
    UPDATE users SET password = ${body.newpass}
    WHERE id_user = ${user.id_user}
  `

  return { ok: true }
})
