import { z } from 'zod'
import { AuthInit } from '~/scripts/auth/authInit'
import { NuxtResponseAdapter } from '~/scripts/auth/responses/NuxtResponseAdapter'
import { checkPassword } from '~/scripts/backend/usersOperations'

const userSchema = z.object({
  username: z.string(),
  password: z.string().min(2),
})

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    userSchema.safeParse(body),
  )
  if (!result.success) throw result.error.issues
  const oldRefreshToken = getCookie(event, 'rid')
  const authInit = new AuthInit()
  const config = useRuntimeConfig()

  const user = await checkPassword(
    config,
    result.data.username,
    result.data.password,
  )
  if (!user) {
    return { success: false, message: 'Invalid credentials' }
  }

  try {
    const responseAdapter = new NuxtResponseAdapter(event)

    await authInit.authUtils.sendAuthCookies(
      responseAdapter,
      user.id,
      oldRefreshToken,
    )

    return { success: true, message: 'Tokens issued' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to issue tokens' }
  }
})
