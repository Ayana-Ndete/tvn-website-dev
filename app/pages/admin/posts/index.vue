<script setup lang="ts">
const api = useApi()
definePageMeta({ middleware: "admin" })

type AdminPost = { id: string; title: string; topic: string; kind: string; status: string; updatedAt: string }
const posts = ref<AdminPost[]>([])
const loading = ref(true)
const error = ref("")

async function load() {
  loading.value = true
  try { posts.value = await api<AdminPost[]>("api/admin/posts") }
  catch (err: any) { error.value = err?.data?.statusMessage || "Could not load posts" }
  finally { loading.value = false }
}


async function logout() {
  try {
    const result = await api<{ logoutUrl: string }>(
      "api/auth/keycloak/logout",
      { method: "POST" }
    )

    // Full browser navigation to Keycloak's logout endpoint.
    window.location.assign(result.logoutUrl)
  } catch (err: any) {
    error.value =
      err?.data?.statusMessage || "Could not complete logout"
  }
}


async function remove(post: AdminPost) {
  if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return
  await api(`api/admin/posts/${post.id}`, { method: "DELETE" })
  await load()
}

onMounted(load)
</script>

<template>
  <main class="admin-shell">
    <div class="admin-container">
      <header class="admin-topbar">
        <div><p class="admin-kicker">CODE CENTRE / ADMIN</p><h1>Posts</h1></div>
        <div class="admin-actions">
          <NuxtLink class="admin-button admin-secondary" to="/code-centre">View Code Centre</NuxtLink>
          <NuxtLink class="admin-button admin-secondary" to="/admin/settings">Website Settings</NuxtLink>
          <NuxtLink class="admin-button" to="/admin/posts/new">New post</NuxtLink>
          <button class="admin-secondary" @click="logout">Sign out</button>
        </div>
      </header>
      <section class="admin-card">
        <p v-if="loading" style="padding:20px">Loading posts…</p>
        <p v-else-if="error" class="admin-error" style="margin:20px">{{ error }}</p>
        <table v-else class="admin-table">
          <thead><tr><th>Title</th><th>Topic</th><th>Status</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td><strong>{{ post.title }}</strong><br><small>{{ post.kind }}</small></td>
              <td>{{ post.topic }}</td>
              <td><span class="admin-status">{{ post.status }}</span></td>
              <td>{{ new Date(post.updatedAt).toLocaleDateString() }}</td>
              <td><div class="admin-actions"><NuxtLink class="admin-button admin-secondary" :to="`/admin/posts/${post.id}/edit`">Edit</NuxtLink><button class="admin-danger" @click="remove(post)">Delete</button></div></td>
            </tr>
            <tr v-if="!posts.length"><td colspan="5">No posts yet. Create your first post.</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
</template>
<style src="~/assets/admin.css"></style>
