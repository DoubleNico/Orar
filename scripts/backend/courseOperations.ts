import { v4 as uuidv4 } from 'uuid'
import type { RuntimeConfig } from 'nuxt/schema'
import type { Course } from './types/Course'
import type { CellSettings } from '~/scripts/table/types/CellSettings'

export async function saveCourseToDatabase(
  scheduleId: string,
  courseName: string,
  row: number,
  column: number,
  settingsId: string,
  config: RuntimeConfig,
) {
  const id = uuidv4()
  const userStore = useUserStore()
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/course`,
    {
      method: 'POST',
      body: {
        id,
        title: courseName,
        row,
        column,
        creator: userStore.userId,
        settings: settingsId,
        start: 1,
        end: 2,
      },
    },
  ).catch((error) => {
    throw new Error('Failed to save course:' + error.data)
  })
  await saveScheduleCourseRelation(scheduleId, id, config)
}

export async function saveScheduleCourseRelation(
  scheduleId: string,
  courseId: string,
  config: RuntimeConfig,
) {
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/schedule_courses`,
    {
      method: 'POST',
      body: {
        schedule_id: scheduleId,
        course_id: courseId,
      },
    },
  ).catch((error) => {
    throw new Error('Failed to save schedule course relation:' + error.data)
  })
}

export async function saveSettingsToDatabase(
  settings: CellSettings,
  scheduleId: string,
  config: RuntimeConfig,
): Promise<string> {
  const response = await $fetch<{ id: string }>(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/course_settings`,
    {
      method: 'POST',
      body: {
        id: settings.id,
        color: settings.color,
        alignment: settings.alignment,
        fontSize: settings.fontSize,
        fontColor: settings.fontColor,
      },
    },
  ).catch((error) => {
    throw new Error('Failed to save settings:' + error.data)
  })

  return response.id
}

export async function getCourses(
  scheduleId: string,
  config: RuntimeConfig,
): Promise<Course[]> {
  const response = await $fetch<Course[]>(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/get/courses`,
    {
      method: 'GET',
    },
  ).catch((error) => {
    throw new Error('Failed to fetch courses:' + error.data)
  })
  return response
}

export async function getSettings(
  scheduleId: string,
  config: RuntimeConfig,
): Promise<CellSettings[]> {
  const response = await $fetch<CellSettings[]>(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/get/settings`,
    {
      method: 'GET',
    },
  ).catch((error) => {
    throw new Error('Failed to fetch settings:' + error.data)
  })
  return response
}

export async function removeCourse(
  scheduleId: string,
  courseId: string,
  config: RuntimeConfig,
) {
  if (!courseId) {
    return
  }
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/deleteCourse/${courseId}`,
    {
      method: 'DELETE',
    },
  ).catch((error) => {
    throw new Error('Failed to remove course:' + error.data)
  })
}

export async function removeSettings(
  scheduleId: string,
  settingsId: string,
  config: RuntimeConfig,
) {
  if (!settingsId) {
    return
  }
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/deleteSettings/${settingsId}`,
    {
      method: 'DELETE',
    },
  ).catch((error) => {
    throw new Error('Failed to remove settings:' + error.data)
  })
}

export async function updateCourseColumn(
  scheduleId: string,
  courseId: string,
  column: number,
  config: RuntimeConfig,
) {
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/updateCourseColumn/${courseId}`,
    {
      method: 'PUT',
      body: { column },
    },
  ).catch((error) => {
    throw new Error('Failed to update course column:' + error.data)
  })
}

export async function updateCourseRow(
  scheduleId: string,
  courseId: string,
  row: number,
  config: RuntimeConfig,
) {
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/updateCourseRow/${courseId}`,
    {
      method: 'PUT',
      body: { row },
    },
  ).catch((error) => {
    throw new Error('Failed to update course row:' + error.data)
  })
}
