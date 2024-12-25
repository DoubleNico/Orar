/**
 * Parses the expiration time string and returns the equivalent time in seconds.
 * @param expiresIn - The expiration time string (e.g., '15m', '30d').
 * @returns The expiration time in seconds.
 */
export function parseExpiration(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([a-z]+)$/i)
  if (!match) throw new Error(`Invalid expiresIn format: ${expiresIn}`)

  const value = parseInt(match[1], 10)
  const unit = match[2].toLowerCase()

  switch (unit) {
    case 's':
      return value
    case 'm':
      return value * 60
    case 'h':
      return value * 60 * 60
    case 'd':
      return value * 24 * 60 * 60
    default:
      throw new Error(`Unsupported expiresIn unit: ${unit}`)
  }
}
