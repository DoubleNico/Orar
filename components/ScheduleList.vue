<template>
  <div class="flex justify-center items-center min-h-[50vh] py-8">
    <div
      class="shadow-xl rounded-xl p-8 max-w-md w-full bg-white border border-gray-100"
    >
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
        Your Schedules
      </h2>

      <div
        v-if="status !== 'success'"
        class="flex justify-center items-center py-10"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div v-else-if="!data || data.length === 0" class="text-center py-10">
        <div class="text-gray-400 text-5xl mb-3">📋</div>
        <p class="text-gray-500 mb-2">No schedules found</p>
        <p class="text-gray-400 text-sm">
          Create your first schedule to get started
        </p>
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="schedule in data"
          :key="schedule.id"
          :tabindex="showModal ? -1 : 0"
          class="cursor-pointer bg-gray-50 hover:bg-blue-50 transition-all duration-200 rounded-lg p-4 border border-gray-200 hover:border-blue-300 flex justify-between items-center"
          @click="selectSchedule(schedule)"
        >
          <div>
            <span class="font-medium text-gray-800">{{ schedule.name }}</span>
          </div>
          <div class="text-blue-500">
            <Icon name="mdi:chevron-right" />
          </div>
        </li>
      </ul>

      <div class="mt-6 text-center">
        <!-- <button
          :tabindex="showModal ? -1 : 0"
          class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <Icon name="mdi:plus" class="mr-2" />
          Create New Schedule
        </button> -->
        <StructureButton />
      </div>

      <ModalBase
        v-model="showModal"
        :title="`Schedule: ${selectedSchedule?.name}`"
        :go-back-condition="false"
        :done-condition="true"
        @close="closeModal"
      >
        <div class="space-y-4 py-2">
          <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <Icon name="mdi:calendar" class="text-gray-500 mr-2" />
            <span class="text-gray-600"
              >Created: {{ formatDate(selectedSchedule?.createdAt) }}</span
            >
          </div>

          <button
            :tabindex="showDeleteConfirm ? -1 : 0"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            @click="editSchedule(selectedSchedule)"
          >
            <Icon name="mdi:pencil" class="mr-2" />
            Edit Schedule
          </button>

          <button
            :tabindex="showDeleteConfirm ? -1 : 0"
            class="w-full bg-white border border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            @click="confirmDelete(selectedSchedule)"
          >
            <Icon name="mdi:trash-can" class="mr-2" />
            Delete Schedule
          </button>

          <button
            :tabindex="showDeleteConfirm ? -1 : 0"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors duration-200"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </ModalBase>

      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <h3 class="text-lg font-bold text-red-600 mb-4">Confirm Delete</h3>
          <p class="mb-6 text-gray-600">
            Are you sure you want to delete "<span class="font-bold">{{
              scheduleToDelete?.name
            }}</span
            >"? This action cannot be undone.
          </p>
          <div class="flex space-x-3 justify-end">
            <button
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              @click="deleteSchedule(scheduleToDelete)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ModalBase from '~/components/modal/ModalBase.vue'
import { getSchedules } from '~/scripts/backend/schedulesOperations'
import type { Schedule } from '~/scripts/backend/types/Schedule'
import { useUserStore } from '~/stores/userStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const userStore = useUserStore()
const router = useRouter()
const { data, status } = useAsyncData(
  'schedules',
  async () => {
    const config = useRuntimeConfig()
    if (!userStore.userId) return []
    console.log(userStore.userId)

    return await getSchedules(config, userStore.userId)
  },
  { lazy: true },
)

const selectedSchedule = ref<Schedule | null>(null)
const showModal = ref(props.modelValue)
const showDeleteConfirm = ref(false)
const scheduleToDelete = ref<Schedule | null>(null)
function selectSchedule(schedule: Schedule) {
  selectedSchedule.value = schedule
  showModal.value = true
  emit('update:modelValue', true)
}

watchEffect(() => {
  showModal.value = props.modelValue
})

function closeModal() {
  selectedSchedule.value = null
  showModal.value = false
  emit('update:modelValue', false)
}

function editSchedule(schedule: any) {
  router.push(`/tables/${schedule.id}`)
}

function confirmDelete(schedule: any) {
  scheduleToDelete.value = schedule
  showDeleteConfirm.value = true
}

function deleteSchedule(schedule: any) {
  alert(`Delete schedule with ID: ${schedule.id}`)
  showDeleteConfirm.value = false
  scheduleToDelete.value = null
}

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
