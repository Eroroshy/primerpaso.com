import { defineEventHandler } from 'h3'
import { usePostgres } from '../../utils/postgres'
import { getUserFromToken } from './helpers'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const user = await getUserFromToken(event)

  await db`
    DELETE FROM users WHERE id_user = ${user.id_user}
  `

  return { ok: true }
})
