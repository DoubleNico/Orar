<template>
  <div
    class="settings-section-background-color settings-section-border-color flex justify-between items-center shadow-md mb-6 border h-12 rounded-lg"
  >
    <br />
    <input
      id="cellcolor"
      ref="cellColor"
      v-model="selectedBackgroundColor"
      type="color"
      name="cellcolor"
      title="Select background color for the cell"
      class="settings-ring-color color-input w-[90%] rounded-lg border settings-section-border-color focus:outline-none focus:ring-2"
      :style="{
        backgroundColor: selectedBackgroundColor,
      }"
      :class="{
        hidden: selectedBackgroundColor === '',
      }"
    />
    <button
      v-if="selectedBackgroundColor === ''"
      class="settings-ring-color w-[90%] h-7 rounded-lg border settings-section-border-color focus:outline-none focus:ring-2"
      title="Click to set the background color"
      @click="setBackgroundColor"
    ></button>
    <button
      class="hover:text-gray-400"
      title="Clear the background color"
      @click="clearBackgroundColor"
    >
      Clear
    </button>
    <br />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  selectedBackgroundColor: string
}>()

const emit = defineEmits(['update:modelValue'])

const selectedBackgroundColor = computed({
  get: () => props.selectedBackgroundColor,
  set: (value) => emit('update:modelValue', value),
})

const cellColor = useTemplateRef('cellColor')

function clearBackgroundColor() {
  selectedBackgroundColor.value = ''
}
function setBackgroundColor() {
  selectedBackgroundColor.value = '#000000'
  nextTick(() => {
    cellColor.value?.focus()
    cellColor.value?.click()
  })
}
</script>

<style scoped>
.color-input {
  appearance: none;
  -webkit-appearance: none;
  border: none;
}
.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}
.color-input::-webkit-color-swatch {
  border: none;
}
</style>
