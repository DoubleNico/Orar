<template>
  <div class="flex mb-2 shadow-md">
    <input
      v-if="fontSizeValid"
      id="fontsize"
      ref="fontSizeValidInput"
      v-model="fontSize"
      type="number"
      min="8"
      max="128"
      list="defaultNumbers"
      class="settings-section-background-color settings-section-border-color settings-ring-color settings-outline-color w-full border rounded-lg px-4 py-2 focus:ring-2"
      required
      @input="checkNumber"
    />
    <input
      v-else
      id="fontsize"
      ref="fontSizeInvalidInput"
      v-model="fontSize"
      type="number"
      min="8"
      max="128"
      list="defaultNumbers"
      class="settings-section-background-color settings-invalid-button-color settings-ring-color settings-outline-color w-full border rounded-lg px-4 py-2 focus:ring-2"
      required
      @input="checkNumber"
    />
    <datalist id="defaultNumbers">
      <option
        v-for="option in fontSizeOptions"
        :key="option.value"
        :value="option.value"
      />
    </datalist>
  </div>
  <div class="flex justify-center mb-2">
    <span v-if="!fontSizeValid" class="settings-invalid-text-color text-sm ml-2"
      >Font size should be between 8 and 128</span
    >
  </div>
</template>

<script lang="ts" setup>
const fontSizeOptions = [
  { value: 8 },
  { value: 10 },
  { value: 12 },
  { value: 14 },
  { value: 16 },
  { value: 18 },
  { value: 20 },
  { value: 24 },
  { value: 30 },
  { value: 36 },
  { value: 48 },
  { value: 60 },
  { value: 72 },
  { value: 96 },
  { value: 128 },
]

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits(['update:modelValue', 'update:fontSizeValid'])

const fontSize = ref(props.modelValue)
const fontSizeValid = ref(true)
const fontSizeValidInput = useTemplateRef('fontSizeValidInput')
const fontSizeInvalidInput = useTemplateRef('fontSizeInvalidInput')

function checkNumber() {
  if (fontSize.value < 8 || fontSize.value > 128) {
    fontSizeValid.value = false
    emit('update:fontSizeValid', fontSizeValid.value)
    fontSizeInvalidInput.value?.focus()
  } else {
    fontSizeValid.value = true
    emit('update:fontSizeValid', fontSizeValid.value)
    fontSizeValidInput.value?.focus()
  }
}
watchEffect(() => {
  if (fontSizeValidInput.value && fontSizeValid.value)
    fontSizeValidInput.value?.focus()
  else if (fontSizeInvalidInput.value && !fontSizeValid.value)
    fontSizeInvalidInput.value?.focus()
})
</script>
