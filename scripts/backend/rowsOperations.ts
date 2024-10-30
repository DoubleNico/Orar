import type { RuntimeConfig } from 'nuxt/schema'

export async function addRowsToDatabase(
  scheduleId: string,
  rowsCount: number,
  config: RuntimeConfig,
) {
  try {
    await $fetch(
      `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/addRow`,
      {
        method: 'POST',
        body: JSON.stringify({ id: scheduleId, rows: rowsCount }),
      },
    )
  } catch (error) {
    throw new Error('Failed to add row')
  }
}
