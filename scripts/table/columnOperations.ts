import type { RuntimeConfig } from 'nuxt/schema'
import { addColumnsToDatabase } from '../backend/columnsOperations'
import {
  removeCourse,
  removeSettings,
  updateCourseColumn,
} from '../backend/courseOperations'
import type { Course } from '../backend/types/Course'
import { cellAlignments, columnsCount, coursesList, rows } from './state'
import { validateTable } from './tableOperations'
import type { CellSettings } from './types/CellSettings'

export async function addColumn(scheduleId: string, config: RuntimeConfig) {
  await addColumnsToDatabase(
    scheduleId,
    columnsCount.value + 1,
    config,
  ).finally(() => {
    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0) {
        row.splice(row.length - 1, 0, '1')
      } else if (rowIndex < rows.length) {
        row.splice(row.length - 1, 0, '1')
      } else {
        row.splice(row.length - 1, 0, '0')
      }
    })
    columnsCount.value++
    validateTable()
  })
}

export async function removeColumn(
  colIndex: number,
  scheduleId: string,
  config: RuntimeConfig,
) {
  if (rows[0].length <= 2) return

  for (const [key, course] of coursesList.entries()) {
    const [, cIndex] = key.split('-').map(Number)
    if (cIndex === colIndex) {
      // Remove the course from database and list
      await removeCourse(scheduleId, course.id, config).finally(() => {
        coursesList.delete(key)
      })
    }
  }

  for (const [key, settings] of cellAlignments.entries()) {
    const [, cIndex] = key.split('-').map(Number)
    if (cIndex === colIndex) {
      // Remove the settings from database and map
      await removeSettings(scheduleId, settings.id, config).finally(() => {
        cellAlignments.delete(key)
      })
    }
  }

  const newCoursesList = new Map<string, Course>()
  const newCellAlignments = new Map<string, CellSettings>()

  for (const [key, course] of coursesList.entries()) {
    const [rIndex, cIndex] = key.split('-').map(Number)
    if (cIndex > colIndex) {
      // Adjust key to move course left

      // Optionally update course's column in the database if necessary
      await updateCourseColumn(
        scheduleId,
        course.id,
        cIndex - 1,
        config,
      ).finally(() => {
        const newKey = `${rIndex}-${cIndex - 1}`
        newCoursesList.set(newKey, course)
      })
    } else {
      newCoursesList.set(key, course)
    }
  }

  for (const [key, settings] of cellAlignments.entries()) {
    const [rIndex, cIndex] = key.split('-').map(Number)
    if (cIndex > colIndex) {
      // Adjust key to move setting left
      const newKey = `${rIndex}-${cIndex - 1}`
      newCellAlignments.set(newKey, settings)
    } else {
      newCellAlignments.set(key, settings)
    }
  }

  rows.forEach((row) => row.splice(colIndex, 1))
  coursesList.clear()
  cellAlignments.clear()
  newCoursesList.forEach((course, key) => coursesList.set(key, course))
  newCellAlignments.forEach((settings, key) =>
    cellAlignments.set(key, settings),
  )

  await addColumnsToDatabase(scheduleId, --columnsCount.value, config).finally(
    () => {
      --columnsCount.value
      validateTable()
    },
  )
}
