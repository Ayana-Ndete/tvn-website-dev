
<script setup lang="ts">
import logoImage from "../../../src/assets/images/brand/technovation-logo.png"

const baseURL = useRuntimeConfig().app.baseURL.replace(/\/$/, "")
const keycloakLoginUrl = `${baseURL}/api/auth/keycloak/login`

const { data } = await useFetch<{
  admin: {
    id: number
    name: string
    email: string
  } | null
}>("api/auth/me", {
  key: "admin-session-login",
  baseURL: useRuntimeConfig().app.baseURL,
})

if (data.value?.admin) {
  await navigateTo("/admin/posts")
}

</script>

<template>
  <main class="admin-shell admin-login-shell">
    <section class="admin-card admin-login-card">
      <img
        :src="logoImage"
        alt=""
        width="54"
        height="54"
      />

      <p class="admin-kicker">
        TECHNOVATION / ADMIN
      </p>

      <h1>Code Centre login</h1>

      <p>
        Publishing access is restricted to authorised administrators.
      </p>

      <a :href="keycloakLoginUrl" class="keycloak-login-button">
  Sign in with Keycloak
</a>

      <NuxtLink to="/code-centre">
        ← Back to Code Centre
      </NuxtLink>
    </section>
  </main>
</template>

<style src="~/assets/admin.css"></style>
