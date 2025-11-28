// server/api/jobs.get.ts (o .ts en Nuxt 3)
import { usePostgres } from '#imports'

export default defineEventHandler(async () => {
  const db = usePostgres()

  // Traemos los jobs de la tabla offers y unimos los datos de tipo y empresa si es necesario
  const jobs = await db`
    SELECT
      o.id_offer,
      o.name_vacant_position AS title,
      o.description,
      o.salary,
      o.date_of_posted,
      t.name_type AS type,
      c.name_company AS company
    FROM offers o
    LEFT JOIN type t ON t.id_type = o.id_type
    LEFT JOIN companies c ON c.id_company = o.id_company
    ORDER BY o.date_of_posted DESC
  `

  return jobs
})
