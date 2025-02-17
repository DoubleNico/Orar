<template>
  <div class="flex justify-center items-center">
    <div class="shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4 text-center">User Schedules</h2>
      <div v-if="status !== 'success'" class="text-center">
        <span>Loading...</span>
      </div>
      <ul v-else>
        <li
          v-for="schedule in data"
          :key="schedule.id"
          class="cursor-pointer text-blue-500 hover:underline text-center"
          @click="navigateToSchedule(schedule.id)"
        >
          {{ schedule.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAsyncData } from 'nuxt/app'
import { getSchedules } from '~/scripts/backend/schedulesOperations'
import { useUserStore } from '~/stores/userStore'

const userStore = useUserStore()
const router = useRouter()
const { data, status } = useAsyncData(
  'schedules',
  async () => {
    const config = useRuntimeConfig()
    if (!userStore.userId) return []
    return await getSchedules(config, userStore.userId)
  },
  { lazy: true },
)

function navigateToSchedule(scheduleId: string) {
  router.push(`/tables/${scheduleId}`)
}
</script>
