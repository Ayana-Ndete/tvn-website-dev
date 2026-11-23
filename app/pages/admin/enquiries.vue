<script setup lang="ts">
const api = useApi()
definePageMeta({ middleware: "admin" })

type Enquiry = {
  id: string
  name: string
  email: string
  service: string
  project: string
  status: "NEW" | "READ"
  createdAt: string
}

const enquiries = ref<Enquiry[]>([])
const loading = ref(true)
const error = ref("")
const updatingId = ref("")

async function load() {
  loading.value = true
  error.value = ""
  try { enquiries.value = await api<Enquiry[]>("api/admin/enquiries") }
  catch (err: any) { error.value = err?.data?.statusMessage || "Could not load enquiries" }
  finally { loading.value = false }
}

async function updateStatus(enquiry: Enquiry) {
  updatingId.value = enquiry.id
  try {
    const status = enquiry.status === "NEW" ? "READ" : "NEW"
    await api(`api/admin/enquiries/${enquiry.id}`, { method: "PATCH", body: { status } })
    enquiry.status = status
  } catch (err: any) {
    error.value = err?.data?.statusMessage || "Could not update enquiry"
  } finally { updatingId.value = "" }
}

async function logout() {
  await api("api/auth/logout", { method: "POST" })
  await navigateTo("/admin/login")
}

onMounted(load)
</script>

<template>
  <main class="admin-shell">
    <div class="admin-container">
      <header class="admin-topbar">
        <div><p class="admin-kicker">WEBSITE / ADMIN</p><h1>Contact enquiries</h1></div>
        <div class="admin-actions">
          <NuxtLink class="admin-button admin-secondary" to="/admin/posts">Manage posts</NuxtLink>
          <NuxtLink class="admin-button admin-secondary" to="/admin/settings">Website settings</NuxtLink>
          <button class="admin-secondary" @click="logout">Sign out</button>
        </div>
      </header>

      <section class="admin-card">
        <p v-if="loading" style="padding:20px">Loading enquiries…</p>
        <p v-else-if="error" class="admin-error" style="margin:20px">{{ error }}</p>
        <table v-else class="admin-table admin-enquiries-table">
          <thead><tr><th>Client</th><th>Service</th><th>Project details</th><th>Received</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="enquiry in enquiries" :key="enquiry.id">
              <td><strong>{{ enquiry.name }}</strong><br><a :href="`mailto:${enquiry.email}`">{{ enquiry.email }}</a></td>
              <td>{{ enquiry.service }}</td>
              <td class="admin-enquiry-message">{{ enquiry.project }}</td>
              <td>{{ new Date(enquiry.createdAt).toLocaleString() }}</td>
              <td>
                <span class="admin-status" :class="{ 'admin-status-new': enquiry.status === 'NEW' }">{{ enquiry.status }}</span>
                <button class="admin-text-button" :disabled="updatingId === enquiry.id" @click="updateStatus(enquiry)">
                  Mark {{ enquiry.status === "NEW" ? "read" : "new" }}
                </button>
              </td>
            </tr>
            <tr v-if="!enquiries.length"><td colspan="5">No contact enquiries yet.</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
</template>

<style src="~/assets/admin.css"></style>
