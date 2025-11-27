import { defineEventHandler, createError } from 'h3'
import { usePostgres } from '../../utils/postgres'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const id = Number(event.context.params?.id)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido'
    })
  }

  const auth = event.node.req.headers.authorization
  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }

  const token = auth.replace('Bearer ', '')
  const [userId] = Buffer.from(token, 'base64').toString().split(':')

  // Obtener id_student del usuario
  const studentRows = await db`
    SELECT id_student
    FROM students
    WHERE id_user = ${Number(userId)}
  `

  if (studentRows.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No eres estudiante'
    })
  }

  const idStudent = studentRows[0].id_student

  // Verificar que la aplicación le pertenece
  const app = await db`
    SELECT id_application
    FROM applications
    WHERE id_application = ${id}
    AND id_student = ${idStudent}
  `

  if (app.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No puedes borrar esta postulación'
    })
  }

  // Eliminar
  await db`
    DELETE FROM applications
    WHERE id_application = ${id}
  `

  return {
    ok: true,
    message: 'Postulación eliminada'
  }
})
