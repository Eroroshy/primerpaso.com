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

  // Revisar si ya existe
  const { rows: existing } = await pool.query(
    'SELECT id FROM users WHERE email=$1 LIMIT 1',
    [email]
  )

  if (existing.length > 0) {
    throw createError({ statusCode: 409, statusMessage: 'User already exists' })
  }

  const hashed = await bcrypt.hash(password, 10)

  await pool.query(
    `INSERT INTO users (email, password) VALUES ($1, $2)`,
    [email, hashed]
  )

  return { ok: true }
})
