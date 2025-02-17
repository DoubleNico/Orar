import { v4 as uuidv4 } from 'uuid'
import type { RuntimeConfig } from 'nuxt/schema'
import type { User } from './types/User'

export async function createUser(
  config: RuntimeConfig,
  username: string,
  email: string,
  password: string,
): Promise<string> {
  const id = uuidv4()
  await $fetch(
    `${config.public.backend}/${config.public.api_link}/user/create`,
    { method: 'POST', body: { id, name: username, email, password } },
  ).catch((error) => {
    throw new Error("Couldn't create user " + error.data)
  })
  return id
}

export async function checkPassword(
  config: RuntimeConfig,
  username: string,
  password: string,
): Promise<User | null> {
  try {
    const response = await $fetch<User>(
      `${config.public.backend}/${config.public.api_link}/user`,
      { method: 'GET', body: { name: username, password } },
    )
    return response // return the user
  } catch (error) {
    console.error("Couldn't find user", error)
    return null
  }
}
