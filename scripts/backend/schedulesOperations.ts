import type { RuntimeConfig } from 'nuxt/schema'
import type { Schedule } from './types/Schedule'

export async function getSchedules(
  config: RuntimeConfig,
  creator: string,
): Promise<Schedule[]> {
  try {
    const response = await $fetch<{ schedules: Schedule[] }>(
      `${config.public.backend}/${config.public.api_link}/getSchedules`,
      {
        method: 'GET',
        params: { creator },
      },
    )
    return response.schedules
  } catch (error) {
    console.error("Couldn't fetch schedules", error)
    return []
  }
}
