import { ref } from 'vue'
import { cellName } from '~/scripts/cellOperations'

const isModalOpen = ref(false)
const isSettingsModalOpen = ref(false)

function openSettings(initialCellName: string) {
  cellName.value = initialCellName
  isModalOpen.value = false
  isSettingsModalOpen.value = true
}

function closeSettingsModal(initialCellName: string) {
  cellName.value = initialCellName
  isSettingsModalOpen.value = false
  isModalOpen.value = true
}

export { isModalOpen, isSettingsModalOpen, openSettings, closeSettingsModal }
