/**
 * The short-link domain used to build `/u/<username>` display strings. May
 * differ from the API host, so it is configured separately; falls back to the
 * current origin, which is correct when the frontend is served from BASE_URL.
 */
export function getBaseUrl(): string {
  return import.meta.env.VITE_BASE_URL || window.location.origin
}

export function buildVanityUrl(username: string): string {
  return `${getBaseUrl()}/u/${username}`
}

/**
 * Mirrors the server's validation so users get instant feedback. The server
 * still has the final say — blocklist and Safe Browsing checks only run there.
 */
export function validateVanityDestination(value: string): string | null {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return "Enter a valid URL, including https://"
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Only http and https URLs are allowed"
  }

  if (!url.hostname) {
    return "URL must include a host"
  }

  const strip = (host: string) => host.replace(/^www\./, "").toLowerCase()
  const target = strip(url.hostname)

  let baseHost: string
  try {
    baseHost = strip(new URL(getBaseUrl()).hostname)
  } catch {
    return null
  }

  if (target === baseHost || target.endsWith(`.${baseHost}`)) {
    return "URL cannot point back to a breviare short link"
  }

  return null
}
