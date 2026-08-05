import { apiRequest } from "@/lib/api"

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

export async function fetchMyLinks(accessToken?: string | null): Promise<LinkAnalytics[]> {
  return apiRequest<LinkAnalytics[]>("/api/v1/users/me/links", { token: accessToken })
}

export type DailyClicks = {
  day: string
  clicks: number
}

export async function fetchLinkAnalytics(
  code: string,
  accessToken?: string | null,
): Promise<DailyClicks[]> {
  const data = await apiRequest<{ dailyClicks: DailyClicks[] }>(
    `/api/v1/links/${code}/analytics`,
    { token: accessToken },
  )
  return data.dailyClicks
}

export async function deleteLink(code: string, accessToken?: string | null): Promise<void> {
  await apiRequest<void>(`/api/v1/links/${code}`, { method: "DELETE", token: accessToken })
}

export async function createLink(
  destination: string,
  accessToken?: string | null,
): Promise<{ shortUrl: string }> {
  return apiRequest<{ shortUrl: string }>("/api/v1/links", {
    method: "POST",
    body: { destination },
    auth: Boolean(accessToken),
    token: accessToken,
  })
}
