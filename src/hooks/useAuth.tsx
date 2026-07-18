import { useCallback, useEffect, useState, type ReactNode } from "react"
import { refreshSession, logout as logoutRequest, type User } from "@/lib/auth"
import { AuthContext } from "@/hooks/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshSession()
      .then((res) => {
        setUser(res.user)
        setAccessToken(res.accessToken)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback((user: User, accessToken: string) => {
    setUser(user)
    setAccessToken(accessToken)
  }, [])

  const signOut = useCallback(async () => {
    await logoutRequest()
    setUser(null)
    setAccessToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, signIn, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
