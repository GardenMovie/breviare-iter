import { apiRequest, setAccessToken } from "@/lib/api"

export type User = {
  id: string
  email: string
  username: string | null
  vanityDestination: string | null
  usernameChangedAt: string | null
  usernameChangesRemainingThisMonth: number
  vanityDestinationChangedAt: string | null
  vanityDestinationChangesRemainingThisMonth: number
  createdAt: string
}

export type AuthResponse = {
  user: User
  accessToken: string
}

export async function signInWithGoogle(idToken: string): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/api/v1/auth/google", {
    method: "POST",
    body: { idToken },
    auth: false,
  })
  setAccessToken(res.accessToken)
  return res
}

export async function refreshSession(): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/api/v1/auth/refresh", {
    method: "POST",
    auth: false,
  })
  setAccessToken(res.accessToken)
  return res
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/api/v1/auth/logout", { method: "POST", auth: false })
  setAccessToken(null)
}

export async function fetchMe(accessToken?: string | null): Promise<User> {
  return apiRequest<User>("/api/v1/users/me", { token: accessToken })
}

export async function checkUsernameAvailability(
  username: string,
  accessToken?: string | null,
): Promise<boolean> {
  const data = await apiRequest<{ available: boolean }>(
    `/api/v1/users/username-availability?username=${encodeURIComponent(username)}`,
    { token: accessToken },
  )
  return data.available
}

/** First claim only — changing an existing username goes through updateProfile. */
export async function claimUsername(username: string, accessToken?: string | null): Promise<User> {
  return apiRequest<User>("/api/v1/users/username", {
    method: "POST",
    body: { username },
    token: accessToken,
  })
}

export type ProfileUpdate = {
  username?: string
  /** "" clears the destination; omit the key to leave it untouched. */
  vanityDestination?: string
}

export async function updateProfile(
  update: ProfileUpdate,
  accessToken?: string | null,
): Promise<User> {
  return apiRequest<User>("/api/v1/users/me", {
    method: "PATCH",
    body: update,
    token: accessToken,
  })
}
