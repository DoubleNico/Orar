<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">
        Register
      </h2>

      <form @submit.prevent="handleRegister">
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
            :class="
              usernameTouched && username.length <= 3 ? 'border-red-500' : ''
            "
            class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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

        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-600 mb-2"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          />
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
              :class="
                passwordTouched && password.length <= 4 ? 'border-red-500' : ''
              "
              class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 pr-10"
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
        </div>

        <div class="mb-6">
          <label
            for="passwordConfirmation"
            class="block text-sm font-medium text-gray-600 mb-2"
            >Confirm Password</label
          >
          <div class="relative">
            <input
              id="passwordConfirmation"
              v-model="passwordConfirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              :class="
                passwordConfirmationTouched && passwordConfirmation !== password
                  ? 'border-red-500'
                  : ''
              "
              class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 pr-10"
              @blur="passwordConfirmationTouched = true"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <span class="border-l border-gray-300 h-6 mx-2"></span>
              <Icon
                v-if="showConfirmPassword"
                v-motion-fade
                class="cursor-pointer bg-black"
                name="mdi:eye-off"
                @click="showConfirmPassword = !showConfirmPassword"
              />
              <Icon
                v-else
                v-motion-fade
                class="cursor-pointer bg-black"
                name="mdi:eye"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </div>
          </div>
          <div
            v-if="
              passwordConfirmationTouched && passwordConfirmation !== password
            "
            v-motion-pop
            class="text-red-500 text-sm mt-1"
          >
            Passwords do not match!
          </div>
        </div>

        <div
          v-if="errorMessage"
          v-motion-pop
          class="mb-4 text-red-500 text-center"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white shadow-md font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
        >
          Register
        </button>
      </form>
      <div class="w-full mt-2">
        <NuxtLink
          to="/login"
          class="block text-center bg-gray-500 hover:bg-gray-700 text-white shadow-md font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
        >
          Go to Login
        </NuxtLink>
      </div>
      <div class="border-t-4 border-gray-300 mt-1 mb-2"></div>

      <div class="flex items-center justify-center">
        <button
          class="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-md font-bold text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <Icon class="mr-2 text-xl" name="devicon:google" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const usernameTouched = ref(false)
const passwordTouched = ref(false)
const passwordConfirmationTouched = ref(false)
const router = useRouter()

watch([username, email, password, passwordConfirmation], () => {
  errorMessage.value = ''
})

async function handleRegister() {
  if (
    !username.value ||
    !email.value ||
    !password.value ||
    !passwordConfirmation.value
  ) {
    return
  }

  if (username.value.length <= 3) {
    errorMessage.value = 'Username must be longer than 3 characters!'
    return
  }

  if (password.value.length <= 4) {
    errorMessage.value = 'Password must be longer than 4 characters!'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Passwords do not match!'
    return
  }

  const data = await $fetch('/api/register', {
    method: 'POST',
    body: {
      username: username.value,
      email: email.value,
      password: password.value,
    },
  })

  if (data?.success) {
    console.log('Registration successful!')
    router.push('/')
  } else {
    errorMessage.value = data?.message || 'Registration failed!'
    console.log('Registration failed!')
  }
}
</script>
