import {
  parseCookies,
  createError,
  type H3Event,
  type EventHandlerRequest,
} from 'h3'
import type { AuthUtils } from './authUtils'

class AuthMiddleware {
  private authUtils: AuthUtils

  constructor(authUtils: AuthUtils) {
    this.authUtils = authUtils
  }

  public async handle(
    event: H3Event<EventHandlerRequest> | null,
  ): Promise<void> {
    if (!event) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const cookies = parseCookies(event)
    const accessToken = cookies.id
    const refreshToken = cookies.rid

    try {
      const { userId, newAccessToken } = await this.authUtils.checkTokens(
        accessToken,
        refreshToken,
      )

      if (!event.context) {
        event.context = {}
      }
      event.context.userId = userId
      if (newAccessToken) {
        event.context.newAccessToken = newAccessToken
      }
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
  }
}

export default AuthMiddleware
