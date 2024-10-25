<template>
  <ModalBase
    v-model="isVisible"
    title="Cell Information"
    :go-back-condition="false"
    :done-condition="!hasRestrictedChars"
    @done="done"
    @close="closeModal"
  >
    <p class="mb-2">Row: {{ row + 1 }}</p>
    <p class="mb-2">Column: {{ column + 1 }}</p>

    <div>
      <label for="cell-content" class="block text-sm font-medium">
        Cell Content
      </label>
      <textarea
        id="cell-content"
        v-model="cellName"
        rows="4"
        class="cellinformation-textarea-text-color cellinformation-textarea-background-color cellinformation-textarea-border-color cellinformation-textarea-border-focus-color cellinformation-textarea-border-ring-color cellinformation-textarea-border-outline-color mt-1 block w-full rounded-md shadow-sm sm:text-sm resize-none"
        placeholder="Enter cell content"
        maxlength="200"
        required
        @input="validateInput"
      ></textarea>
      <p
        v-if="hasRestrictedChars"
        class="cellinformation-textarea-invalid-text-color mt-1"
      >
        Invalid input!
      </p>
    </div>

    <div class="flex justify-between">
      <button
        v-if="cellName && cellName.trim() !== ''"
        class="cellinformation-textarea-invalid-background-color cellinformation-textarea-invalid-background-hover-color mt-4 py-2 px-4 rounded"
        @click="deleteCellContent"
      >
        Delete Cell Content
      </button>
      <button
        v-if="column !== 0 || row !== 0 || cell === 'd'"
        class="cellinformation-textarea-invalid-background-color cellinformation-textarea-invalid-background-hover-color mt-4 py-2 px-4 rounded"
        @click="deleteCell"
      >
        Delete Entire Cell
      </button>
    </div>

    <br />
    <div>
      <button
        v-if="!hasRestrictedChars"
        class="cellinformation-settings-backgroud-color cellinformation-settings-backgroud-color-hover mt-4 py-2 px-4 rounded"
        @click="openSettings"
      >
        Settings
      </button>
      <button
        v-if="hasRestrictedChars"
        class="cellinformation-settings-invalid-backgroud-color cellinformation-settings-invalid-backgroud-color-hover mt-4 py-2 px-4 rounded cursor-not-allowed"
      >
        Settings
      </button>
    </div>
  </ModalBase>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import ModalBase from './ModalBase.vue'

const props = defineProps({
  row: {
    type: Number,
    required: true,
  },
  column: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  cell: {
    type: String,
    default: '',
  },
  initialCellName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'update:modelValue',
  'saveCellContent',
  'deleteCell',
  'deleteCellContent',
  'openSettings',
])

const isVisible = ref(props.modelValue)
const cellName = ref('')
const hasRestrictedChars = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
    if (newVal) {
      cellName.value = props.initialCellName
    }
  },
)

function validateInput() {
  if (cellName.value.length < 2) {
    hasRestrictedChars.value =
      cellName.value.startsWith('d') ||
      cellName.value.startsWith('1') ||
      cellName.value.startsWith('0') ||
      cellName.value.startsWith('+')
  } else {
    hasRestrictedChars.value = false
  }
}

function done() {
  if (!hasRestrictedChars.value) {
    emit('saveCellContent', cellName.value)
    isVisible.value = false
    emit('update:modelValue', false)
  }
}

function closeModal() {
  hasRestrictedChars.value = false
  isVisible.value = false
  emit('update:modelValue', false)
}

function deleteCellContent() {
  emit('deleteCellContent')
  cellName.value = ''
  hasRestrictedChars.value = false
  isVisible.value = false
}

function deleteCell() {
  emit('deleteCell')
  cellName.value = ''
  hasRestrictedChars.value = false
  isVisible.value = false
}

function openSettings() {
  emit('saveCellContent', cellName.value)
  emit('openSettings', cellName.value)
}
</script>
