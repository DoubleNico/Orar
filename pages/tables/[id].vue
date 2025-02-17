<template>
  <div>
    <h1>Schedule Details</h1>
    <p>ID: {{ id }}</p>
    <p v-if="schedule && !error">Name: {{ schedule.name }}</p>
    <p v-if="schedule && !error">Rows: {{ schedule.rows }}</p>
    <p v-if="schedule && !error">Columns: {{ schedule.columns }}</p>
    <DynamicTable
      v-if="schedule && !error"
      :model-value="true"
      :schedule-id="id"
      :courses="courses || []"
      :initial-row="schedule.rows"
      :initial-column="schedule.columns"
    />
    <p v-if="error">{{ error.message }}</p>
    <p v-else-if="!schedule">Loading...</p>
  </div>
</template>

<script lang="ts" setup>
import DynamicTable from '~/components/DynamicTable.vue'
import { getCourses } from '~/scripts/backend/courseOperations'
import type { Course } from '~/scripts/backend/types/Course'

definePageMeta({ middleware: 'auth' })

storeToRefs(useUserStore())

const route = useRoute()
const config = useRuntimeConfig()
const id = computed(() => route.params.id as string)

const { data: schedule, error } = await useFetch(
  `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${id.value}`,
)
const courses = ref<Course[] | null>(null)
await getCourses(id.value, config).then((data) => {
  courses.value = data
})
</script>

<style>
@import 'assets/css/theme.css';
</style>
