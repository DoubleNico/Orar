import { AuthUtils } from './authUtils'
import { RedisClient } from './redisClient'

const redisClient = new RedisClient()
const authUtils = new AuthUtils(
  redisClient,
  process.env.ACCESS_TOKEN_SECRET!,
  process.env.REFRESH_TOKEN_SECRET!,
  process.env.ACCESS_TOKEN_EXPIRATION,
  process.env.REFRESH_TOKEN_EXPIRATION,
  process.env.HTTP_ONLY === 'true',
  process.env.SAME_SITE as 'lax' | 'strict' | 'none',
  process.env.AUTH_PATH,
  process.env.IS_PRODUCTION === 'true',
  process.env.DOMAIN,
)

class AuthInit {
  private _authUtils: AuthUtils
  private _redisClient: RedisClient

  constructor() {
    this._authUtils = authUtils
    this._redisClient = redisClient
  }

  public get authUtils(): AuthUtils {
    return this._authUtils
  }

  public get redisClient(): RedisClient {
    return this._redisClient
  }
}
export { AuthInit }
