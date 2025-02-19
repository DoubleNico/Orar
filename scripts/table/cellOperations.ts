import type { RuntimeConfig } from 'nuxt/schema'
import { removeCourse, saveCourseToDatabase } from '../backend/courseOperations'
import { isModalOpen } from './modal/modalState'
import {
  cellAlignments,
  cellName,
  coursesList,
  modalColumn,
  modalRow,
  rows,
} from './state'

export async function addCell(
  scheduleId: string,
  config: RuntimeConfig,
  rowIndex: number,
  colIndex: number,
) {
  await removeCourse(
    scheduleId,
    coursesList.get(`${rowIndex}-${colIndex}`)?.id || '',
    config,
  ).finally(() => {
    rows[rowIndex][colIndex] = '1'
    isModalOpen.value = false
  })
}

export async function deleteCell(scheduleId: string, config: RuntimeConfig) {
  if (rows.length > 2 && rows[modalRow.value].length > 2) {
    await removeCourse(
      scheduleId,
      coursesList.get(`${modalRow.value}-${modalColumn.value}`)?.id || '',
      config,
    ).finally(() => {
      rows[modalRow.value][modalColumn.value] = 'd'
      const key = `${modalRow.value}-${modalColumn.value}`
      cellAlignments.delete(key)
      cellName.value = ''
      isModalOpen.value = false
      saveCourseToDatabase(
        scheduleId,
        'd',
        modalRow.value,
        modalColumn.value,
        '',
        config,
      )
    })
  }
}

export function deleteCellContent() {
  rows[modalRow.value][modalColumn.value] = '1'
  cellName.value = ''
  isModalOpen.value = false
}

export async function updateCellContent(
  newContent: string,
  scheduleId: string,
  config: RuntimeConfig,
) {
  rows[modalRow.value][modalColumn.value] = newContent || '1'
  await saveCourseToDatabase(
    scheduleId,
    newContent,
    modalRow.value,
    modalColumn.value,
    cellAlignments.get(`${modalRow.value}-${modalColumn.value}`)?.id || '',
    config,
  )
}
