<template>
  <ModalBase
    v-model="isVisible"
    title="Settings"
    :go-back-condition="fontSizeValid"
    :done-condition="fontSizeValid"
    @goback="closeAndEmit('goback')"
    @close="closeAndEmit('goback')"
    @done="saveSettings"
  >
    <!-- Cell Color Section -->
    <div class="mb-3">
      <label for="cellcolor" class="settings-label-color text-lg font-medium">
        Cell Color:
      </label>
    </div>

    <ColorInputComponent
      v-model="selectedBackgroundColor"
      :selected-background-color="selectedBackgroundColor"
    />

    <!-- Text Alignment Section -->
    <div class="mb-6">
      <label class="settings-label-color text-lg font-medium mb-3 block"
        >Text Wrap:</label
      >
      <RadioInputComponent
        v-model="cellAlignment"
        :cell-alignment="cellAlignment"
      />
    </div>

    <!-- Text Wrap Section -->
    <div class="mb-2">
      <label for="wrap" class="settings-label-color text-lg font-medium">
        Wrap Text:
      </label>
    </div>
    <OptionInputComponent v-model="wrapText" :wrap-text="wrapText" />

    <!-- Font Size Section -->
    <div class="mb-2">
      <label for="fontsize" class="settings-label-color text-lg font-medium">
        Font Size:
      </label>
    </div>
    <FontInputComponent
      v-model="fontSize"
      @update:font-size-valid="fontSizeValid = $event"
    />

    <!-- Font Color Section -->
    <div class="mb-3">
      <label for="fontcolor" class="settings-label-color text-lg font-medium">
        Font Color:
      </label>
    </div>
    <ColorInputComponent
      v-model="selectedFontColor"
      :selected-background-color="selectedFontColor"
    />
  </ModalBase>
</template>

<script lang="ts" setup>
import type { RuntimeConfig } from 'nuxt/schema'
import { ref, watch } from 'vue'
import RadioInputComponent from '../input/RadioInputComponent.vue'
import OptionInputComponent from '../input/OptionInputComponent.vue'
import FontInputComponent from '../input/FontInputComponent.vue'
import ModalBase from './ModalBase.vue'
import type { CellSettings } from '~/scripts/cellSettings'
import ColorInputComponent from '~/components/input/ColorInputComponent.vue'

const props = defineProps<{
  modelValue: boolean
  initialSettings: CellSettings
  initialCellName: string
  scheduleId: string
  config: RuntimeConfig
}>()

const emit = defineEmits(['update:modelValue', 'done', 'goback', 'save'])

const isVisible = ref(props.modelValue)
const selectedBackgroundColor = ref(props.initialSettings.color)
const cellAlignment = ref(props.initialSettings.alignment)
const wrapText = ref(props.initialSettings.wrapText)
const fontSize = ref(props.initialSettings.fontSize)
const selectedFontColor = ref(props.initialSettings.fontColor)
const cellName = ref(props.initialCellName)
const fontSizeValid = ref(true)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
    if (newVal) {
      selectedBackgroundColor.value = props.initialSettings.color
      cellAlignment.value = props.initialSettings.alignment
      wrapText.value = props.initialSettings.wrapText
      fontSize.value = props.initialSettings.fontSize
      cellName.value = props.initialCellName
      selectedFontColor.value = props.initialSettings.fontColor
    }
  },
)

function saveSettings() {
  fontSizeValid.value = true
  emit(
    'save',
    {
      id: props.initialSettings.id,
      color: selectedBackgroundColor.value,
      alignment: cellAlignment.value,
      wrapText: wrapText.value,
      fontSize: fontSize.value,
      fontColor: selectedFontColor.value,
    },
    props.scheduleId,
    props.config,
  )
  emit('update:modelValue', false)
}

function closeAndEmit(event: 'goback') {
  isVisible.value = false
  emit(event, cellName.value)
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
