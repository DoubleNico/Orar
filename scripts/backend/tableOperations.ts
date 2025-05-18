import type { RuntimeConfig } from 'nuxt/schema'
import {
  coursesList,
  columnsCount,
  rowsCount,
  cellAlignments,
} from '../table/state'

import type { Course } from './types/Course'
import type { CourseSettings } from './types/CourseSettings'

export async function saveTableState(
  scheduleId: string,
  config: RuntimeConfig,
) {
  const courses: Course[] = []
  for (const [key, course] of coursesList.entries()) {
    const [row, column] = key.split('-').map(Number)
    const courseData = {
      ...course,
      row,
      column,
    }
    courses.push(courseData)
  }
  const coursesSettings: CourseSettings[] = []
  for (const settings of cellAlignments.values()) {
    const settingsData = {
      ...settings,
    }
    coursesSettings.push(settingsData)
  }

  console.log('Courses settings:', coursesSettings)
  console.log('Courses:', courses)

  try {
    await $fetch(
      `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/saveTable`,
      {
        method: 'POST',
        body: {
          courses,
          coursesSettings,
          rows: rowsCount.value,
          columns: columnsCount.value,
        },
      },
    )
    console.log('Courses saved successfully')
  } catch (error) {
    console.error('Failed to save courses:', error)
    throw error
  }
}
