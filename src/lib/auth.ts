export type User = {
  id: string
  email: string
  username: string | null
}

export type AuthResponse = {
  user: User
  accessToken: string
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Something went wrong")
  return data.data as T
}

export async function signInWithGoogle(idToken: string): Promise<AuthResponse> {
  const res = await fetch("/api/v1/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  })
  return parseJsonResponse<AuthResponse>(res)
}

export async function refreshSession(): Promise<AuthResponse> {
  const res = await fetch("/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
  })
  return parseJsonResponse<AuthResponse>(res)
}

export async function logout(): Promise<void> {
  await fetch("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  })
}

export async function checkUsernameAvailability(
  username: string,
  accessToken: string,
): Promise<boolean> {
  const res = await fetch(
    `/api/v1/users/username-availability?username=${encodeURIComponent(username)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  const data = await parseJsonResponse<{ available: boolean }>(res)
  return data.available
}

export async function claimUsername(username: string, accessToken: string): Promise<User> {
  const res = await fetch("/api/v1/users/username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ username }),
  })
  return parseJsonResponse<User>(res)
}
