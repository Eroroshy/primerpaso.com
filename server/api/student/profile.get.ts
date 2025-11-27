import { defineEventHandler } from 'h3'
import { usePostgres } from '../../utils/postgres'
import { getUserFromToken } from '../auth/helpers'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const user = await getUserFromToken(event)

  const rows = await db`
    SELECT 
      s.name_student AS first_name,
      s.last_name_student AS last_name,
      s.telephone_student AS phone,
      c.name_career AS career,
      sch.name_school AS school,
      sch.ubication AS ubication
    FROM students s
    JOIN careers c ON s.id_career = c.id_career
    JOIN schools sch ON c.id_school = sch.id_school
    WHERE s.id_user = ${user.id_user}
  `

  return rows[0] ?? {}
})
