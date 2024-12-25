<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div
      class="background-modal w-full max-w-lg rounded-lg p-6 relative shadow-lg"
    >
      <button
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        title="Click to close"
        @click="closeModal"
      >
        &times;
      </button>

      <h2 v-if="title" class="text-xl font-bold mb-4">{{ title }}</h2>

      <div class="mb-4">
        <slot></slot>
      </div>

      <div
        class="flex"
        :class="{
          'justify-between': goBackCondition,
          'justify-end': !goBackCondition,
        }"
      >
        <button
          v-if="goBackCondition"
          class="text-white px-6 py-2 cursor-pointer rounded-md modal-button modal-button-hover shadow-md focus:outline-none"
          title="Click to go back"
          @click="goBack"
        >
          Go Back
        </button>
        <button
          v-if="!doneCondition"
          class="text-white px-6 py-2 rounded-md cursor-not-allowed modal-button-invalid modal-button-invalid-hover shadow-md focus:outline-none"
        >
          Done
        </button>
        <button
          v-if="doneCondition"
          class="text-white px-6 py-2 cursor-pointer rounded-md modal-button modal-button-hover shadow-md focus:outline-none"
          title="Click to finish"
          @click="done"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title',
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  goBackCondition: {
    type: Boolean,
    default: true,
  },
  doneCondition: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'done', 'close', 'goback'])

const isVisible = ref(props.modelValue)
const doneCondition = ref(props.doneCondition)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
  },
)

watch(
  () => props.doneCondition,
  (newVal) => {
    doneCondition.value = newVal
  },
)

watchEffect(() => {
  if (isVisible.value) {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }
  return null
})

function closeModal() {
  isVisible.value = false
  emit('update:modelValue', false)
  emit('close')
}

function done() {
  if (doneCondition.value) {
    emit('done')
    closeModal()
  }
}

function goBack() {
  emit('goback')
  closeModal()
}
</script>
