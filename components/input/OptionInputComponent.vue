<template>
  <div class="flex mb-6">
    <select
      id="wrap"
      v-model="wrapText"
      class="settings-section-background-color settings-section-border-color settings-ring-color settings-outline-color shadow-md block py-2.5 px-3 w-full border rounded-lg focus:ring-2"
    >
      <option
        v-for="option in wrapTextOptions"
        :key="option.id"
        :value="option.label"
      >
        {{ option.value }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
const wrapTextOptions = [
  { id: 'normal', label: 'normal', value: 'Normal' },
  { id: 'nowrap', label: 'nowrap', value: 'No Wrap' },
  { id: 'pre', label: 'pre', value: 'Pre' },
  { id: 'pre-wrap', label: 'pre-wrap', value: 'Pre-wrap' },
  { id: 'pre-line', label: 'pre-line', value: 'Pre-line' },
]

const props = defineProps<{
  wrapText: string
}>()

const emit = defineEmits(['update:modelValue'])

const wrapText = computed({
  get: () => props.wrapText,
  set: (value) => emit('update:modelValue', value),
})
</script>
