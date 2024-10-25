<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-modal">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="inputValue"
      type="number"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      class="mt-1 block w-40 p-2 border border-input-modal border-input-modal-focus rounded-md text-input-modal"
      :class="{
        'bg-red-400': !inputValueValid,
        'bg-white': inputValueValid,
      }"
      @input="checkNumber"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  label: {
    type: String,
    default: 'Number Input',
  },
  placeholder: {
    type: String,
    default: 'Enter a number',
  },
  id: {
    type: String,
    default: 'number-input',
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['update:modelValue', 'input-validity'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
const inputValueValid = ref(true)

function checkNumber() {
  if (inputValue.value < props.min || inputValue.value > props.max) {
    inputValueValid.value = false
  } else {
    inputValueValid.value = true
  }
  emit('input-validity', inputValueValid.value)
}
</script>
