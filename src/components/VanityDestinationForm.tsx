import { useState } from "react"
import { ExternalLink, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { ApiError } from "@/lib/api"
import { updateProfile } from "@/lib/auth"
import { buildVanityUrl, validateVanityDestination } from "@/lib/vanity"

export function VanityDestinationForm() {
  const { user, accessToken, setUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(user?.vanityDestination ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const current = user?.vanityDestination ?? ""

  // Reopening should always start from what's actually saved, not from a
  // half-typed value left behind by a dismissed edit.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setValue(current)
      setError(null)
      setSaved(false)
    }
    setOpen(next)
  }

  if (!user) return null

  // A vanity destination requires a claimed username; the server rejects it otherwise.
  if (!user.username) {
    return (
      <Button
        variant="link"
        size="sm"
        className="h-auto self-start p-0 text-muted-foreground"
        onClick={() => (window.location.href = "/registration")}
      >
        Claim a username to get a personal link
      </Button>
    )
  }

  const vanityUrl = buildVanityUrl(user.username)
  const remaining = user.vanityDestinationChangesRemainingThisMonth
  const quotaExhausted = remaining <= 0
  const trimmed = value.trim()
  const dirty = trimmed !== current

  const submit = async (next: string) => {
    setError(null)

    // Skip client validation when clearing — "" is always allowed.
    if (next !== "") {
      const validationError = validateVanityDestination(next)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setSaving(true)
    try {
      const updated = await updateProfile({ vanityDestination: next }, accessToken)
      setUser(updated)
      setValue(updated.vanityDestination ?? "")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      if (err instanceof ApiError) {
        // A 409 here reports "username already taken" even for vanity-only
        // updates, so show something that isn't actively misleading.
        setError(
          err.status === 409
            ? "That change conflicted with another update. Try again."
            : (err.firstDetail ?? err.message),
        )
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <a href={vanityUrl} className="font-mono truncate hover:underline">
        {vanityUrl.replace(/^https?:\/\//, "")}
      </a>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="shrink-0">
            <Pencil />
            <span className="sr-only">Edit vanity link destination</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vanity link</DialogTitle>
            <DialogDescription className="font-mono">
              {vanityUrl.replace(/^https?:\/\//, "")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label htmlFor="vanity-destination" className="text-sm text-muted-foreground">
              Points to
            </label>
            <div className="flex gap-2">
              <Input
                id="vanity-destination"
                type="url"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://example.com/your-page"
                disabled={saving || quotaExhausted}
                className="flex-1"
              />
              <Button onClick={() => submit(trimmed)} disabled={!dirty || saving || quotaExhausted}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && !error && <p className="text-sm text-green-600">Saved</p>}

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                {quotaExhausted
                  ? "No changes left this month."
                  : `${remaining} change${remaining === 1 ? "" : "s"} left this month.`}
              </p>
              <div className="flex gap-2">
                {current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground"
                  >
                    <a href={vanityUrl}>
                      <ExternalLink />
                      Test
                    </a>
                  </Button>
                )}
                {current && !quotaExhausted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => submit("")}
                    disabled={saving}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
