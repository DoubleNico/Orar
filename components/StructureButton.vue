<template>
  <div id="create-schedule-button" class="flex justify-center mt-10">
    <button
      class="structure-button px-6 py-3 rounded-md focus:outline-none"
      @click="showModal = true"
    >
      Create Schedule
    </button>
    <ModalBase
      v-model="showModal"
      title="Create New Schedule"
      :go-back-condition="false"
      :done-condition="inputValuesValid"
      @done="handleDone"
      @close="handleClose"
    >
      <InputTextComponent
        id="schedule-name"
        v-model="scheduleName"
        label="Schedule Name"
        placeholder="Enter schedule name"
        @check="check"
      />
      <br />
      <div class="flex justify-between">
        <NumberInputComponent
          id="rows"
          v-model="rows"
          label="Insert Rows"
          :min="1"
          @input-validity="setRowsValidity"
        />
        <NumberInputComponent
          id="columns"
          v-model="columns"
          label="Insert Columns"
          :min="1"
          @input-validity="setColumnsValidity"
        />
      </div>
    </ModalBase>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { nanoid } from 'nanoid'
import NumberInputComponent from './input/NumberInputComponent.vue'

const rows = ref(1)
const columns = ref(1)
const showModal = ref(false)
const scheduleName = ref('')

const rowsValid = ref(true)
const scheduleNameValid = ref(true)
const columnsValid = ref(true)

function setRowsValidity(isValid: boolean) {
  rowsValid.value = isValid
}

function setColumnsValidity(isValid: boolean) {
  columnsValid.value = isValid
}

const inputValuesValid = computed(
  () =>
    rowsValid.value &&
    columnsValid.value &&
    scheduleNameValid.value &&
    scheduleName.value.length > 0,
)

// Use the Vue Router
const router = useRouter()

// Handle the "Done" button action
function handleDone() {
  if (inputValuesValid.value) {
    // Generate a new UUID
    const id = nanoid(15)
    // Prepare schedule data
    const scheduleData = {
      id,
      name: scheduleName.value,
      rows: rows.value,
      columns: columns.value,
    }

    // Option 1: Store the scheduleData in localStorage (temporary storage)
    localStorage.setItem(`schedule-${id}`, JSON.stringify(scheduleData))

    // Option 2: Use a state management solution like Vuex or Pinia (if needed)

    // Navigate to /tables/[id] with the new UUID
    router.push(`/tables/${id}`)
  }
}
function handleClose() {
  scheduleName.value = ''
}

function check(isValid: boolean) {
  scheduleNameValid.value = isValid
}
</script>
