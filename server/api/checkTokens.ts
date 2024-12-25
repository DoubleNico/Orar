import { AuthInit } from '~/scripts/auth/authInit'
import AuthMiddleware from '~/scripts/auth/authMiddleware'

export default defineEventHandler(async (event) => {
  const authInit = new AuthInit()
  const authMiddleware = new AuthMiddleware(authInit.authUtils)

  try {
    await authMiddleware.handle(event)
    return {
      success: true,
      userId: event.context.userId ?? null,
      newAccessToken: event.context.newAccessToken ?? null,
    }
  } catch (error) {
    return {
      success: false,
      userId: null,
      newAccessToken: null,
    }
  }
})
