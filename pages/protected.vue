<template>
  <div>
    <h1>Protected</h1>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'auth' })
</script>

<style></style>
