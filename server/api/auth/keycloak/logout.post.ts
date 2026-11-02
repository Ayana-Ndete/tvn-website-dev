
import * as oidc from "openid-client"
import {
  createError,
  getRequestURL,
} from "h3"

import { clearAdminSession } from "../../../utils/auth"
import { getKeycloakClient } from "../../../utils/keycloak"

export default defineEventHandler(async (event) => {
  const baseURL = useRuntimeConfig(event).app.baseURL.replace(/\/$/, "")
  const origin = getRequestURL(event).origin

  const loginPage = `${origin}${baseURL}/admin/login`

  // Resolve Keycloak's logout endpoint before clearing the local session.
  let logoutUrl: string

  try {
    const client = await getKeycloakClient()

    logoutUrl = oidc.buildEndSessionUrl(client, {
      post_logout_redirect_uri: loginPage,
    }).href
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: "Keycloak logout is unavailable",
    })
  }

  await clearAdminSession(event)

  return { logoutUrl }
})
