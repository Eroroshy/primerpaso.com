import { defineEventHandler, createError, readBody } from 'h3'
import { usePostgres } from '../../utils/postgres'
import { getUserFromToken } from '../auth/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.id_offer) throw createError({ statusCode: 400, message: 'Falta id_offer' })

  const db = usePostgres()
  const user = await getUserFromToken(event)

  // Obtener id_student del usuario
  const student = await db`
    SELECT id_student 
    FROM students 
    WHERE id_user = ${user.id_user}
  `
  if (student.length === 0) throw createError({ statusCode: 404, message: 'Estudiante no encontrado' })
  const id_student = student[0].id_student

  // Revisar si ya aplicó
  const existing = await db`
    SELECT * FROM applications
    WHERE id_student = ${id_student} AND id_offer = ${body.id_offer}
  `
  if (existing.length > 0) {
    return { success: false, message: 'Ya te postulaste a esta vacante' }
  }

  // Insertar la postulación
  await db`
    INSERT INTO applications (id_student, id_offer, status, date_of_application)
    VALUES (${id_student}, ${body.id_offer}, 'pending', now())
  `

  return { success: true, message: 'Postulación realizada con éxito' }
})
