<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label
            for="username"
            class="block text-sm font-medium text-gray-600 mb-2"
            >Username or Email</label
          >
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username or email"
            class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            :class="
              usernameTouched && username.length <= 3 ? 'border-red-500' : ''
            "
            @blur="usernameTouched = true"
          />
          <div
            v-if="usernameTouched && username.length <= 3"
            v-motion-pop
            class="text-red-500 text-sm mt-1"
          >
            Username must be longer than 3 characters!
          </div>
        </div>

        <div class="mb-6">
          <label
            for="password"
            class="block text-sm font-medium text-gray-600 mb-2"
            >Password</label
          >
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 pr-20"
              :class="
                passwordTouched && password.length <= 4 ? 'border-red-500' : ''
              "
              @blur="passwordTouched = true"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <span class="border-l border-gray-300 h-6 mx-2"></span>
              <Icon
                v-if="showPassword"
                v-motion-fade
                class="cursor-pointer bg-black"
                name="mdi:eye-off"
                @click="showPassword = !showPassword"
              />
              <Icon
                v-else
                v-motion-fade
                class="cursor-pointer bg-black"
                name="mdi:eye"
                @click="showPassword = !showPassword"
              />
            </div>
          </div>
          <div
            v-if="passwordTouched && password.length <= 4"
            v-motion-pop
            class="text-red-500 text-sm mt-1"
          >
            Password must be longer than 4 characters!
          </div>
          <div
            v-if="errorMessage"
            v-motion-pop
            class="mt-1 mb-2 text-red-500 text-center"
          >
            {{ errorMessage }}
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Login
        </button>
      </form>
      <div>
        <p class="text-center text-gray-600 mt-4">
          Don't have an account?
          <nuxt-link
            to="/register"
            class="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >Register</nuxt-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const username = ref('')
const password = ref('')
const usernameTouched = ref(false)
const passwordTouched = ref(false)
const showPassword = ref(false)
const router = useRouter()
const errorMessage = ref('')

watch([username, password], () => {
  errorMessage.value = ''
})

async function handleLogin() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please fill in all fields!'
    return
  }

  const data = await $fetch('/api/auth', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value,
    },
  })

  if (data?.success) {
    router.push('/')
  } else {
    errorMessage.value = data?.message || 'Login failed!'
  }
}
</script>
