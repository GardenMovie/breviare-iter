import { createContext } from "react"
import type { User } from "@/lib/auth"

export type AuthContextValue = {
  user: User | null
  accessToken: string | null
  loading: boolean
  signIn: (user: User, accessToken: string) => void
  setUser: (user: User) => void
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
