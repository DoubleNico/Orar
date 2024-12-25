<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label
            for="username"
            class="block text-sm font-medium text-gray-600 mb-2"
            >Username</label
          >
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          />
        </div>

        <div class="mb-6">
          <label
            for="password"
            class="block text-sm font-medium text-gray-600 mb-2"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
const username = ref('')
const password = ref('')
const router = useRouter()

async function handleLogin() {
  if (!username.value || !password.value) {
    alert('Please fill in all fields!')
    return
  }

  if (username.value === 'admin' && password.value === 'password') {
    const data = await $fetch('/api/auth')
    if (data?.success) {
      console.log('Login successful!')
      router.push('/')
    } else {
      console.log('Login failed!')
    }
  } else {
    alert('Invalid username or password!')
  }
}
</script>
