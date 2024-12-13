import { v4 as uuidv4 } from 'uuid'
import type { RuntimeConfig } from 'nuxt/schema'

export async function createUser(config: RuntimeConfig) {
  await $fetch(`${config.public.backend}/${config.public.api_link}/user`, {
    method: 'POST',
    body: {
      id: uuidv4(),
      name: 'Beered',
      email: 'beered',
      password_hash: uuidv4(),
    },
  }).catch((error) => {
    throw new Error("Couldn't create user " + error.data)
  })
}
