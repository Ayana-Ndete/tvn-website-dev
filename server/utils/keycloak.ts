
import * as oidc from "openid-client"

export function getKeycloakSettings() {
const config = useRuntimeConfig()

const issuer = String(config.keycloakIssuer || "").trim()
const clientId = String(config.keycloakClientId || "").trim()
const clientSecret = String(config.keycloakClientSecret || "").trim()
const adminRole = String(config.keycloakAdminRole || "").trim()

if (!issuer || !clientId) {
    throw createError({
    statusCode: 503,
    statusMessage: "Keycloak is not configured",
    })
}

return {
    issuer,
    clientId,
    clientSecret,
    adminRole,
}
}

export async function getKeycloakClient() {
const settings = getKeycloakSettings()

return oidc.discovery(
    new URL(settings.issuer),
    settings.clientId,
    undefined,
    settings.clientSecret
    ? oidc.ClientSecretPost(settings.clientSecret)
    : oidc.None(),
)
}
