import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ShortenState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; shortUrl: string }
  | { status: "error"; message: string }

export function ShortenForm() {
  const [url, setUrl] = useState("")
  const [state, setState] = useState<ShortenState>({ status: "idle" })

  const handleSubmit = async () => {
    if (!url) return
    setState({ status: "loading" })
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/shorten", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ url }),
      // })
      // const data = await res.json()
      // if (!res.ok) throw new Error(data.message ?? "Something went wrong")
      // setState({ status: "done", shortUrl: data.shortUrl })
      await new Promise((r) => setTimeout(r, 800))
      setState({ status: "done", shortUrl: `https://brv.re/abc123` })
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong" })
    }
  }

  const reset = () => {
    setUrl("")
    setState({ status: "idle" })
  }

  const loading = state.status === "loading"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Shorten a URL</h2>
        <p className="text-sm text-muted-foreground">
          Paste a long link to get a short one.
        </p>
      </div>

      {state.status === "done" ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 p-4 rounded-lg border border-border bg-muted/40">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Your short link</span>
            <span className="text-lg font-mono font-medium text-foreground break-all">{state.shortUrl}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigator.clipboard.writeText(state.shortUrl)}
            >
              Copy
            </Button>
            <Button variant="outline" className="flex-1" onClick={reset}>
              Shorten another
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Long URL</label>
            <Input
              type="url"
              placeholder="https://example.com/very/long/url/here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="h-12 text-2xl"
            />
          </div>

          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <Button size="lg" className="w-full" onClick={handleSubmit} disabled={!url || loading}>
            {loading ? "Shortening…" : "Shorten"}
          </Button>
        </div>
      )}
    </div>
  )
}
