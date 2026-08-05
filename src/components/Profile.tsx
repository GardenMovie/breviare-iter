import { useState } from "react"
import { Check, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LinkSparkline } from "@/components/LinkSparkline"
import { VanityDestinationForm } from "@/components/VanityDestinationForm"
import { useAuth } from "@/hooks/use-auth"
import { useLinks } from "@/hooks/use-links"
import { deleteLink } from "@/lib/links"
import { buildVanityUrl } from "@/lib/vanity"

export function Profile() {
  const { user, accessToken } = useAuth()
  const state = useLinks()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [profileCopied, setProfileCopied] = useState(false)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleCopy = async (code: string, shortUrl: string) => {
    await navigator.clipboard.writeText(shortUrl)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode((current) => (current === code ? null : current)), 1500)
  }

  const handleDelete = async (code: string) => {
    if (!accessToken) return
    setDeletingCode(code)
    setDeleteError(null)
    try {
      await deleteLink(code, accessToken)
      state.removeLink(code)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete link")
    } finally {
      setDeletingCode(null)
    }
  }

  const profileUrl = user?.username ? buildVanityUrl(user.username) : null

  const handleCopyProfileUrl = async () => {
    if (!profileUrl) return
    await navigator.clipboard.writeText(profileUrl)
    setProfileCopied(true)
    setTimeout(() => setProfileCopied(false), 1500)
  }

  return (
    <div className="w-[90%] md:w-[50%] mb-14 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">
            {user?.username ? user.username : "Your links"}
          </h1>
          {profileUrl && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={handleCopyProfileUrl}
            >
              {profileCopied ? <Check /> : <Copy />}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {user?.vanityDestination ? (
            <>
              Points to{" "}
              <a
                href={user.vanityDestination}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:underline"
              >
                {user.vanityDestination.replace(/^https?:\/\//, "")}
              </a>
            </>
          ) : (
            "Manage your shortened links and analytics."
          )}
        </p>
      </div>

      <VanityDestinationForm />

      {state.status === "loading" && (
        <p className="text-sm text-muted-foreground">Loading your links…</p>
      )}

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}

      {state.status === "done" && state.links.length === 0 && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            You haven't shortened any links yet.
          </CardContent>
        </Card>
      )}

      {state.status === "done" &&
        state.links.map((link) => (
          <Card key={link.code}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm text-foreground truncate">{link.displayCode}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0"
                      onClick={() => handleCopy(link.code, link.shortUrl)}
                    >
                      {copiedCode === link.code ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{link.destination}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-muted-foreground">
                    {link.clickCount} click{link.clickCount === 1 ? "" : "s"}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this link?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete{" "}
                          <span className="font-mono text-foreground">{link.displayCode}</span> and its
                          analytics. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(link.code)}
                          disabled={deletingCode === link.code}
                        >
                          {deletingCode === link.code ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <LinkSparkline code={link.code} />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
