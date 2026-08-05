import { useCallback, useEffect, useState, type ReactNode } from "react"
import { refreshSession, logout as logoutRequest, type User } from "@/lib/auth"
import { registerAuthHandlers, setAccessToken as setApiAccessToken } from "@/lib/api"
import { AuthContext } from "@/hooks/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const setAccessToken = useCallback((token: string | null) => {
    setApiAccessToken(token)
    setAccessTokenState(token)
  }, [])

  // Let the API layer's 401 interceptor push a refreshed token back into state,
  // and clear the session when the refresh itself fails.
  useEffect(() => {
    registerAuthHandlers({
      onTokenRefreshed: (token) => setAccessTokenState(token),
      onRefreshFailed: () => {
        setUser(null)
        setAccessTokenState(null)
      },
    })
  }, [])

  useEffect(() => {
    refreshSession()
      .then((res) => {
        setUser(res.user)
        setAccessToken(res.accessToken)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setAccessToken])

  const signIn = useCallback(
    (user: User, accessToken: string) => {
      setUser(user)
      setAccessToken(accessToken)
    },
    [setAccessToken],
  )

  const signOut = useCallback(async () => {
    await logoutRequest()
    setUser(null)
    setAccessToken(null)
  }, [setAccessToken])

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, signIn, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
