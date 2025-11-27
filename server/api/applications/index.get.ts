import { defineEventHandler, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'
import { getUserFromToken } from '../auth/helpers'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const user = await getUserFromToken(event)

  // 1. Obtener id_student REAL
  const student = await db`
    SELECT id_student 
    FROM students 
    WHERE id_user = ${user.id_user}
  `

  if (student.length === 0) {
    return { data: [] }
  }

  const id_student = student[0].id_student

  // 2. Obtener solicitudes del estudiante
  const apps = await db`
    SELECT 
      a.id_application AS id,
      o.name_vacant_position AS title,
      o.description,
      o.salary,
      c.name_company AS company,
      c.ubication AS company_ubication
    FROM applications a
    JOIN offers o ON o.id_offer = a.id_offer
    JOIN companies c ON c.id_company = o.id_company
    WHERE a.id_student = ${id_student}
  `

  return { data: apps }
})
