<template>
  <div class="flex justify-center items-center h-screen">
    <button
      v-if="!isAuthenticated"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="navigateToLogin"
    >
      Login
    </button>
    <button
      v-else
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const isAuthenticated = computed(() => !!userStore.userId)

function navigateToLogin() {
  router.push('/login')
}

async function logout() {
  try {
    const response = await $fetch('/api/logout', { method: 'POST' })
    if (response.success) {
      userStore.removeUserId()
      router.push('/login')
    } else {
      console.error('Logout failed:', response.message)
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
