import { H3Event, setCookie, deleteCookie } from 'h3'
import type { CookieOptions } from '../types/CookieOptions'
import type { GeneralResponse } from '../types/GeneralResponse'

export class NuxtResponseAdapter implements GeneralResponse {
  private event: H3Event

  constructor(event: H3Event) {
    this.event = event
  }

  setCookie(name: string, value: string, options: CookieOptions): void {
    setCookie(this.event, name, value, {
      httpOnly: options.httpOnly,
      secure: options.secure,
      sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined,
      path: options.path,
      domain: options.domain,
      maxAge: options.maxAge,
    })
  }

  clearCookie(name: string, options: CookieOptions): void {
    deleteCookie(this.event, name, {
      httpOnly: options.httpOnly,
      secure: options.secure,
      sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined,
      path: options.path,
      domain: options.domain,
    })
  }
}
