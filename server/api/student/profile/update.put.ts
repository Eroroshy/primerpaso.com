import { defineEventHandler, readBody } from 'h3'
import { usePostgres } from '../../../utils/postgres'
import { getUserFromToken } from '../../auth/helpers'

export default defineEventHandler(async (event) => {
  const db = usePostgres()
  const user = await getUserFromToken(event)
  const body = await readBody(event)

  const clean = v =>
    typeof v === 'string' ? v.trim() : null

  const schoolName = clean(body.school)
  const careerName = clean(body.career)

  // ======================================================
  // 1. OBTENER O CREAR ESTUDIANTE
  // ======================================================
  const studentRows = await db`
    SELECT *
    FROM students
    WHERE id_user = ${user.id_user}
  `

  let student = studentRows[0]

  if (!student) {
    console.log('NO EXISTE STUDENT, CREÁNDOLO...')

    const newStudent = await db`
      INSERT INTO students (
        id_user,
        name_student,
        last_name_student,
        telephone_student,
        id_career
      ) VALUES (
        ${user.id_user},
        '',
        '',
        '',
        1 -- carrera por defecto
      )
      RETURNING *
    `

    student = newStudent[0]
  }

  let schoolId = student.id_school
  let careerId = student.id_career

  // ======================================================
  // 2. SCHOOL (VALIDACIÓN Y CREACIÓN)
  // ======================================================
  if (schoolName) {
    const existingSchool = await db`
      SELECT id_school
      FROM schools
      WHERE LOWER(TRIM(name_school)) = LOWER(${schoolName})
    `

    if (existingSchool.length) {
      schoolId = existingSchool[0].id_school
    } else {
      const newSchool = await db`
        INSERT INTO schools (name_school, ubication)
        VALUES (${schoolName}, ${clean(body.location)})
        RETURNING id_school
      `
      schoolId = newSchool[0].id_school
      console.log('CREÉ SCHOOL:', schoolName)
    }
  }

  // ======================================================
  // 3. CAREER (VALIDACIÓN Y CREACIÓN)
  //  *** IMPORTANTE ***
  //  careers.id_school es FK OBLIGATORIO,
  //  así que lo incluimos en el INSERT.
  // ======================================================
  if (careerName) {
    const existingCareer = await db`
      SELECT id_career
      FROM careers
      WHERE LOWER(TRIM(name_career)) = LOWER(${careerName})
        AND id_school = ${schoolId}
    `

    if (existingCareer.length) {
      careerId = existingCareer[0].id_career
    } else {
      const newCareer = await db`
        INSERT INTO careers (name_career, id_school)
        VALUES (${careerName}, ${schoolId})
        RETURNING id_career
      `
      careerId = newCareer[0].id_career
      console.log('CREÉ CAREER:', careerName)
    }
  }

  // ======================================================
  // 4. UPDATE FINAL DEL STUDENT
  // ======================================================
  await db`
    UPDATE students
    SET name_student = ${clean(body.name_student)},
        last_name_student = ${clean(body.last_name_student)},
        telephone_student = ${clean(body.telephone_student)},
        id_school = ${schoolId},
        id_career = ${careerId}
    WHERE id_user = ${user.id_user}
  `

  return { ok: true }
})
