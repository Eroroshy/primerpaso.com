import { defineEventHandler, readBody, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'
import { getUserFromToken } from './helpers'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const user = await getUserFromToken(event)
  const body = await readBody(event)

  const { current, newpass } = body

  // 1️⃣ Obtener password actual (hash)
  const rows = await db`
    SELECT password FROM users WHERE id_user = ${user.id_user}
  `
  const currentPassHash = rows[0].password

  // 2️⃣ Comparar contraseña actual
  const matches = await bcrypt.compare(current, currentPassHash)

  if (!matches) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Contraseña actual incorrecta'
    })
  }

  // 3️⃣ Hashear nueva contraseña
  const saltRounds = 10
  const newHashedPass = await bcrypt.hash(newpass, saltRounds)

  // 4️⃣ Guardar nueva contraseña
  await db`
    UPDATE users SET password = ${newHashedPass}
    WHERE id_user = ${user.id_user}
  `

  return { ok: true }
})
