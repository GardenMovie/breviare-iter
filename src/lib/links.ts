export type LinkAnalytics = {
  code: string
  displayCode: string
  shortUrl: string
  destination: string
  ownerId: string
  createdAt: string
  lastClickedAt: string | null
  inactivityTtlDays: number | null
  absoluteExpiresAt: string | null
  clickCount: number
  isExpired: boolean
  expiredAt: string | null
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      (typeof data?.error === "object" ? data.error?.message : null) ??
      data?.message ??
      (typeof data?.error === "string" ? data.error : null) ??
      `Request failed (${res.status})`
    throw new Error(message)
  }
  return data.data as T
}

export async function fetchMyLinks(accessToken: string): Promise<LinkAnalytics[]> {
  const res = await fetch("/api/v1/users/me/links", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return parseJsonResponse<LinkAnalytics[]>(res)
}

export type DailyClicks = {
  day: string
  clicks: number
}

export async function fetchLinkAnalytics(code: string, accessToken: string): Promise<DailyClicks[]> {
  const res = await fetch(`/api/v1/links/${code}/analytics`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await parseJsonResponse<{ dailyClicks: DailyClicks[] }>(res)
  return data.dailyClicks
}

export async function createLink(destination: string, accessToken?: string | null): Promise<{ shortUrl: string }> {
  const res = await fetch("/api/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ destination }),
  })
  return parseJsonResponse<{ shortUrl: string }>(res)
}
