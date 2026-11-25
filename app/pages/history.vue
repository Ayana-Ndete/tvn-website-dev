<script setup lang="ts">
const route = useRoute()
await navigateTo({ path: '/journey', hash: route.hash || undefined }, { replace: true })
</script>

<template><div /></template>
