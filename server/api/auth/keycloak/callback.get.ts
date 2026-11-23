
import * as oidc from "openid-client"
import {
  createError,
  deleteCookie,
  getCookie,
  getRequestURL,
  sendRedirect,
} from "h3"
import { db } from "../../../utils/db"
import { createAdminSession } from "../../../utils/auth"
import {
  getKeycloakClient,
  getKeycloakSettings,
} from "../../../utils/keycloak"

export default defineEventHandler(async (event) => {
  const baseURL = useRuntimeConfig(event).app.baseURL.replace(/\/$/, "")
  const cookiePath = `${baseURL}/api/auth/keycloak`
  const loginPage = `${baseURL}/admin/login`
  const dashboard = `${baseURL}/admin/posts`

  const codeVerifier = getCookie(event, "kc_code_verifier")
  const expectedState = getCookie(event, "kc_auth_state")

  // One-time cookies must not be reusable.
  deleteCookie(event, "kc_code_verifier", { path: cookiePath })
  deleteCookie(event, "kc_auth_state", { path: cookiePath })

  if (!codeVerifier || !expectedState) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Keycloak login verification data",
    })
  }

  const settings = getKeycloakSettings()

  if (!settings.adminRole) {
    throw createError({
      statusCode: 503,
      statusMessage: "Keycloak admin role is not configured",
    })
  }

  const client = await getKeycloakClient()

  let tokens: Awaited<ReturnType<typeof oidc.authorizationCodeGrant>>

  try {
    tokens = await oidc.authorizationCodeGrant(
      client,
      getRequestURL(event),
      {
        pkceCodeVerifier: codeVerifier,
        expectedState,
        idTokenExpected: true,
      },
    )
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Keycloak authentication verification failed",
    })
  }

  const claims = tokens.claims()

  if (!claims?.sub || claims.iss !== settings.issuer) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid Keycloak identity",
    })
  }

  // Read roles from Keycloak's UserInfo response only if
  // the server has been configured to provide them there.
  const userInfo = await oidc.fetchUserInfo(
    client,
    tokens.access_token,
    claims.sub,
  )

  const realmAccess = userInfo.realm_access as
    | { roles?: unknown }
    | undefined

  const roles = Array.isArray(realmAccess?.roles)
    ? realmAccess.roles
    : []

  if (!roles.includes(settings.adminRole)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Keycloak administrator role required",
    })
  }

  const admin = await db.admin.findFirst({
    where: {
      keycloakIssuer: claims.iss,
      keycloakSubject: claims.sub,
    },
  })

  if (!admin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Keycloak account is not linked to an administrator",
    })
  }

if (!admin.isActive) {
  throw createError({
    statusCode: 403,
    statusMessage: "Administrator account is disabled",
  })
}

  await createAdminSession(event, admin.id)

  return sendRedirect(event, dashboard, 302)
})
