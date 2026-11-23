import { createError, getRouterParam, readBody } from "h3"
import { requireAdmin } from "../../../utils/auth"
import { db } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, "id")
  const status = (await readBody(event))?.status
  if (!id || !["NEW", "READ"].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid enquiry update." })
  }

  try {
    return await db.contactSubmission.update({ where: { id }, data: { status } })
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Enquiry not found." })
  }
})
