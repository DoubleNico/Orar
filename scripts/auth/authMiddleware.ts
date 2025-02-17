import {
  parseCookies,
  createError,
  type H3Event,
  type EventHandlerRequest,
} from 'h3'
import type { RuntimeConfig } from 'nuxt/schema'
import { getUser } from '../backend/usersOperations'
import type { AuthUtils } from './authUtils'
import { NuxtResponseAdapter } from './responses/NuxtResponseAdapter'

class AuthMiddleware {
  private authUtils: AuthUtils

  constructor(authUtils: AuthUtils) {
    this.authUtils = authUtils
  }

  public async handle(
    event: H3Event<EventHandlerRequest> | null,
    config: RuntimeConfig,
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
      const responseAdapter = new NuxtResponseAdapter(event)

      const user = await getUser(config, userId)
      if (!user) {
        await this.authUtils.clearAuthCookies(responseAdapter, refreshToken)
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        })
      }

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
