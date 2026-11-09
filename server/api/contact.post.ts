import { createError, readBody } from "h3"
import { db } from "../utils/db"

const services = new Set([
  "AI & Agentic Systems",
  "Regulatory & Trade Systems",
  "Software Development",
  "Payments & System Integration",
  "ICT Consulting",
])

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = text(body?.name)
  const email = text(body?.email).toLowerCase()
  const service = text(body?.service)
  const project = text(body?.project)

  if (!name || name.length > 120) {
    throw createError({ statusCode: 400, statusMessage: "Please enter your full name." })
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    throw createError({ statusCode: 400, statusMessage: "Please enter a valid email address." })
  }
  if (!services.has(service)) {
    throw createError({ statusCode: 400, statusMessage: "Please choose a service." })
  }
  if (!project || project.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: "Please tell us about your project." })
  }

  const submission = await db.contactSubmission.create({
    data: { name, email, service, project },
  })

  return { id: submission.id }
})
