export type ApiErrorShape = {
  code: string
  message: string
  details?: Record<string, string>
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly details?: Record<string, string>

  constructor(status: number, { code, message, details }: ApiErrorShape) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }

  /** First field-level message from a bean-validation failure, if any. */
  get firstDetail(): string | null {
    if (!this.details) return null
    const values = Object.values(this.details)
    return values.length > 0 ? values[0] : null
  }
}

/**
 * The access token lives in React state, but the 401 interceptor below needs to
 * read the current one and write a refreshed one from outside the component
 * tree. AuthProvider keeps these in sync.
 */
let currentAccessToken: string | null = null
let onTokenRefreshed: ((token: string) => void) | null = null
let onRefreshFailed: (() => void) | null = null

export function setAccessToken(token: string | null) {
  currentAccessToken = token
}

export function registerAuthHandlers(handlers: {
  onTokenRefreshed: (token: string) => void
  onRefreshFailed: () => void
}) {
  onTokenRefreshed = handlers.onTokenRefreshed
  onRefreshFailed = handlers.onRefreshFailed
}

function normalizeError(status: number, body: unknown): ApiError {
  const error = (body as { error?: unknown } | null)?.error

  if (error && typeof error === "object") {
    const { code, message, details } = error as Partial<ApiErrorShape>
    return new ApiError(status, {
      code: code ?? "UNKNOWN",
      message: message ?? `Request failed (${status})`,
      details,
    })
  }

  // Older/plainer error shapes the backend may still emit.
  const message =
    typeof error === "string"
      ? error
      : ((body as { message?: string } | null)?.message ?? `Request failed (${status})`)

  return new ApiError(status, { code: "UNKNOWN", message })
}

/**
 * Refreshing is shared: several requests can 401 at once (the profile page
 * fires a handful in parallel) and they must not each burn a refresh.
 */
let inFlightRefresh: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  if (!inFlightRefresh) {
    inFlightRefresh = (async () => {
      const res = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) throw new ApiError(res.status, { code: "UNAUTHENTICATED", message: "Session expired" })

      const body = await res.json().catch(() => null)
      const token = (body as { data?: { accessToken?: string } } | null)?.data?.accessToken
      if (!token) throw new ApiError(500, { code: "INTERNAL_ERROR", message: "Malformed refresh response" })

      return token
    })()

    // Clear the slot regardless of outcome so a later 401 can retry.
    inFlightRefresh.then(
      () => {
        inFlightRefresh = null
      },
      () => {
        inFlightRefresh = null
      },
    )
  }

  return inFlightRefresh
}

type RequestOptions = {
  method?: string
  body?: unknown
  /** Send the bearer token. Defaults to true. */
  auth?: boolean
  /** Explicit token, for calls made before AuthProvider has stored one. */
  token?: string | null
}

async function send(path: string, options: RequestOptions, token: string | null): Promise<Response> {
  const { method = "GET", body, auth = true } = options
  return fetch(path, {
    method,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
}

/**
 * Unwraps the `{ data }` envelope, throws a typed ApiError on `{ error }`, and
 * transparently refreshes-and-replays once on a 401.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true } = options
  let token = options.token !== undefined ? options.token : currentAccessToken

  let res = await send(path, options, token)

  if (res.status === 401 && auth) {
    try {
      token = await refreshAccessToken()
      currentAccessToken = token
      onTokenRefreshed?.(token)
    } catch {
      onRefreshFailed?.()
      throw new ApiError(401, { code: "UNAUTHENTICATED", message: "Your session has expired. Please sign in again." })
    }
    res = await send(path, options, token)
  }

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => null)
  if (!res.ok) throw normalizeError(res.status, body)

  return (body as { data: T }).data
}
