import type { RuntimeConfig } from 'nuxt/schema'
import { addRowsToDatabase } from '../backend/rowsOperations'
import {
  removeCourse,
  removeSettings,
  updateCourseRow,
} from '../backend/courseOperations'
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
  await addRowsToDatabase(scheduleId, rowsCount.value + 1, config).finally(
    () => {
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
    },
  )
}

export async function removeRow(
  rowIndex: number,
  scheduleId: string,
  config: RuntimeConfig,
) {
  if (rows.length <= 2) return

  for (const [key, course] of coursesList.entries()) {
    const [rIndex] = key.split('-').map(Number)
    if (rIndex === rowIndex) {
      await removeCourse(scheduleId, course.id, config).finally(() => {
        coursesList.delete(key)
      })
    }
  }

  for (const [key, settings] of cellAlignments.entries()) {
    const [rIndex] = key.split('-').map(Number)
    if (rIndex === rowIndex) {
      await removeSettings(scheduleId, settings.id, config).finally(() => {
        cellAlignments.delete(key)
      })
    }
  }

  for (const [key, course] of coursesList.entries()) {
    const [rIndex, cIndex] = key.split('-').map(Number)
    if (rIndex > rowIndex) {
      // Adjust key to move course up
      await updateCourseRow(scheduleId, course.id, rIndex - 1, config).finally(
        () => {
          const newKey = `${rIndex - 1}-${cIndex}`
          newCoursesList.set(newKey, course)
        },
      )
    } else {
      newCoursesList.set(key, course)
    }
  }

  cellAlignments.forEach((settings, key) => {
    const [rIndex, cIndex] = key.split('-').map(Number)
    if (rIndex > rowIndex) {
      // Adjust key to move setting up
      const newKey = `${rIndex - 1}-${cIndex}`
      newCellAlignments.set(newKey, settings)
    } else {
      newCellAlignments.set(key, settings)
    }
  })

  rows.splice(rowIndex, 1)
  coursesList.clear()
  cellAlignments.clear()
  newCoursesList.forEach((course, key) => coursesList.set(key, course))
  newCellAlignments.forEach((settings, key) =>
    cellAlignments.set(key, settings),
  )

  await addRowsToDatabase(scheduleId, rowsCount.value--, config).finally(() => {
    rowsCount.value--
    validateTable()
  })
}

export function createRows(initialRows: number, initialColumns: number) {
  if (initialRows < 2 && initialColumns < 2) {
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
