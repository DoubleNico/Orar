<template>
  <div>
    <ul
      class="settings-section-background-color settings-section-border-color shadow-md w-full text-sm font-medium border rounded-lg sm:flex"
    >
      <li
        v-for="option in alignmentOptions"
        :key="option.value"
        class="settings-section-border-color w-full border-b sm:border-b-0 sm:border-r"
      >
        <div class="flex justify-center items-center ps-3">
          <input
            :id="option.id"
            v-model="cellAlignment"
            type="radio"
            :value="option.value"
            name="list-radio"
            class="settings-section-background-color settings-section-border-color settings-ring-color settings-accent-color w-4 h-4 focus:ring-2"
          />
          <label
            :for="option.id"
            class="w-full py-3 ms-2 text-sm font-medium"
            >{{ option.label }}</label
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const alignmentOptions = [
  { id: 'left', value: 'left', label: 'Left' },
  { id: 'center', value: 'center', label: 'Center' },
  { id: 'right', value: 'right', label: 'Right' },
]

const props = defineProps<{
  cellAlignment: string
}>()

const emit = defineEmits(['update:modelValue'])

const cellAlignment = computed({
  get: () => props.cellAlignment,
  set: (value) => emit('update:modelValue', value),
})
</script>
