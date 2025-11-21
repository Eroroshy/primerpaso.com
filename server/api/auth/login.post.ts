import { pool } from '../../utils/db'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
}) 

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const { email, password } = parsed.data

  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email=$1 LIMIT 1',
    [email]
  )

  if (rows.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  const user = rows[0]

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email
    }
  }
})
