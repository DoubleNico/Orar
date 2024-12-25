export class RedisClient {
  public set(
    key: string,
    value: string,
    expiresInSeconds?: number,
  ): Promise<void> {
    if (expiresInSeconds) {
      return useStorage().set(`redis:${key}`, value, { ttl: expiresInSeconds })
    } else {
      return useStorage().set(`redis:${key}`, value)
    }
  }

  public get(key: string): Promise<string | null> {
    return useStorage().get(`redis:${key}`)
  }

  public del(key: string): Promise<void> {
    return useStorage().removeItem(`redis:${key}`)
  }

  public exists(key: string): Promise<boolean> {
    return useStorage().has(`redis:${key}`)
  }
}
