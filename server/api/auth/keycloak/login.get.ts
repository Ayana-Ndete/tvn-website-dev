
import * as oidc from "openid-client"
import { randomBytes } from "node:crypto"
import {
createError,
getRequestURL,
setCookie,
sendRedirect,
} from "h3"
import { getKeycloakClient } from "../../../utils/keycloak"

export default defineEventHandler(async (event) => {
const config = await getKeycloakClient()

const codeVerifier = oidc.randomPKCECodeVerifier()
const codeChallenge =
    await oidc.calculatePKCECodeChallenge(codeVerifier)

const state = randomBytes(32).toString("base64url")

const baseURL = useRuntimeConfig(event).app.baseURL.replace(/\/$/, "")
const origin = getRequestURL(event).origin

const redirectUri =
    `${origin}${baseURL}/api/auth/keycloak/callback`

const secure = getRequestURL(event).protocol === "https:"

const cookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "lax" as const,
  path: `${baseURL}/api/auth/keycloak`,
  maxAge: 600,
}

setCookie(event, "kc_code_verifier", codeVerifier, cookieOptions)
setCookie(event, "kc_auth_state", state, cookieOptions)

const parameters: Record<string, string> = {
    redirect_uri: redirectUri,
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
}

const authorizationUrl =
    oidc.buildAuthorizationUrl(config, parameters)

if (!authorizationUrl) {
    throw createError({
    statusCode: 500,
    statusMessage: "Unable to start Keycloak authentication",
    })
}

return sendRedirect(event, authorizationUrl.href, 302)
})
