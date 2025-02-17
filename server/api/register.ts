import { z } from 'zod'
import { AuthInit } from '~/scripts/auth/authInit'
import { NuxtResponseAdapter } from '~/scripts/auth/responses/NuxtResponseAdapter'
import { createUser } from '~/scripts/backend/usersOperations'

const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(2),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const result = await readValidatedBody(event, (body) =>
    userSchema.safeParse(body),
  )
  if (!result.success) throw result.error.issues
  const user = result.data
  const userId = await createUser(
    config,
    user.username,
    user.email,
    user.password,
  )
  const authInit = new AuthInit()
  const oldRefreshToken = getCookie(event, 'rid')
  try {
    const responseAdapter = new NuxtResponseAdapter(event)

    await authInit.authUtils.sendAuthCookies(
      responseAdapter,
      userId,
      oldRefreshToken,
    )

    return { success: true, message: 'Tokens issued' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to issue tokens' }
  }
})
