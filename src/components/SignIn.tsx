import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GoogleSignInButton } from "@/components/GoogleSignInButton"
import { ClaimUsername } from "@/components/ClaimUsername"
import { useAuth } from "@/hooks/use-auth"
import { signInWithGoogle } from "@/lib/auth"

export function SignIn() {
  const { user, signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleCredential = useCallback(
    async (idToken: string) => {
      setError(null)
      try {
        const res = await signInWithGoogle(idToken)
        signIn(res.user, res.accessToken)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    },
    [signIn],
  )

  if (user && !user.username) {
    return (
      <div className="w-[90%] md:w-[40%] mb-14">
        <Card className="p-6">
          <CardContent>
            <ClaimUsername />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user) {
    return (
      <div className="w-[90%] md:w-[40%] mb-14 flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">You're signed in</h1>
        <p className="text-muted-foreground">Welcome back, {user.username}.</p>
      </div>
    )
  }

  return (
    <div className="w-[90%] md:w-[40%] mb-14 flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Sign in to Breviare</h1>
        <p className="text-muted-foreground">
          Create an account or sign in with Google to start tracking your links.
        </p>
      </div>
      <Card className="p-6">
        <CardContent className="flex flex-col gap-4 items-center">
          <GoogleSignInButton onCredential={handleCredential} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
