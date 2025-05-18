import type { RuntimeConfig } from 'nuxt/schema'
import { saveSettingsToDatabase } from '../backend/courseOperations'
import type { CellSettings } from './types/CellSettings'
import {
  cellAlignment,
  cellAlignments,
  fontColor,
  fontSize,
  modalColumn,
  modalRow,
  selectedColor,
  wrapText,
} from './state'
import { isModalOpen, isSettingsModalOpen } from './modal/modalState'

export async function saveSettings(
  settings: CellSettings,
  scheduleId: string,
  config: RuntimeConfig,
) {
  await saveSettingsToDatabase(settings, scheduleId, config)
  cellAlignments.set(`${modalRow.value}-${modalColumn.value}`, settings)
  selectedColor.value = settings.color
  cellAlignment.value = settings.alignment
  wrapText.value = settings.wrapText
  fontSize.value = settings.fontSize
  fontColor.value = settings.fontColor
  isSettingsModalOpen.value = false
  isModalOpen.value = true
}
