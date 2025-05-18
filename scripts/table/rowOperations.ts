import type { RuntimeConfig } from 'nuxt/schema'
import { addRowsToDatabase } from '../backend/rowsOperations'
import { saveTableState } from '../backend/tableOperations'
import { removeCourses, removeSettings } from '../backend/courseOperations'
import {
  cellAlignments,
  columnsCount,
  coursesList,
  newCellAlignments,
  newCoursesList,
  rows,
  rowsCount,
} from './state'
import { validateTable } from './tableOperations'

export async function addRow(scheduleId: string, config: RuntimeConfig) {
  await addRowsToDatabase(scheduleId, rowsCount.value + 1, config)

  if (rows.length > 0) {
    rows[rows.length - 1][0] = '1'
  }

  const numberOfColumns = rows[0].length
  const newRow = new Array(numberOfColumns).fill('1')
  newRow[0] = '+'
  newRow[numberOfColumns - 1] = '0'
  rows.push(newRow)
  rowsCount.value++
  validateTable()
}

export async function removeRow(
  rowIndex: number,
  scheduleId: string,
  config: RuntimeConfig,
) {
  if (rows.length <= 2) return

  const coursesToRemove: string[] = []
  const settingsToRemove: string[] = []

  for (const [key, course] of coursesList.entries()) {
    const [rIndexStr] = key.split('-')
    const rIndex = parseInt(rIndexStr)
    if (rIndex === rowIndex) {
      coursesToRemove.push(course.id)
    }
  }

  for (const [key, settings] of cellAlignments.entries()) {
    const [rIndexStr] = key.split('-')
    const rIndex = parseInt(rIndexStr)
    if (rIndex === rowIndex) {
      settingsToRemove.push(settings.id)
    }
  }

  await Promise.all([
    removeCourses(scheduleId, coursesToRemove, config),
    removeSettings(scheduleId, settingsToRemove, config),
  ])

  for (const key of Array.from(coursesList.keys())) {
    const [rIndexStr] = key.split('-')
    const rIndex = parseInt(rIndexStr)
    if (rIndex === rowIndex) {
      coursesList.delete(key)
    }
  }

  for (const key of Array.from(cellAlignments.keys())) {
    const [rIndexStr] = key.split('-')
    const rIndex = parseInt(rIndexStr)
    if (rIndex === rowIndex) {
      cellAlignments.delete(key)
    }
  }

  newCoursesList.clear()
  for (const [key, course] of coursesList.entries()) {
    const [rIndexStr, cIndexStr] = key.split('-')
    const rIndex = parseInt(rIndexStr)
    const cIndex = parseInt(cIndexStr)
    const newKey = rIndex > rowIndex ? `${rIndex - 1}-${cIndex}` : key

    const originalSettings = cellAlignments.get(key)
    if (originalSettings) {
      newCellAlignments.set(newKey, originalSettings)
      course.settings = originalSettings
    }

    newCoursesList.set(newKey, course)
  }

  newCellAlignments.clear()
  for (const [key, settings] of cellAlignments.entries()) {
    const [rIndexStr, cIndexStr] = key.split('-')
    const rIndex = parseInt(rIndexStr)
    const cIndex = parseInt(cIndexStr)
    const newKey = rIndex > rowIndex ? `${rIndex - 1}-${cIndex}` : key
    newCellAlignments.set(newKey, settings)
  }

  coursesList.clear()
  newCoursesList.forEach((val, key) => coursesList.set(key, val))

  cellAlignments.clear()
  newCellAlignments.forEach((val, key) => cellAlignments.set(key, val))

  console.log('Courses list:', coursesList)
  console.log('Cell alignments:', cellAlignments)

  rows.splice(rowIndex, 1)
  rowsCount.value--
  validateTable()
  await saveTableState(scheduleId, config)
}

export function createRows(initialRows: number, initialColumns: number) {
  if (initialRows < 1 && initialColumns < 1) {
    rows.length = 0
    rows.push(['1', '+'])
    rows.push(['+', '0'])
    return
  }

  rows.length = 0
  rowsCount.value = initialRows
  columnsCount.value = initialColumns
  for (let rowIndex = 0; rowIndex < initialRows + 1; rowIndex++) {
    const newRow = Array(initialColumns + 1).fill('1')

    if (rowIndex === 0) {
      newRow[initialColumns] = '+'
    } else if (rowIndex === initialRows) {
      newRow[0] = '+'
    } else {
      newRow[initialColumns] = '0'
    }

    rows.push(newRow)
  }

  validateTable()
}
