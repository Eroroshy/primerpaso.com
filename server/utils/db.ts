// server/utils/db.ts
import pkg from 'pg'

const { Pool } = pkg

// Usa process.env.DATABASE_URL (o runtimeConfig si prefieres)
export const pool = new Pool({
  connectionString: process.env.NUXT_POSTGRES_URL
})
