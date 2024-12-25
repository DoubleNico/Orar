<template>
  <div class="flex justify-center items-center h-screen">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="navigateToLogin"
    >
      Login
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToLogin() {
  router.push('/login')
}
</script>
