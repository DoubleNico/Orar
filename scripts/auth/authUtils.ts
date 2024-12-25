import jwt from 'jsonwebtoken'
import { TRPCError } from '@trpc/server'
import { RedisClient } from './redisClient.js'
import type { CookieOptions } from './types/CookieOptions.js'
import type { GeneralResponse } from './types/GeneralResponse.js'
import type { RefreshTokenData } from './types/RefreshTokenData.js'
import type { AccessTokenData } from './types/AccessTokenData.js'
import { parseExpiration } from './utils/parseExpiration.js'

export class AuthUtils {
  private redis: RedisClient
  private accessTokenSecret: string
  private refreshTokenSecret: string
  private accessTokenExpiresIn: string
  private refreshTokenExpiresIn: string
  private cookieOptions: CookieOptions

  constructor(
    redis: RedisClient,
    accessTokenSecret: string,
    refreshTokenSecret: string,
    accessTokenExpiresIn: string = '15m',
    refreshTokenExpiresIn: string = '30d',
    httpOnly: boolean = true,
    sameSite: 'lax' | 'strict' | 'none' = 'lax',
    path: string = '/',
    isProduction: boolean = false,
    domain: string = '',
  ) {
    this.redis = redis
    this.accessTokenSecret = accessTokenSecret
    this.refreshTokenSecret = refreshTokenSecret
    this.accessTokenExpiresIn = accessTokenExpiresIn
    this.refreshTokenExpiresIn = refreshTokenExpiresIn

    this.cookieOptions = {
      httpOnly,
      secure: isProduction,
      sameSite,
      path,
      domain: isProduction ? `.${domain}` : '',
    }
  }

  /**
   * Returns the Redis client instance.
   */
  public getRedis(): RedisClient {
    return this.redis
  }

  /**
   * Returns the access token secret.
   */
  public getAccessTokenSecret(): string {
    return this.accessTokenSecret
  }

  /**
   * Returns the refresh token secret.
   */
  public getRefreshTokenSecret(): string {
    return this.refreshTokenSecret
  }

  /**
   * Returns the access token expiration time as a string.
   */
  public getAccessTokenExpiresIn(): string {
    return this.accessTokenExpiresIn
  }

  /**
   * Returns the refresh token expiration time as a string.
   */
  public getRefreshTokenExpiresIn(): string {
    return this.refreshTokenExpiresIn
  }

  /**
   * Returns the cookie options.
   */
  public getCookieOptions(): CookieOptions {
    return this.cookieOptions
  }

  /**
   * Parses the expiration time string and returns the equivalent time in seconds.
   * @param expiresIn - The expiration time string (e.g., '15m', '30d').
   * @returns The expiration time in seconds.
   */
  public getExpirationInSeconds(expiresIn: string): number {
    return parseExpiration(expiresIn)
  }

  /**
   * Sends authentication cookies to the client.
   * @param res - The GeneralResponse object.
   * @param userId - The user ID.
   * @param oldRefreshToken - The old refresh token (optional).
   */
  public async sendAuthCookies(
    res: GeneralResponse,
    userId: string,
    oldRefreshToken?: string,
  ): Promise<void> {
    if (oldRefreshToken) {
      const oldData = jwt.verify(
        oldRefreshToken,
        this.refreshTokenSecret,
      ) as RefreshTokenData
      await this.redis.del(oldData.refreshTokenId)
      console.log(`Deleted old refresh token: ${oldData.refreshTokenId}`)
    }

    const refreshTokenId = `${userId}-${Date.now()}`
    const { accessToken, refreshToken } = this.createAuthTokens(
      userId,
      refreshTokenId,
    )

    await this.redis.set(
      refreshTokenId,
      userId,
      parseExpiration(this.refreshTokenExpiresIn),
    )

    res.setCookie('id', accessToken, {
      ...this.cookieOptions,
      maxAge: parseExpiration(this.accessTokenExpiresIn),
    })
    res.setCookie('rid', refreshToken, {
      ...this.cookieOptions,
      maxAge: parseExpiration(this.refreshTokenExpiresIn),
    })
  }

  /**
   * Clears authentication cookies from the client.
   * @param res - The GeneralResponse object.
   * @param refreshToken - The refresh token.
   */
  public async clearAuthCookies(
    res: GeneralResponse,
    refreshToken: string,
  ): Promise<void> {
    const data = jwt.verify(
      refreshToken,
      this.refreshTokenSecret,
    ) as RefreshTokenData
    console.log(`Deleting refresh token: ${data.refreshTokenId}`)
    await this.redis.del(data.refreshTokenId)
    res.clearCookie('id', this.cookieOptions)
    res.clearCookie('rid', this.cookieOptions)
  }

  /**
   * Checks the validity of the access token and refresh token.
   * @param accessToken - The access token.
   * @param refreshToken - The refresh token.
   * @returns An object containing the userId, newAccessToken, and newRefreshToken if the tokens are valid.
   */
  public async checkTokens(accessToken: string, refreshToken: string) {
    try {
      const data = jwt.verify(
        accessToken,
        this.accessTokenSecret,
      ) as AccessTokenData

      console.log('Access token is valid for user:', data.userId)
      return { userId: data.userId, newAccessToken: null }
    } catch {
      if (!refreshToken) throw new TRPCError({ code: 'UNAUTHORIZED' })

      let data: RefreshTokenData
      try {
        data = jwt.verify(
          refreshToken,
          this.refreshTokenSecret,
        ) as RefreshTokenData
      } catch {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const userId = await this.redis.get(data.refreshTokenId)
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const newAccessToken = jwt.sign({ userId }, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpiresIn,
      })

      console.log('Generated a new access token for user:', userId)

      return { userId, newAccessToken }
    }
  }

  /**
   * Creates and returns a new access token and refresh token.
   * @param userId - The user ID.
   * @param refreshTokenId - The refresh token ID.
   * @returns An object containing the refreshToken and accessToken.
   */
  private createAuthTokens(
    userId: string,
    refreshTokenId: string,
  ): { refreshToken: string; accessToken: string } {
    const refreshToken = jwt.sign(
      { userId, refreshTokenId },
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiresIn },
    )

    const accessToken = jwt.sign({ userId }, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    })

    return { refreshToken, accessToken }
  }
}
