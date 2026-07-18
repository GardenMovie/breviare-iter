import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { checkUsernameAvailability, claimUsername } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"

type Availability = "checking" | "available" | "taken" | "error"

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/

export function ClaimUsername() {
  const { accessToken, setUser } = useAuth()
  const [username, setUsername] = useState("")
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidFormat = USERNAME_PATTERN.test(username)

  useEffect(() => {
    if (!accessToken || !isValidFormat) return
    let cancelled = false
    const timeout = setTimeout(() => {
      setAvailability("checking")
      checkUsernameAvailability(username, accessToken)
        .then((available) => {
          if (!cancelled) setAvailability(available ? "available" : "taken")
        })
        .catch(() => {
          if (!cancelled) setAvailability("error")
        })
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [username, accessToken, isValidFormat])

  const effectiveAvailability = isValidFormat ? availability : null

  const handleSubmit = async () => {
    if (!accessToken || effectiveAvailability !== "available") return
    setSubmitting(true)
    setError(null)
    try {
      const user = await claimUsername(username, accessToken)
      setUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Claim your username</h1>
        <p className="text-muted-foreground text-sm">
          This is also your vanity link slug, choose carefully.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          disabled={submitting}
          className="h-12"
        />
        {effectiveAvailability === "checking" && (
          <p className="text-sm text-muted-foreground">Checking availability…</p>
        )}
        {effectiveAvailability === "available" && (
          <p className="text-sm text-green-600">Available</p>
        )}
        {effectiveAvailability === "taken" && (
          <p className="text-sm text-destructive">Already taken</p>
        )}
        {effectiveAvailability === "error" && (
          <p className="text-sm text-destructive">Couldn't check availability</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={effectiveAvailability !== "available" || submitting}
      >
        {submitting ? "Saving…" : "Continue"}
      </Button>
    </div>
  )
}
