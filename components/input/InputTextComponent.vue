<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-modal">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="inputValue"
      type="text"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :pattern="pattern"
      class="mt-1 block w-full p-2 border rounded-md text-input-modal"
      :class="{
        'border-invalid': hasRestrictedChars,
        'outline-valid': !hasRestrictedChars,
        'outline-invalid': hasRestrictedChars,
      }"
      @keyup="check"
    />
    <p v-if="hasRestrictedChars" class="text-red-500 text-sm mt-1">
      Invalid characters detected
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Text Input',
  },
  placeholder: {
    type: String,
    default: 'Enter a Text',
  },
  id: {
    type: String,
    default: 'text-input',
  },
  maxlength: {
    type: String,
    default: '100',
  },
  pattern: {
    type: String,
    default: '',
  },
  restrictedChars: {
    type: Array<string>,
    default: () => null,
  },
})

const emit = defineEmits(['update:modelValue', 'check'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const hasRestrictedChars = ref(false)
const restrictedChars = ref(props.restrictedChars)

function check() {
  if (inputValue.value.length < 2 && restrictedChars.value !== null) {
    hasRestrictedChars.value = restrictedChars.value.some((char) =>
      inputValue.value.includes(char),
    )
  } else {
    hasRestrictedChars.value = false
  }
  emit('check', !hasRestrictedChars.value)
}
</script>
