import { defineEventHandler, readBody, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const db = usePostgres()

  // 1️⃣ Validación básica
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email y password son requeridos'
    })
  }

  // 2️⃣ Revisar si ya existe
  const existing = await db`
    SELECT * FROM users WHERE email = ${email}
  `

  if (existing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El usuario ya existe'
    })
  }

  // 3️⃣ Generar hash seguro del password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // 4️⃣ Insertar usuario con hash en vez del password plano
  const result = await db`
    INSERT INTO users (email, password, rol)
    VALUES (${email}, ${hashedPassword}, 'student')
    RETURNING id_user, email, rol
  `

  return {
    ok: true,
    user: result[0]
  }
})
