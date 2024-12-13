import type { RuntimeConfig } from 'nuxt/schema'

export async function addColumnsToDatabase(
  scheduleId: string,
  columnsCount: number,
  config: RuntimeConfig,
) {
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/${config.public.schedule_link}/${scheduleId}/addColumn`,
    {
      method: 'POST',
      body: JSON.stringify({ id: scheduleId, columns: columnsCount }),
    },
  ).catch((error) => {
    throw new Error("Couldn't add columns to the database: " + error.data)
  })
}
