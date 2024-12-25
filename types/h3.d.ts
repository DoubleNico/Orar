import 'h3'

declare module 'h3' {
  interface H3EventContext {
    userId?: string | null
    newAccessToken?: string | null
  }
}
