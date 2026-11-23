import { requireAdmin } from "../../../utils/auth"
import { db } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return db.contactSubmission.findMany({ orderBy: { createdAt: "desc" } })
})
