import { AuthInit } from '~/scripts/auth/authInit'
import { NuxtResponseAdapter } from '~/scripts/auth/responses/NuxtResponseAdapter'

export default defineEventHandler(async (event) => {
  const authInit = new AuthInit()
  const refreshToken = getCookie(event, 'rid')
  if (refreshToken === undefined) {
    deleteCookie(event, 'id')
    return { success: true, message: 'No refresh token found' }
  }

  try {
    const responseAdapter = new NuxtResponseAdapter(event)

    await authInit.authUtils.clearAuthCookies(responseAdapter, refreshToken)

    return { success: true, message: 'Tokens issued' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to issue tokens' }
  }
})
