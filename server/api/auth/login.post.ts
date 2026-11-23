
import { createError } from "h3"

export default defineEventHandler(() => {
  throw createError({
    statusCode: 410,
    statusMessage: "Password login is disabled. Sign in with Keycloak.",
  })
})
