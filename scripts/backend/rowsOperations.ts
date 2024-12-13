import type { RuntimeConfig } from 'nuxt/schema'

export async function addRowsToDatabase(
  scheduleId: string,
  rowsCount: number,
  config: RuntimeConfig,
) {
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/addRow`,
    {
      method: 'POST',
      body: JSON.stringify({ id: scheduleId, rows: rowsCount }),
    },
  ).catch((error) => {
    throw new Error("Couldn't add rows to the database: " + error.data)
  })
}
