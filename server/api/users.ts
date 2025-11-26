import { defineEventHandler, readBody, createError } from 'h3'
import { usePostgres } from '../utils/postgres'

export default defineEventHandler(async (event) => {
  const method = (event.node.req.method || 'POST').toUpperCase()
  const db = usePostgres()
  const body = await readBody(event)

  if (method === 'POST') {
    const { email, password } = body

    // 1️⃣ Verificar si ya existe un usuario con ese email
    const existing = await db`
            SELECT * FROM users WHERE email = ${email}
        `

    if (existing.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El usuario ya existe'
      })
    }

    // 2️⃣ Insertar nuevo usuario con rol por defecto 'student'
    const result = await db`
            INSERT INTO users (email, password, rol)
            VALUES (${email}, ${password}, 'student')
            RETURNING id_user, email, rol
        `

    return {
      ok: true,
      user: result[0]
    }
  }

  if (method === 'PUT' || method === 'PATCH') {
    const { id_user, email, password, rol } = body

    if (!id_user) {
      throw createError({ statusCode: 400, statusMessage: 'Falta id_user' })
    }

    // Si se quiere cambiar el email, asegurar que no lo tenga otro usuario
    if (email) {
      const conflict = await db`
                SELECT * FROM users WHERE email = ${email} AND id_user != ${id_user}
            `
      if (conflict.length > 0) {
        throw createError({ statusCode: 400, statusMessage: 'El email ya está en uso' })
      }
      await db`
                UPDATE users SET email = ${email} WHERE id_user = ${id_user}
            `
    }

    if (password) {
      await db`
                UPDATE users SET password = ${password} WHERE id_user = ${id_user}
            `
    }

    if (rol) {
      await db`
                UPDATE users SET rol = ${rol} WHERE id_user = ${id_user}
            `
    }

    const updated = await db`
            SELECT id_user, email, rol FROM users WHERE id_user = ${id_user}
        `
    if (updated.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })
    }

    return {
      ok: true,
      user: updated[0]
    }
  }

  if (method === 'DELETE') {
    const { id_user } = body

    if (!id_user) {
      throw createError({ statusCode: 400, statusMessage: 'Falta id_user' })
    }

    const deleted = await db`
            DELETE FROM users WHERE id_user = ${id_user}
            RETURNING id_user
        `

    if (deleted.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })
    }

    return {
      ok: true,
      deleted: deleted[0]
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Método no permitido' })
})
