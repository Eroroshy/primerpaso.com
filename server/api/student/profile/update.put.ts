import { defineEventHandler, readBody } from 'h3'
import { usePostgres } from '../../../utils/postgres'
import { getUserFromToken } from '../../auth/helpers'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const user = await getUserFromToken(event)
  const body = await readBody(event)

  const rows = await db`
    SELECT s.id_career, c.id_school
    FROM students s
    JOIN careers c ON s.id_career = c.id_career
    WHERE s.id_user = ${user.id_user}
  `
  const info = rows[0]

  await db`
    UPDATE students
    SET first_name = ${body.first_name},
        last_name = ${body.last_name},
        phone = ${body.phone}
    WHERE id_user = ${user.id_user}
  `

  await db`
    UPDATE careers
    SET name = ${body.career}
    WHERE id_career = ${info.id_career}
  `

  await db`
    UPDATE schools
    SET name = ${body.school},
        ubication = ${body.school_ubication}
    WHERE id_school = ${info.id_school}
  `

  return { ok: true }
})
