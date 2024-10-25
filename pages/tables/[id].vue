<template>
  <div>
    <h1>Schedule Details</h1>
    <p>ID: {{ id }}</p>
    <p>Name: {{ schedule.name }}</p>
    <p>Rows: {{ schedule.rows }}</p>
    <p>Columns: {{ schedule.columns }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id)

// Fetch the schedule data from localStorage using the ID
const schedule = computed(() => {
  const scheduleData = localStorage.getItem(`schedule-${id.value}`)
  return scheduleData
    ? JSON.parse(scheduleData)
    : { name: '', rows: 0, columns: 0 }
})
</script>
