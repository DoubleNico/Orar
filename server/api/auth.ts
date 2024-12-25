import { AuthInit } from '~/scripts/auth/authInit'
import { NuxtResponseAdapter } from '~/scripts/auth/responses/NuxtResponseAdapter'

export default defineEventHandler(async (event) => {
  const oldRefreshToken = getCookie(event, 'rid')
  const authInit = new AuthInit()

  try {
    const responseAdapter = new NuxtResponseAdapter(event)

    await authInit.authUtils.sendAuthCookies(
      responseAdapter,
      '123',
      oldRefreshToken,
    )

    return { success: true, message: 'Tokens issued' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to issue tokens' }
  }
})
